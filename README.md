<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/naumiaparanji/themeparkmanagement">
    <img src="src\images\flagslogo.png" alt="Logo" width="50%" height="50%">
  </a>

<h3 align="center">Seven Flags Theme Park Management System</h3>

  <p align="center">
    COSC3380 Database Project
    <br />
    <a href="https://github.com/naumiaparanji/themeparkmanagement"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://notflag6.com/">View Project</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#back-end-installation">Back-End Installation</a></li>
        <li><a href="#front-end-installation">Front-End Installation</a></li>
        <li><a href="#configuration">Configuration</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
      <ul>
      <li><a href="#user-roles-and-data-management">User Roles and Data Management</a></li>
      <li><a href="#queriesreports">Queries/Reports</a></li>
      <li><a href="#triggers">Triggers</a></li>
      </ul>
    <li><a href="#contributors">Contributors</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Seven Flags][product-screenshot]](https://notflag6.com/)

A full-stack project for Database Systems (COSC3380) course at the University of Houston. This project highlights data collection to provide reports on rides and events of a theme park, as well as providing tools for managing them.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![React][React.js]][React-url]
- [![Node][Node.js]][Node-url]
- [![MySQL][MySQL]][MySQL-url]
- [![Bootstrap][Bootstrap.com]][Bootstrap-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

- npm

  ```sh
  npm install npm@latest -g
  ```

- Clone the repo
  ```sh
  git clone https://github.com/naumiaparanji/themeparkmanagement.git
  ```

### Back-End Installation

1. Navigate to server folder
   ```
    cd themeparkmanagement\server
   ```
2. Install npm packages
   ```sh
   npm install
   ```
3. Start
   ```
   npm run start
   ```
   Back-end by default will be listening on port 8080

### Front-End Installation

1. Navigate to src folder
   ```
    cd themeparkmanagement\src
   ```
2. Install npm packages
   ```sh
   git clone https://github.com/naumiaparanji/themeparkmanagement.git
   cd themeparkmanagement
   ```
2. Configure MySQL
    - Add a user with the DB Admin role to the system
    - In MySQL Workbench, go to File > Open SQL Script and open `themepark_db.sql` from the database directory
    - Run the script via the "run all" lightning button
3. Configure the application via `.env`
    - `MYSQL_USER` - Set to the username for your DB Admin account from step 2.
    - `MYSQL_PASSWORD` - Set to the password for your DB Admin account from step 2.
4. Start the API server
    - cd to the server directory
    - Run `npm run start`
5. Start the Web Application
    - cd to the root of the repository
    - Run `npm run start`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Configuration

**<ins>All values must be placed in the `.env` file.</ins>**

### Database Configuration

- `MYSQL_DATABASE` - Specifies the target schema for the backend.
- `MYSQL_ADDR` - Sets the address of the MySQL server to be used by the backend.
- `MYSQL_USER` - Specifies the MySQL user to be used by the backend.
- `MYSQL_PASSWORD` - Defines the MySQL password for the backend.

### API Server Configuration

- `APP_ADMIN_USER` - Sets the superuser account name for the `CUSTOMER` and `EMPLOYEE` tables.
- `APP_ADMIN_PASS` - Sets the superuser password for the `CUSTOMER` and `EMPLOYEE` tables.
- `APP_ENABLE_SU` - Enables the superuser accounts when set to `true`.
- `API_CLIENT_ORIGIN` - CORS origin of the web application.
- `API_SERVER_PORT` - Which port the backend server should listen on.
- `APP_SSL_COMMON_NAME` - Sets the domain name for the SSL certificate generated during backend server builds.

### Web App Configuration

- `REACT_APP_API_SERVER_ADDRESS` - Defines the base HTTP URL of the backend server.

### Example `.env` File

```
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

<!-- USAGE -->

## Usage

The Theme Park Management System is our solution to manage data related to Seven Flags' operations. This all-in-one
website offers the ability for customers to purchase tickets and sign up for our exclusive events, as well as allowing
our wonderful employees to work with data pertaining to rides, ride maintenance, and events while providing detailed
reports on them.

#### User Roles and Data Management

- Customer: Can sign up for an account, purchase tickets, and sign up for events as well as view all the amenities that Seven Flags has to offer.
- Employee: Can submit, modify, or delete maintenance requests and submit ride runs.
- Manager: Have the same priviledges as employees on top of the ability to view reports.
- Admin: Have the same priviledges as managers as well as the following capabilities:
  - Add, modify, and delete Customers and Employees information
  - Add, modify, and delete Rides
  - Add, modify, and delete Attractions
  - Add, modify, and delete Events

#### Queries/Reports

- Queries can be found in server &rarr; utils &rarr; [db.js](server\utils\db.js)
- Maintenance Status: A report of all maintenance requests that allows for filtering by ride name, ride category,
  maintenance ticket status, and the dates between which the ticket was submitted.
- Event Sales:
  - Summary: Report of the total sales from each Event.
  - Individual Sales: Report of each single sale that includes information on who purchased the pass and whether they
    have checked in for the event; allows for filtering by event name, and the dates between which the event pass was
    purchased.
- Ride Popularity:
  - Category Popularity Summary and Ride Popularity Summary: Reports that indicate how popular a ride is based on the
    occupancy versus capacity of the ride.
  - Individual Runs: Detailed log of each time a ride is operated on; allows for filtering by dates between which the
    rides were run.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Triggers

#### Trigger 1

If an event is canceled, all the customers who signed up for it get a notification saying that this event was unfortunately canceled. They are also unregistered from that event by default when the event is deleted.

- How to test this trigger:
  - Create a dummy event through the Admin portal
  - Login as a customer and sign up/ register for this event to see the trigger in action
  - Back in the admin portal, delete the event (implying that for some reason this event was canceled)
  - Log back into the customer portal and you will see you no longer have the ticket for that event, plus you have an unread notification. This notification has come from the trigger alerting you that the event was canceled.
  - Alternatively, even if the admin decides to mark this event as _inactive_, the customer still gets a notification saying the event was unfortunately canceled since there are both BEFORE UPDATE and BEFORE DELETE triggers
  - On making the event active again, the customer would need to re-register for the event.

#### Trigger 2

If a ride is currently under maintenance, no ride operator can log it. All rides under maintenance are not removed from the dropdown for ride logging until they are fixed again.

- How to test this trigger:
  - Accessible through both Employee and Admin portals, navigate to the Maintenance Request tab
  - Submit an 'Out Of Order' status for any ride(s) of your choice
  - Once submitted, check in the Ride Operator Portal to see the trigger take action
  - In the dropdown to log rides, you will only see the rides that are functioning and not the ones that you just submitted as 'Out Of Order'
  - Check back and submit new requests in the Maintenace portal for the same ride(s) with the status 'Operational' and then these rides will resurface in the dropdown in the Ride Operator Portal. (Will also work if you set those rides operational and resolve the tickets in the Maintenance Update tab since there are both AFTER UPDATE and AFTER INSERT triggers)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Contributors:

<a href="https://github.com/naumiaparanji/themeparkmanagement/graphs/contributors">
  <img src="src\images\Contributors.png" alt="Contributors.png image" width="30%" height="30%" />
</a>

<!-- CONTACT -->

### Contact

Project GitHub: [Link](https://github.com/naumiaparanji/themeparkmanagement)

Live Website: [Link](https://notflag6.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

Dr. Uma Ramamurthy

Our amazing TAs

README
Template: [https://github.com/othneildrew/Best-README-Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/naumiaparanji/themeparkmanagement.svg?style=for-the-badge
[contributors-url]: https://github.com/naumiaparanji/themeparkmanagement/graphs/contributors
[product-screenshot]: src/images/LiveWebsiteScreenShot.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Node.js]: https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white
[Node-url]: https://nodejs.org/en
[MySQL]: https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white
[MySQL-url]: https://www.mysql.com/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
