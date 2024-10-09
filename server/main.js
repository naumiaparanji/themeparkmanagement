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
    await auth.updateSessionSecrets(sessionSecrets);
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

    // Assign routes for server
    app.post("/login/validate", customerAuth, async (req, res) => {
        console.log(`Received response from ${req.ip} at path /login/validate`);
        if (req.authorized) {
            req.session.regenerate((err) => { // This sets a new SID. Should be called on logins only.
                if (err) res.redirect("/"); // Replace with an actual error response
                req.session.user = req.body.username;

                // save the session before redirection to ensure page
                // load does not happen before session is saved
                req.session.save((err) => {
                    if (err) res.redirect("/");
                    res.redirect("/post-login");
                });
            });
        }
        else {
            if(req.auth_err !== undefined) console.log(`Error in authentication from ${req.ip}: ${req.auth_err}`);
            res.redirect("/login");
        }
    });

    app.post("/auth/validate", employeeAuth, async (req, res) => {
        console.log(`Received response from ${req.ip} at path /auth/validate`);
        if (req.authorized) {
            req.session.regenerate((err) => {
                if (err) res.redirect("/");
                req.session.employee_user = req.body.username;
                req.session.save((err) => {
                    if (err) res.redirect("/");
                    res.redirect("/post-auth");
                })
            });
        }
    });

    app.get("/login", async (req, res, next) => {
        console.log(`Received request from ${req.ip} at path /login`);
        res.render('login');
    });

    app.get("/auth", async (req, res, next) => {
        console.log(`Received request from ${req.ip} at path /auth`);
        res.render('auth');
    });

    app.get("/post-login", async (req, res) => {
        console.log(`Received request from ${req.ip} at path /post-login`);

        // Read express-session docs for more info on how this works
        res.send("<pre>" 
            + "SUCCESS!\n"
            + `user=${req.session.user}\n`
            + "</pre>");
    });

    app.get("/post-auth", async (req, res) => {
        console.log(`Received request from ${req.ip} at path /post-auth`);
        res.send("<pre>" + "SUCCESS!" + "</pre>");
    });

    app.get("/logout", async (req, res) => {
        console.log(`Received request from ${req.ip} at path /logout`);
        req.session.user = null;
        req.session.save((err) => {
            if (err) res.redirect("/");
            req.session.regenerate((err) => {
                res.redirect("/");
            });
        });
    });

    app.get("/register", async (req, res) => {
        console.log(`Received request from ${req.ip} at path /register`);
        res.render('register');
    });

    app.post("/login/register", db.registerCustomer, async (req, res) => {
        console.log(`Received response from ${req.ip} at path /login/register`);
        if(req.reg_error)
            res.redirect('/');
        else
            res.redirect('/login');
    });

    app.get("/", async (req, res) => {
        console.log(`Received request from ${req.ip} at path /`);
        res.send("<pre>" 
            + `user=${req.session.user}\n`
            + "</pre>");
    });

    http.createServer(options, app).listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
})();
