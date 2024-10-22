// Themepark modules
const auth = require("./auth");
const db = require("./db");
const reqChecks = require("./reqChecks");

// Auth check middleware
const employeeAuth = auth.authenticate(async (username) => {
    return (await db.getUser(username, true)).Password;
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

    app.post("/employee/register", async (req, res) => {
        // Differs from customer registration in that the session needs to be authorized
        // Needs additional logic for checking registration permissions per employee
        const requestingEmployee = await db.getUser(req.session.employeeUser, true);
        const allowedLevels = ['MGR', 'ADM'];
        if(!requestingEmployee || allowedLevels.indexOf(requestingEmployee.AccessLevel) === -1) {
            res.status(401).json({success: false, error: "NotAuthorized"});
            return;
        }
        requiredKeys = [
            "firstName",
            "lastName",
            "dob",
            "address",
            "phoneNumber",
            "username",
            "password",
            "startDate",
            "endDate"
        ];
        if (!req.body || !reqChecks.matchKeys(req.body, requiredKeys)) {
            res.status(400).json({success: false, error:"MissingParams"});
            return;
        }
        let newEmplyee = {
            FirstName: req.body.firstName,
            LastName: req.body.lastName,
            DOB: req.body.dob,
            Address: req.body.address,
            PhoneNumber: req.body.phoneNumber,
            Password: await auth.hashpw(req.body.password),
            StartDate: req.body.startDate,
            EndDate: req.body.endDate
        };
        const allLevels = ['EMP', 'MGR', 'ADM'];
        if (req.body.accessLevel) {
            if (allLevels.indexOf(req.body.accessLevel) === -1) {
                res.status(400).json({success: false, error:"BadParams"});
                return;
            }
            newEmplyee.AccessLevel = req.body.accessLevel;
        }
        if (req.body.created != undefined) newEmplyee.Created = req.body.created;
        const success = await db.setUser(req.body.username, newEmplyee, true, false)
        .catch((e) => {
            console.log(e);
            res.status(500).json({success: false, error: "SQLError"});
            return;
        });
        if(!success) {
            res.status(409).json({success: false, error: "UserExists"});
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