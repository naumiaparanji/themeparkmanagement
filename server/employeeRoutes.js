// Themepark modules
const auth = require("./auth");
const db = require("./db");

// Auth check middleware
const employeeAuth = auth.authenticate(async (username) => {
    return db.getAuthInfo(username, true);
});

// App routes
module.exports = (app) => {

    app.post("/employee/login", employeeAuth, async (req, res) => {
        if (req.authorized) {
            await auth.pruneSessions(req.body.username, 9, true);
            req.session.regenerate((err) => {
                if (err) {
                    res.status(500).json({success: false, error: 'SessionUpdateFailed', errorDetails: err});
                    return;
                }
                req.session.employeeUser = req.body.username;
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

    app.get("/employee/info", async (req, res) => {
        if (req.session.employeeUser === undefined) {
            res.status(401).json({success: false, error: 'NotAuthorized'});
            return;
        }
        res.status(200).json({success: true, user: req.session.employeeUser});
    });

    app.post("/employee/register", db.registerEmployee, async (req, res) => {
        // Differs from customer registration in that the session needs to be authorized
        // Needs additional logic for checking registration permissions per employee
        // Check registerEmployee in db.js
        if(req.registrationError) {
            res.json({success: false, error: req.registrationErrorInfo});
            return;
        }
        res.status(200).json({success: true});
    });

    app.post("/employee/logout", async (req, res) => {
        if (req.session.employeeUser == undefined) {
            res.status(401).json({error: 'NotAuthorized'});
            return;
        }
        if (req.body.employeeUser != req.session.employeeUser) {
            // This check is to prevent unintended state changes to the session store. 
            // The client must have clear intent when requesting a logout.
            res.status(400).json({error: 'UserDoesNotMatchSession'});
            return;
        }
        req.session.employeeUser = null;
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

};