#!/bin/bash

SRC_DIR="$(dirname $0)"

echo "Deploying themepark management server..."

echo "Checking for docker..."
if ! command -v docker 2>&1 >/dev/null
then
    echo "Docker could not be found. Make sure it is installed and available on the system path."
    exit 1
else
    echo "SUCCESS."
fi

echo "Checking for docker compose..."
if [ -x "$(command -v docker-compose)" ]; then
    echo "SUCCESS: docker-compose (v1) is installed."
    DOCKER_CMD="docker-compose"
elif $(docker compose &>/dev/null) && [ $? -eq 0 ]; then
    echo "SUCCESS: docker compose (v2) is installed."
    DOCKER_CMD="docker compose"
else
    echo "ERROR: neither \"docker-compose\" nor \"docker compose\" appear to be installed."
    exit 1
fi

mkdir $SRC_DIR/server_root

echo "Pulling node.js image..."
$DOCKER_CMD pull

echo "Installing dependencies..."
$DOCKER_CMD run themepark-server npm install libsodium-wrappers-sumo express express-session ejs mysql2 knex express-mysql-session --save # other packages can be added here

echo "Copying server scripts..."
cp $SRC_DIR/main.js $SRC_DIR/tp_auth.js $SRC_DIR/tp_db.js $SRC_DIR/server_root

echo "Copying server certs..."
cp $SRC_DIR/server-cert.pem $SRC_DIR/server-key.pem $SRC_DIR/server_root

echo "Starting server..."
$DOCKER_CMD up --remove-orphans