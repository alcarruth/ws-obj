#!/bin/env coffee
#
# ws_client.coffee
#

WebSocket = window?.WebSocket || require('ws')
 
#------------------------------------------------------------------------
#


view_html = (suffix) ->
  return """
    <div id="ws-client-view-#{suffix}" class="ws-client-view">
      <h2> websocket object example </h2>
      <form class="ws-client-form">
        <p><textarea class="text-area" rows="10" cols="40"></textarea></p>
        <p><text class="url"> </text></p>
        <p>
          <input type="button" class="set-button" value="Set">
          <input type="button" class="disconnect-button" value="Disconnect">
          <input type="button" class="connect-button" value="Connect">
          <input id="color-picker-#{suffix}" class="color-picker">
          <input id="background-picker-#{suffix}" class="background-picker">
        </p>
      </form>
    </div>
"""

class WS_Client_View

  constructor: (parent_id, @n, @ws_obj) ->
    @parent = $("##{parent_id}")
    @id = "ws-client-view-#{@n}"
    div = document.createElement('div')
    div.innerHTML = view_html(@n)
    @parent.append(div)
    @e = document.getElementById(@id)
    @jq = $('#' + @id)

    #@ws_client_view = @find('ws-client-view')
    @form = @find('ws-client-form')
    @text_area = @find('text-area')

    @url = @find('url')
    @url.value = @ws_obj.url

    @set_button = @find('set-button')
    @set_button.onclick = =>
      obj = JSON.parse(@text_area.value || '{}')
      @ws_obj.set(obj)

    @connect_button = @find('connect-button')
    @connect_button.onclick = @ws_obj.connect
    @disconnect_button = @find('disconnect-button')
    @disconnect_button.onclick = @ws_obj.disconnect
    @connected(false)

    @color_picker = $("#color-picker-#{@n}")
    @background_picker = $("#background-picker-#{@n}")
    
    @color_picker.spectrum {
      color: "#f00"
      move:  (color) =>
        color = color.toHexString()
        obj = JSON.parse(@text_area.value || '{}')
        obj.style.color = color
        @ws_obj.set(obj)}
        
    @background_picker.spectrum {
      color: "#f00"
      move:  (color) =>
        color = color.toHexString()
        obj = JSON.parse(@text_area.value || '{}')
        obj.style.backgroundColor = color
        @ws_obj.set(obj)}
    
  find: (className) =>
    @e.getElementsByClassName(className)[0]

  write: (obj) =>
    @text_area.value = obj.toString()
    @text_area.scrollTop = @text_area.scrollHeight

  update: (obj) =>
    @write(JSON.stringify(obj,null,2))
    #$('#color-picker-1').spectrum("set", obj.style.color)
    #$('#background-picker-1').spectrum("set", obj.style.backgroundColor)
    @color_picker.spectrum("set", obj.style.color)
    @background_picker.spectrum("set", obj.style.backgroundColor)
    for k,v of obj.style || {}
      @e.style[k] = v
          
  connected: (flag) =>
    @set_button.disabled = !flag
    @connect_button.disabled = flag
    @disconnect_button.disabled = !flag

  set_style: (style) =>
    for k,v of style
      @e.style[k] = v
             

if window?
  window.WS_Client_View = WS_Client_View
  
