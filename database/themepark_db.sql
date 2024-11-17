-- Use ONLY to init the database. Will drop all existing tables.
SET
FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS CUSTOMER;
DROP TABLE IF EXISTS EMPLOYEE;
DROP TABLE IF EXISTS MAINTENANCE;
DROP TABLE IF EXISTS MEMBERSHIP;
DROP TABLE IF EXISTS M_STATUS;
DROP TABLE IF EXISTS RIDES;
DROP TABLE IF EXISTS RUNS;
DROP TABLE IF EXISTS TICKET;
DROP TABLE IF EXISTS RIDE_STATUS;
DROP TABLE IF EXISTS EVENTS;
DROP TABLE IF EXISTS EVENT_TICKET;
DROP TABLE IF EXISTS RESTAURANT;
DROP TABLE IF EXISTS RESTAURANT_TRANSACTIONS;
DROP TABLE IF EXISTS CONCESSION_STALL;
DROP TABLE IF EXISTS CONCESSION_TRANSACTIONS;

-- Create tables
CREATE TABLE CUSTOMER
(
    CustomerID bigint unsigned NOT NULL AUTO_INCREMENT,
    FirstName  varchar(255) NOT NULL,
    LastName   varchar(255) NOT NULL,
    DOB        date         NOT NULL,
    Address    varchar(255) NOT NULL,
    Email      varchar(255) NOT NULL,
    Password   varchar(255) NOT NULL,
    Created    date         NOT NULL DEFAULT (CURRENT_DATE),
    Deleted    tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (CustomerID),
    UNIQUE (Email)
);

CREATE TABLE TICKET
(
    TicketID       bigint unsigned NOT NULL AUTO_INCREMENT,
    CustomerID     bigint unsigned NOT NULL,
    Price          bigint NOT NULL,
    ExpirationDate date   NOT NULL,
    Scanned        date            DEFAULT NULL,
    Bought         date   NOT NULL DEFAULT (CURRENT_DATE),
    Deleted        tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (TicketID),
    FOREIGN KEY (CustomerID) REFERENCES CUSTOMER (CustomerID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE MEMBERSHIP
(
    MembershipID   bigint unsigned NOT NULL AUTO_INCREMENT,
    MembershipTier varchar(255) NOT NULL,
    ExpiryDate     date         NOT NULL,
    PurchaseDate   date         NOT NULL DEFAULT (CURRENT_DATE),
    CustomerID     bigint unsigned NOT NULL,
    Deleted        tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (MembershipID),
    FOREIGN KEY (CustomerID) REFERENCES CUSTOMER (CustomerID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE EMPLOYEE
(
    EmployeeID  bigint unsigned NOT NULL AUTO_INCREMENT,
    FirstName   varchar(255) NOT NULL,
    LastName    varchar(255) NOT NULL,
    DOB         date         NOT NULL,
    Address     varchar(255) NOT NULL,
    PhoneNumber varchar(255) NOT NULL,
    Email       varchar(255) NOT NULL,
    Password    varchar(255) NOT NULL,
    AccessLevel varchar(3)   NOT NULL DEFAULT 'EMP',
    StartDate   date         NOT NULL DEFAULT (CURRENT_DATE),
    EndDate     date         NOT NULL,
    Created     date         NOT NULL DEFAULT (CURRENT_DATE),
    Deleted     tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (EmployeeID),
    UNIQUE (Email)
);

CREATE TABLE RIDES
(
    RideID       bigint unsigned NOT NULL AUTO_INCREMENT,
    RideName     varchar(255) NOT NULL,
    Category     varchar(255) NOT NULL,
    MaintainDate date         NOT NULL,
    RideAgeLimit bigint       NOT NULL,
    RideHours    time         NOT NULL,
    Capacity     bigint       NOT NULL,
    Deleted      tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (RideID)
);

CREATE TABLE MAINTENANCE
(
    MaintenanceID bigint unsigned NOT NULL AUTO_INCREMENT,
    RideID        bigint unsigned NOT NULL,
    Date          datetime      NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    Description   varchar(1020) NOT NULL,
    Deleted       tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (MaintenanceID),
    FOREIGN KEY (RideID) REFERENCES RIDES (RideID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE RIDE_STATUS
(
    RideStatusID     bigint unsigned NOT NULL AUTO_INCREMENT,
    RideID           bigint unsigned NOT NULL,
    WeatherCondition enum('CLEAR', 'DRIZZLE', 'DOWNPOUR', 'WIND', 'TSTORM', 'HURRICANE') NOT NULL DEFAULT 'CLEAR',
    Status           tinyint unsigned NOT NULL,
    Created          datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    Deleted          tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (RideStatusID),
    UNIQUE (RideID, Created),
    FOREIGN KEY (RideID) REFERENCES RIDES (RideID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE M_STATUS
(
    RideStatusID  bigint unsigned NOT NULL,
    MaintenanceID bigint unsigned NOT NULL,
    Deleted       tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (RideStatusID, MaintenanceID),
    FOREIGN KEY (RideStatusID) REFERENCES RIDE_STATUS (RideStatusID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (MaintenanceID) REFERENCES MAINTENANCE (MaintenanceID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE RUNS
(
    RunID       bigint unsigned NOT NULL AUTO_INCREMENT,
    EmployeeID  bigint unsigned NOT NULL,
    RideID      bigint unsigned NOT NULL,
    RideTime    datetime NOT NULL,
    NumofRiders bigint   NOT NULL,
    Deleted     tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (RunID),
    FOREIGN KEY (EmployeeID) REFERENCES EMPLOYEE (EmployeeID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (RideID) REFERENCES RIDES (RideID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE EVENTS
(
    EventID           bigint unsigned NOT NULL AUTO_INCREMENT,
    EventName         varchar(100) NOT NULL,
    EventType         varchar(100) NOT NULL,
    EventDateTime     datetime     NOT NULL,
    EventDuration     smallint unsigned NOT NULL,
    EventDesc         varchar(500) NOT NULL,
    EventRestrictions varchar(500) NOT NULL,
    EventAgeLimit     tinyint unsigned NOT NULL,
    Location          varchar(255) NOT NULL,
    Capacity          bigint unsigned NOT NULL,
    Deleted           tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (EventID)
);

CREATE TABLE EVENT_TICKET
(
    EventTicketID  bigint unsigned NOT NULL AUTO_INCREMENT,
    CustomerID     bigint unsigned NOT NULL,
    EventID        bigint unsigned NOT NULL,
    Bought         datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    ExpirationDate datetime NOT NULL,
    Scanned        date              DEFAULT NULL,
    Deleted        tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (EventTicketID),
    UNIQUE (CustomerID, EventID),
    FOREIGN KEY (CustomerID) REFERENCES CUSTOMER (CustomerID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (EventID) REFERENCES EVENTS (EventID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE RESTAURANT
(
    RestaurantID    bigint unsigned NOT NULL AUTO_INCREMENT,
    SeatingCapacity bigint unsigned NOT NULL,
    OpensAt         time         NOT NULL,
    OpenDuration    smallint unsigned NOT NULL,
    Location        varchar(255) NOT NULL,
    Deleted         tinyint(1) NOT NULL DEFAULT '0',
    RName           varchar(100) NOT NULL,
    RDesc           varchar(500) NOT NULL,
    RPriceMin       smallint unsigned NOT NULL,
    RPriceMax       smallint unsigned NOT NULL,
    PRIMARY KEY (RestaurantID)
);

CREATE TABLE RESTAURANT_TRANSACTIONS
(
    RTransactionID bigint unsigned NOT NULL AUTO_INCREMENT,
    RestaurantID   bigint unsigned NOT NULL,
    Date           date NOT NULL DEFAULT (CURRENT_DATE),
    CustomerID     bigint unsigned NOT NULL,
    Subtotal double NOT NULL,
    Deleted        tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (RTransactionID),
    FOREIGN KEY (RestaurantID) REFERENCES RESTAURANT (RestaurantID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (CustomerID) REFERENCES CUSTOMER (CustomerID) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE CONCESSION_STALL
(
    ConcessionID bigint unsigned NOT NULL AUTO_INCREMENT,
    OpensAt      time         NOT NULL,
    OpenDuration smallint unsigned NOT NULL,
    Location     varchar(255) NOT NULL,
    Deleted      tinyint(1) NOT NULL DEFAULT '0',
    CName        varchar(100) NOT NULL,
    CDesc        varchar(500) NOT NULL,
    CPriceMin    smallint unsigned NOT NULL,
    CPriceMax    smallint unsigned NOT NULL,
    PRIMARY KEY (ConcessionID)
);

CREATE TABLE CONCESSION_TRANSACTIONS
(
    CTransactionID bigint unsigned NOT NULL AUTO_INCREMENT,
    ConcessionID   bigint unsigned NOT NULL,
    Date           date NOT NULL DEFAULT (CURRENT_DATE),
    CustomerID     bigint unsigned NOT NULL,
    Subtotal double NOT NULL,
    Deleted        tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (CTransactionID),
    FOREIGN KEY (ConcessionID) REFERENCES CONCESSION_STALL (ConcessionID) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (CustomerID) REFERENCES CUSTOMER (CustomerID) ON DELETE RESTRICT ON UPDATE CASCADE
);

SET
FOREIGN_KEY_CHECKS = 1;
