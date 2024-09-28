@echo off

cd %~dp0

set MYSQL_ADDR=172.16.0.2
set MYSQL_DB=themepark_db
set MYSQL_USER=admin
set MYSQL_PASS=Ckq2Pd4VwytKZjLv
set SERVER_PORT=8080

echo Installing dependencies...
call npm install libsodium-wrappers-sumo express express-session mysql2 knex --save

echo Running server...
node main.js