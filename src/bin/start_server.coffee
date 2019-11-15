# start_server.coffee

host = 'alcarruth.net'
port = 8080
path = '/'

# credentials = require('./credentials.coffee')
# https = require('https')
# web_server = https.createServer(credentials, null)

http = require('http')
web_server = http.createServer(null)

lib = require('/var/www/alcarruth/ws_obj/scripts/ws_object_server.coffee')
WS_Object_Server = lib.WS_Object_Server
server = new WS_Object_Server(web_server, host, port, path)
  
server.set(
  style:  {
    backgroundColor: "blue"
    color: "white"
    border: "1px solid #800"
    fontFamily: "sans-serif"
    borderRadius: "30px"
})
    
startup_message = ->
  d = new Date()
  date = d.toLocaleDateString()
  time = d.toLocaleTimeString()
  url = "wss://#{host}:#{port}#{path}"
  msg="#{date} #{time}: server started - #{url}"
  dashes = ('-' for _ in [0...msg.length]).join('')
  return "\n#{dashes}\n#{msg}"

server.start()
console.log startup_message()
console.log server.obj
exports.server = server


