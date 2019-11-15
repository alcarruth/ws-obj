#!/usr/local/bin/coffee
#
#  ws_object_server.coffee
#

WebSocket = require('ws')
WS_Object = require('./ws_object.coffee').WS_Object
fs = require('fs')

class WS_Object_Server extends WS_Object

  constructor: (@server, @host, @port, @path, @obj_file) ->
    super()
    @clients = {}
    @next_id = 0
    @load()
    @wss = new WebSocket.Server(server: @server)
    
    @wss.on('connection', (client) =>
      #id = client._ultron.id
      id = @next_id
      @next_id += 1
      console.log('client_' + id + ' connected.')
      @clients[id] = client
      client.client_id = id
      client.onmessage = (msg) =>
        [method, args] = JSON.parse(msg.data)
        console.log method
        this[method](args, client)
      client.onclose = (client) =>
        console.log('client_' + id + ' disconnected.')
        delete @clients[id]
      msg = JSON.stringify([ 'init', { id: id} ])
      client.send(msg))

  end: (args, client) =>
    id = args.id
    console.log('client_' + id + ' disconnecting')
    client.close()
    delete @clients[id]
    
  start: =>
    if @server?
      @server.listen(@port, @host)
      console.log("listening at #{@host}:#{@port}")
      
  stop: =>
    if @server?
      @server.close()

  load: =>
    @obj = JSON.parse(fs.readFileSync(@obj_file, 'utf-8'))
    
  save: =>
    obj_json = JSON.stringify(@obj,null,3)
    fs.writeFile(@obj_file, obj_json, (err) ->
      console.log(obj_json))
    
  update: (args) =>
    @obj[k] = v for k,v of args
    @save()
    for id,client of @clients
      console.log('updating client ' + id)
      client.send(JSON.stringify(['update', @obj]))
    for view in @views
      view.update(args)



exports.WS_Object_Server = WS_Object_Server


