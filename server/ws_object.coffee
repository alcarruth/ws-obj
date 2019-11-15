#!/usr/local/bin/coffee
#
#  ws_object.coffee
#
 
WebSocket = window?.WebSocket || require('ws')
  
#------------------------------------------------------------------------
#
# Three methods: set, get and update, operate on
# the wrapped object. 

class WS_Object

  constructor: (@url) ->
    @obj = {}
    @ws = null
    @views = []
    @clients = {}

  init: (args) =>
    @id = args.id 
  
  notify: (flag) =>
    for view in @views
      view.connected(flag)
    
  connect: =>
    
    @ws = new WebSocket(@url)
    
    @ws.onopen = =>
      @notify(true)
      @ws.send(JSON.stringify(
        ['get', {}]))
    
    @ws.onclose = =>
      console.log('websocket closing.')
      @notify(false)
        
    @ws.onmessage = (msg) =>
      console.log(msg)
      [method, args] = JSON.parse(msg.data)
      #console.log args
      this[method](args)

    return @ws

  disconnect: =>
    @ws.send(JSON.stringify(
      ['end', {id: @id}]))

  error: (evt) =>
    console.log('error: ' + evt.data + '\n')
    #@ws.close()
    #@notify(false)

  # TODO: handle case where websocket is no longer open.
  # Note that the ws.connect() method is async and handled
  # by @ws.onopen() defined above.
  # So, how do we hook into that here?
  # 
  set: (args) =>
    args = args || @obj
    if @ws
      @ws.send(JSON.stringify(
        ['set', args]))
    else
      console.log("cannot set. websocket closed.")
      @update(args)
      
  get: (args, caller) =>
    caller.send(JSON.stringify(
      ['update', @obj]))
    @obj

  update: (args) =>
    @obj[k] = v for k,v of args
    for id,client of @clients
      console.log('updating client ' + id)
      client.send(JSON.stringify(
        ['update', @obj]))
    for view in @views
      view.update(args)


if window?
  window.WS_Object = WS_Object
  
else
  exports.WS_Object = WS_Object


