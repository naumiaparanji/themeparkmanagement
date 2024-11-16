#!/bin/bash

SRC_DIR="$(dirname "$0")"

# shellcheck disable=SC2164
cd "$SRC_DIR"

export MYSQL_ADDR=172.16.0.2
export MYSQL_DB=themepark_db
export MYSQL_USER=admin
export MYSQL_PASS=Ckq2Pd4VwytKZjLv
export APP_ADMIN_USER=root
export APP_ADMIN_PASS=password
export CLIENT_ORIGIN=http://localhost:3000
export SERVER_PORT=8080

echo Running server...
npm install && node main.js
