

init = ->
  ws_obj = new WS_Object('wss://' + location.host + '/apps/ws-obj-example')
  for i in [0,1]
    client = new WS_Client_View('views', i, ws_obj)
    ws_obj.views.push(client)

  window.app = 
    ws_obj: ws_obj

init()


    
