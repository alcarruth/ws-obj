#!/bin/bash
# start_server.sh

NODE_ROOT="/opt/node-v8.9.1-linux-x64/"
export PATH="$NODE_ROOT/bin:$PATH"
export NODE_PATH="$NODE_ROOT/lib/node_modules"

#APP_DIR="/usr/local/share/carruth/alcarruth_net/";
APP_DIR="/var/www/alcarruth/ws_obj/scripts/";

coffee ${APP_DIR}/start_server.coffee;


