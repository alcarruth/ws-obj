#!/bin/sh

rm -rf browser server
mkdir -p browser/bin browser/js browser/css server

cp src/index.html browser/
cp -a src/css browser/
cp -a src/bin browser/
cp -a src/coffee/* server

coffee -cM -o browser/js src/coffee/ws_object.coffee
coffee -cM -o browser/js src/coffee/ws_object_server.coffee
coffee -cM -o browser/js src/coffee/ws_client_view.coffee
coffee -cM -o browser/js src/coffee/ws_example.coffee

