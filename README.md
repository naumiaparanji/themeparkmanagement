# Themepark Management System

## Introduction
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

