// Themepark modules
const auth = require("./auth");
const db = require("./db");

// Server modules
const express = require("express");
const fs = require("fs");
const app = express();
const port = Number(process.env.SERVER_PORT);
const cors = require('cors');
app.use(express.json());
app.set('trust proxy', 1);

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
}));

if (process.env.SERVER_ENV === 'production') {
    var http = require("https");
    var secure_cookies = true;

    // Server config
    var options = {
        key: fs.readFileSync('server-key.pem'),
        cert: fs.readFileSync('server-cert.pem')
    };
} else {
    var http = require("http");
    var secure_cookies = false;
}

const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({
    host: process.env.MYSQL_ADDR,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_KEYSTORE_DB,
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
    await db.setCustomer({
        FirstName: process.env.APP_ADMIN_USER,
        LastName: process.env.APP_ADMIN_USER,
        DOB: new Date(0),
        Address: 'SomeAddress',
        Email: `${process.env.APP_ADMIN_USER}@themepark.net`,
        Password: await auth.hashpw(process.env.APP_ADMIN_PASS)
    });
    await db.setEmployee({
        FirstName: process.env.APP_ADMIN_USER,
        LastName: process.env.APP_ADMIN_USER,
        DOB: new Date(0),
        Address: 'SomeAddress',
        PhoneNumber: '555-555-5555',
        Email: `${process.env.APP_ADMIN_USER}@themepark.net`,
        Password: await auth.hashpw(process.env.APP_ADMIN_PASS),
        StartDate: new Date(0),
        EndDate: new Date(2147483647 * 1000)
    });

    // Update session secrets in database
    await auth.updateSessionSecrets(sessionSecrets);

    // Enable session manager middleware
    app.use(session({
        secret: sessionSecrets, 
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            secure: secure_cookies
        },
        store: sessionStore,
    }));

    // Logger
    app.use(async (req, res, next) => {
        console.log(`Received ${req.method} from ${req.ip} at ${req.baseUrl + req.path}`);
        next();
    });

    // API routes for server
    require('./customerRoutes')(app);
    require('./employeeRoutes')(app);

    http.createServer(options, app).listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
})();
