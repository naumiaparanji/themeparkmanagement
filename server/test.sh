#!/bin/bash

SRC_DIR="$(dirname $0)"

cd $SRC_DIR

export MYSQL_ADDR=172.16.0.2
export MYSQL_DB=themepark_db
export MYSQL_KEYSTORE_DB=keystore_db
export MYSQL_USER=admin
export MYSQL_PASS=Ckq2Pd4VwytKZjLv
export SERVER_PORT=8080

echo "Installing dependencies..."
npm install libsodium-wrappers-sumo express express-session ejs mysql2 knex express-mysql-session --save # other packages can be added here

node main.js