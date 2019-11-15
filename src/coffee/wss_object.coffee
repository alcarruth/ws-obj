#!/usr/local/bin/coffee
# object_server_ws.coffee
# 

WebSocket = require('ws')

class WS_Object

  constructor: (@host, @port, @credentials) ->
    
    @obj = {}
    @parent = null
    @clients = []

    if @credentials?
      https = require('https')
      @server = https.createServer(@credentials, null)
    else
      http = require('http')
      @server = http.createServer(null)
    @wss = new WebSocket.Server(server: @server)
    @wss.on('connection', (client) =>
      client.on('message', (msg) =>
        @handle_msg(msg, client))
      @clients.push(client))

  start: =>
    @server.listen(@port, @host)

  stop: =>
    @server.close()
    
  handle_msg: (msg, sender) =>
    console.log msg
    rmi = JSON.parse(msg)
    this[rmi.method].apply(this, [rmi.args, sender])
          
  set_parent: (host, port, ssl) =>
    if ssl
      url = "https://#{host}:#{port}"
    else
      url = "ws://#{host}:#{port}"
    @parent = new WebSocket(url)
    @parent.on('open', () =>
      @parent.send(JSON.stringify(
        method: 'get')))
    @parent.on('message', (msg) =>
      @handle_msg(msg, @parent))

  set: (args) =>
    if @parent
      @parent.send(JSON.stringify(
        method: 'set'
        args: args))
    else
      @update(args)
      
  get: (args, caller) =>
    caller?.send(JSON.stringify(
      method: 'update'
      args: @obj))
    @obj

  update: (args) =>
    @obj[k] = v for k,v of args
    console.log @obj
    msg = JSON.stringify(
      method: 'update'
      args: @obj)
    c.send(msg) for c in @clients


exports.WS_Object = WS_Object
