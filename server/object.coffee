#!/usr/local/bin/coffee
#
# object.coffee
#
class Node

  constructor: ->
    @o = {}
    @p = null
    @cs = []

  add_p: (n) =>
    @p = n
    @p.cs.push(this)

  set: (k,v) =>
    if @p
      @p.set(k,v)
    else
      @update({k:v})
    return @o
      
  get: (k) =>
    return @o[k]

  req: =>
    if @p
      @p.req()
    else
      @update(@o)
    
  update: (o) =>
    @o[k] = v for k,v of o
    for c in @cs
      c.update(o)
    return @o


if window?
  window.Node = Node
else
  exports.Node = Node
