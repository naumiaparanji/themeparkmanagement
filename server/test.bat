@echo off

cd %~dp0

set MYSQL_ADDR=172.16.0.2
set MYSQL_DB=themepark_db
set MYSQL_KEYSTORE_DB=keystore_db
set MYSQL_USER=admin
set MYSQL_PASS=Ckq2Pd4VwytKZjLv
set APP_ADMIN_USER=root
set APP_ADMIN_PASS=password
set CLIENT_ORIGIN=http://localhost:3000
set SERVER_PORT=8080

echo Running server...
npm install && node main.js