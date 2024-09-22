-- Use ONLY to init the database. Will drop all existing tables.
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS CUSTOMER;
DROP TABLE IF EXISTS EMPLOYEE;
DROP TABLE IF EXISTS MAINTENANCE;
DROP TABLE IF EXISTS MEMBERSHIP;
DROP TABLE IF EXISTS M_STATUS;
DROP TABLE IF EXISTS PRODUCT;
DROP TABLE IF EXISTS PURCHASES;
DROP TABLE IF EXISTS RIDES;
DROP TABLE IF EXISTS RUNS;
DROP TABLE IF EXISTS SALE;
DROP TABLE IF EXISTS TICKET;
DROP TABLE IF EXISTS TRANSACTIONS;
DROP TABLE IF EXISTS RIDE_STATUS;
SET FOREIGN_KEY_CHECKS = 1;

-- Note that the default charset for our database is utf8mb4.
-- All varchars will use this charset unless specified with CHARACTER SET <charset name> COLLATE <collation>

CREATE TABLE CUSTOMER (
  CustomerID bigint unsigned NOT NULL AUTO_INCREMENT,
  FirstName varchar(255) NOT NULL,
  LastName varchar(255) NOT NULL,
  DOB date NOT NULL,
  Address varchar(255) NOT NULL,
  Email varchar(255) NOT NULL,
  Password varchar(255) NOT NULL,
  Created date NOT NULL,
  PRIMARY KEY (CustomerID),
  UNIQUE (Email)
);

CREATE TABLE TICKET (
  TicketID bigint unsigned NOT NULL AUTO_INCREMENT,
  CustomerID bigint unsigned NOT NULL,
  Price bigint NOT NULL,
  ExpirationDate date NOT NULL,
  Scanned date DEFAULT NULL,
  Bought date NOT NULL,
  PRIMARY KEY (TicketID),
  FOREIGN KEY (CustomerID) REFERENCES CUSTOMER (CustomerID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE MEMBERSHIP (
  MembershipID bigint unsigned NOT NULL AUTO_INCREMENT,
  MembershipTier varchar(255) NOT NULL,
  ExpiryDate date NOT NULL,
  PurchaseDate date NOT NULL,
  CustomerID bigint unsigned NOT NULL,
  PRIMARY KEY (MembershipID),
  FOREIGN KEY (CustomerID) REFERENCES CUSTOMER (CustomerID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE EMPLOYEE (
  EmployeeID bigint unsigned NOT NULL AUTO_INCREMENT,
  FirstName varchar(255) NOT NULL,
  LastName varchar(255) NOT NULL,
  DOB date NOT NULL,
  Address varchar(255) NOT NULL,
  PhoneNumber varchar(255) NOT NULL,
  Email varchar(255) NOT NULL,
  Password varchar(255) NOT NULL,
  StartDate date NOT NULL,
  EndDate date NOT NULL,
  Created date NOT NULL,
  PRIMARY KEY (EmployeeID),
  UNIQUE (Email)
);

CREATE TABLE RIDES (
  RideID bigint unsigned NOT NULL AUTO_INCREMENT,
  RideName varchar(255) NOT NULL,
  Category varchar(255) NOT NULL,
  MaintainDate date NOT NULL,
  RideAgeLimit bigint NOT NULL,
  RideHours time(6) NOT NULL,
  Capacity bigint NOT NULL,
  PRIMARY KEY (RideID)
);

CREATE TABLE MAINTENANCE (
  MaintenanceID bigint unsigned NOT NULL AUTO_INCREMENT,
  RideID bigint unsigned NOT NULL,
  Date datetime(3) NOT NULL,
  Description varchar(255) NOT NULL,
  PRIMARY KEY (MaintenanceID),
  FOREIGN KEY (RideID) REFERENCES RIDES (RideID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE RIDE_STATUS (
  RideStatusID bigint unsigned NOT NULL AUTO_INCREMENT,
  RideID bigint unsigned NOT NULL,
  WeatherCondition varchar(255) NOT NULL,
  Status tinyint unsigned NOT NULL,
  Created datetime(3) NOT NULL,
  PRIMARY KEY (RideStatusID),
  UNIQUE (RideID, Created),
  FOREIGN KEY (RideID) REFERENCES RIDES (RideID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE M_STATUS (
  RideStatusID bigint unsigned NOT NULL,
  MaintenanceID bigint unsigned NOT NULL,
  FOREIGN KEY (RideStatusID) REFERENCES RIDE_STATUS (RideStatusID) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (MaintenanceID) REFERENCES MAINTENANCE (MaintenanceID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE RUNS (
  RunID bigint unsigned NOT NULL AUTO_INCREMENT,
  EmployeeID bigint unsigned NOT NULL,
  RideID bigint unsigned NOT NULL,
  RideTime date NOT NULL,
  NumofRiders bigint NOT NULL,
  PRIMARY KEY (RunID),
  FOREIGN KEY (EmployeeID) REFERENCES EMPLOYEE (EmployeeID) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (RideID) REFERENCES RIDES (RideID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE PRODUCT (
  ProductID bigint unsigned NOT NULL AUTO_INCREMENT,
  Name varchar(255) NOT NULL,
  Image varchar(255) NOT NULL,
  CurrentPrice double NOT NULL,
  Description varchar(255) NOT NULL,
  Inventory int unsigned NOT NULL DEFAULT 0,
  SKU char(255) NOT NULL,
  UPC char(255) NOT NULL,
  PRIMARY KEY (ProductID)
);

CREATE TABLE PURCHASES (
  PurchaseID bigint unsigned NOT NULL AUTO_INCREMENT,
  ProductID bigint unsigned NOT NULL,
  Quantity int unsigned NOT NULL,
  PurchaseDate date NOT NULL,
  EmployeeID bigint unsigned NOT NULL,
  PRIMARY KEY (PurchaseID),
  FOREIGN KEY (EmployeeID) REFERENCES EMPLOYEE (EmployeeID) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (ProductID) REFERENCES PRODUCT (ProductID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE TRANSACTIONS (
  TransactionID bigint unsigned NOT NULL AUTO_INCREMENT,
  Date date NOT NULL,
  CustomerID bigint unsigned NOT NULL,
  Subtotal double NOT NULL,
  PRIMARY KEY (TransactionID),
  FOREIGN KEY (CustomerID) REFERENCES CUSTOMER (CustomerID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE SALE (
  TransactionID bigint unsigned NOT NULL,
  ProductID bigint unsigned NOT NULL,
  Quantity int unsigned NOT NULL,
  UNIQUE (TransactionID, ProductID),
  FOREIGN KEY (TransactionID) REFERENCES TRANSACTIONS (TransactionID) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (ProductID) REFERENCES PRODUCT (ProductID) ON DELETE RESTRICT ON UPDATE CASCADE
);
