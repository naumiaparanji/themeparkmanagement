# Themepark Management System

This project is organized into three main components:
1.  **Database**
    -   Located in the [database](https://github.com/naumiaparanji/themeparkmanagement/tree/main/database) directory.
    -   Includes:
        -   SQL scripts for initializing and setting up the database schema.
        -   Docker Compose configurations for deploying the database.
2.  **Backend (API Server)**
    -   Located in the [server](https://github.com/naumiaparanji/themeparkmanagement/tree/main/server) directory.
    -   Includes:
        -   Source code for a Node.js server that interfaces with the database, providing API routes for the frontend.
        -   Docker Compose configurations for deploying the server.
        -   Scripts for running the server locally in a development environment.
        -   Deployment scripts, including SSL certificate setup and automated builds.
3.  **Frontend (Web Application)**
    
    -   Located in the repository root directory.
    -   Includes:
        -   Source code for a web application built with [Create React App](https://github.com/facebook/create-react-app).
        -   Docker Compose configurations for deploying the frontend.
        -   Deployment scripts for building the application.
        -   NGINX configuration files for serving the React application.

## Configuration
The `.env` file allows you to customize various settings for the database, API server, and web application.

Supported environment variables:
### Database Configuration
- `MYSQL_ROOT_PASSWORD` - Sets the root password for the MySQL Docker image.
- `MYSQL_DATABASE` - Specifies the target schema for the API server and the default schema for the MySQL image.
- `MYSQL_ADDR` - Sets the address of the MySQL server to be used by the API server.
- `MYSQL_USER` - Specifies the MySQL user for both the API server and the MySQL image.
- `MYSQL_PASSWORD` - Defines the MySQL password for both the API server and the MySQL image.

### API Server Configuration
- `APP_ADMIN_USER` - Sets the superuser account name for the `CUSTOMER` and `EMPLOYEE` tables.
- `APP_ADMIN_PASS` - Sets the superuser password for the `CUSTOMER` and `EMPLOYEE` tables.
- `APP_ENABLE_SU` - Enables the superuser accounts when set to `true`.
- `API_CLIENT_ORIGIN` - CORS origin of the web application.
- `API_SERVER_PORT` - Which port the API server should listen on.
- `APP_SSL_COMMON_NAME` - Sets the domain name for the SSL certificate generated during API server builds.

### Web App Configuration
- `REACT_APP_API_SERVER_ADDRESS` - Defines the base HTTP URL of the API server.

### Example `.env` File
```
MYSQL_ROOT_PASSWORD = <ROOT_PASS_HERE>
MYSQL_DATABASE = themepark_db
MYSQL_ADDR = 127.0.0.1
MYSQL_USER = <DB_USER_HERE>
MYSQL_PASSWORD = <DB_PASS_HERE>
APP_ADMIN_USER = root
APP_ADMIN_PASS = <SECURE_PASSWORD>
APP_ENABLE_SU = true
API_CLIENT_ORIGIN = http://localhost:3000
REACT_APP_API_SERVER_ADDRESS = http://localhost:8080
API_SERVER_PORT = 8080
APP_SSL_COMMON_NAME = themepark.net

# Uncomment to enable https on the API server
# API_SERVER_ENV = production
```
