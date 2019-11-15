# start_server.coffee

#host = 'alcarruth.net'
#host = 'linode-02.armazilla.net'
#host = '192.168.155.57'
#host = '192.168.233.45'
host = 'localhost'
port = 8080
path = '/'
obj_file = './ws_obj.json'

# credentials = require('./credentials.coffee')
# https = require('https')
# web_server = https.createServer(credentials, null)

http = require('http')
web_server = http.createServer(null)

#lib = require('/var/www/alcarruth/ws_obj/scripts/ws_object_server.coffee')
lib = require('./ws_object_server.coffee')
WS_Object_Server = lib.WS_Object_Server
server = new WS_Object_Server(web_server, host, port, path, obj_file)
    
startup_message = ->
  d = new Date()
  date = d.toLocaleDateString()
  time = d.toLocaleTimeString()
  url = "http://#{host}:#{port}#{path}"
  msg="#{date} #{time}: server started - #{url}"
  dashes = ('-' for _ in [0...msg.length]).join('')
  return "\n#{dashes}\n#{msg}"

server.start()
console.log startup_message()
console.log server.obj
exports.server = server


