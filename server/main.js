const fs = require("fs");

// Environment
if (process.env.API_SERVER_ENV === 'production') {

    var http = require("https");
    var secure_cookies = true;

    // Server config
    var options = {
        key: fs.readFileSync('server-key.pem'),
        cert: fs.readFileSync('server-cert.pem')
    };
} else {
    require('dotenv').config({path: '../.env'});
    var http = require("http");
    var secure_cookies = false;
}

// Themepark modules
const auth = require("./utils/auth");
const db = require("./utils/db");

// Server modules
const express = require("express");
const app = express();
const port = Number(process.env.API_SERVER_PORT);
const cors = require('cors');
app.use(express.json());
app.set('trust proxy', 1);

app.use(cors({
    origin: process.env.API_CLIENT_ORIGIN,
    optionsSuccessStatus: 200,
    credentials: true
}));
console.log(`Client origin set to '${process.env.API_CLIENT_ORIGIN}'`);

const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({
    host: process.env.MYSQL_ADDR,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    createDatabaseTable: true,
    charset: 'utf8mb4_bin',
    schema: {
        tableName: 'SESSIONS',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
});

var sessionSecrets = new Array();
setInterval(async () => {
    await auth.updateSessionSecrets(sessionSecrets);
}, 6 * 60 * 60 * 1000); // Update session secrets every 6 hours

(async () => {
    // Any awaits that needs to happen before the server starts should go here

    // Set admin account for customer and employee tables
    await db.setUser(`${process.env.APP_ADMIN_USER}@themepark.net`, {
        FirstName: process.env.APP_ADMIN_USER,
        LastName: process.env.APP_ADMIN_USER,
        DOB: new Date(0),
        Address: 'SomeAddress',
        Password: await auth.hashpw(process.env.APP_ADMIN_PASS),
        Deleted: process.env.APP_ENABLE_SU && process.env.APP_ENABLE_SU !== 'true'
    });
    await db.setUser(`${process.env.APP_ADMIN_USER}@themepark.net`, {
        FirstName: process.env.APP_ADMIN_USER,
        LastName: process.env.APP_ADMIN_USER,
        DOB: new Date(0),
        Address: 'SomeAddress',
        PhoneNumber: '555-555-5555',
        Password: await auth.hashpw(process.env.APP_ADMIN_PASS),
        AccessLevel: require('./routes/employeeRoutes').employeeRoles.slice(-1).pop().value,
        StartDate: new Date(0),
        EndDate: new Date(2147483647 * 1000),
        Deleted: process.env.APP_ENABLE_SU && process.env.APP_ENABLE_SU !== 'true'
    }, true);

    // Update session secrets in database
    await auth.updateSessionSecrets(sessionSecrets);

    // Enable session manager middleware
    app.use(session({
        secret: sessionSecrets,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            secure: secure_cookies,
            sameSite: true
        },
        store: sessionStore,
    }));

    // Logger
    app.use(async (req, res, next) => {
        console.log(`Received ${req.method} from ${req.ip} at ${req.baseUrl + req.path}`);
        next();
    });

    // Triggered for all uncaught exceptions
    app.use((err, req, res, next) => {
        console.error(err.stack);
        return res.status(500).json({success: false, error: "ServerThrewException"});
    });

    // Enable cors preflight which SHOULD already be happening but just in case
    app.options('*', cors());

// API routes for server
    require('./routes/customerRoutes')(app);
    require('./routes/employeeRoutes')(app);
    require('./routes/eventsRoutes')(app);
    require('./routes/passRoutes')(app);
    require('./routes/rideRoutes')(app);
    require('./routes/maintenanceRoutes')(app);
    require('./routes/runsRoutes')(app);
    require('./routes/restaurantRoutes')(app);
    require('./routes/concessionRoutes')(app);
    require('./routes/giftshopRoutes')(app);
    require('./routes/miscRoutes')(app);
    require('./routes/ridePopularityReportRoutes')(app);

    http.createServer(options, app).listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
})();
