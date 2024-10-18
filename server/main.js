// Themepark modules
const auth = require("./auth");
const db = require("./db");

// Server modules
const express = require("express");
const fs = require("fs");
const app = express();
const port = Number(process.env.SERVER_PORT);
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.set('trust proxy', 1);


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

// User login
const customerAuth = auth.authenticate(async (username) => {
    return db.getAuthInfo(username);
});

const employeeAuth = auth.authenticate(async (username) => {
    return db.getAuthInfo(username, true);
});

const keystoreDB = require("knex")({
    client: "mysql2",
    connection: {
        host: process.env.MYSQL_ADDR,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_KEYSTORE_DB,
    },
});

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
    // Any async stuff that needs to happen before the server starts should go here

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
    app.post("/customer/login", customerAuth, async (req, res) => {
        if (req.authorized) {
            req.session.regenerate((err) => { // This sets a new SID. Should be called on logins only.
                if (err) {
                    res.status(500).json({success: false, error: 'SessionUpdateFailed', errorDetails: err});
                    return;
                }
                req.session.user = req.body.username;

                // save the session before redirection to ensure page
                // load does not happen before session is saved
                req.session.save((err) => {
                    if (err) {
                        res.status(500).json({success: false, error: 'SessionUpdateFailed', errorDetails: err});
                        return;
                    }
                    res.status(200).json({success: true});
                });
            });
        } else {
            // Need to add logic for bad email and bad password.
            // Also login attempts.
            res.status(400).json({success: false, error: 'IncorrectLogin'});
        }
    });

    app.get("/customer/info", async (req, res) => {
        if (req.session.user == undefined) {
            res.status(401).json({success: false, error: 'NotAuthorized'});
            return;
        }
        res.status(200).json({success: true, user: req.session.user});
    });

    app.post("/customer/register", db.registerCustomer, async (req, res) => {
        if(req.registrationError) {
            if (req.registrationErrorInfo === 'UserExists')
                res.status(409)
            else
                res.status(500);
            res.json({success: false, error: req.registrationErrorInfo});
            return;
        }
        res.status(200).json({success: true});
    });

    app.post("/customer/logout", async (req, res) => {
        if (req.session.user == undefined) {
            res.status(401).json({error: 'NotAuthorized'});
            return;
        }
        if (req.body.user != req.session.user) {
            // This check is to prevent unintended state changes to the session store. 
            // The client must have clear intent when requesting a logout.
            res.status(400).json({error: 'UserDoesNotMatchSession'});
            return;
        }
        req.session.user = null;
        req.session.save((err) => {
            if (err) {
                res.status(500).json({success: false, error: 'SessionUpdateFailed', errorDetails: err});
                return;
            }
            req.session.regenerate((err) => {
                if (err) {
                    res.status(500).json({success: false, error: 'SessionUpdateFailed', errorDetails: err});
                    return;
                }
            });
        });
        res.status(200).json({success: true});
    });

    http.createServer(options, app).listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
})();
