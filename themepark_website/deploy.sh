#!/bin/bash
# NODE MUST BE INSTALLED ON THE HOST SYSTEM

SRC_DIR="$(dirname $0)"

echo "Deploying themepark management website..."

check_for_command() {
    echo -n "Checking for $1..."
    if ! $1 -v node 2>&1 >/dev/null
    then
        echo "$1 could not be found. Make sure it is installed and available on the system path."
        exit 1
    else
        echo "SUCCESS."
    fi
}

check_for_command node
check_for_command npm
check_for_command docker

echo -n "Checking for docker compose..."
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

npm run build

echo "Starting server..."
$DOCKER_CMD up
