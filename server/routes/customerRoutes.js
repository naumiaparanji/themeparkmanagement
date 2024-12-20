// Themepark modules
const auth = require("../utils/auth");
const db = require("../utils/db");

// Auth check middleware
const customerAuth = auth.authenticate(async (username) => {
    const user = await db.getUser(username);
    if (!user) return undefined;
    return user.Password;
});

const checkSessionForCustomer = async (req, res, next) => {
    if (req.session.user === undefined) {
        return res.status(401).json({success: false, error: 'NotAuthorized'});
    }
    return next();
}

const getRequestingCustomer = async (req, res, next) => {
    if (req.session.user) {
        try {
            req.requestingCustomer = await db.getUser(req.session.user);
        } catch (e) {
            console.error(e);
            return res.status(500).json({success: false, error: "SQLError"});
        }
    }
    if (!req.requestingCustomer) return res.status(500).json({success: false, error: 'UserNotFound'});
    return next();
}

const returnCustomerData = async (req, res, next) => {
    if (!req.requestingCustomer)
        throw new Error("req.requestingCustomer does not exist");

    try {
        // Fetch notifications for the requesting customer
        const notifications = await db.themeparkDB('NOTIFICATIONS')
            .where('CustomerID', req.requestingCustomer.CustomerID)
            .orderBy('CreatedAt', 'desc');

        return res.status(200).json({
            success: true,
            firstName: req.requestingCustomer.FirstName,
            lastName: req.requestingCustomer.LastName,
            dob: req.requestingCustomer.DOB,
            address: req.requestingCustomer.Address,
            email: req.requestingCustomer.Email,
            created: req.requestingCustomer.Created,
            notifications: notifications // Include notifications in response
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({success: false, error: "SQLError"});
    }
};

// App routes
module.exports = (app) => {

    app.post("/customer/login", customerAuth, async (req, res) => {
        if (req.authorized) {
            const {employeeUser} = req.session;
            auth.pruneSessions(req.body.username, 99);
            req.session.regenerate((err) => {
                if (err) {
                    res.status(500).json({success: false, error: 'SessionUpdateFailed', errorDetails: err});
                    return;
                }
                req.session.employeeUser = employeeUser;
                req.session.user = req.body.username;
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

    app.get("/customer/info",
        checkSessionForCustomer,
        getRequestingCustomer,
        returnCustomerData
    );

    //
    app.get("/customer/info/data",
        checkSessionForCustomer,
        (req, res) => {
            db.themeparkDB('CUSTOMER').where('Deleted', 0)
                .then((employees) => res.status(200).json(employees))
                .catch((e) => {
                    console.log(e);
                    res.status(500).json({message: "Server error"})
                });
        });

    app.post("/customer/register", async (req, res) => {
        if (!req.body.username || !req.body.password) {
            res.status(400).json({success: false, error: "MissingParams"});
            return;
        }
        const success = await db.setUser(req.body.username,
            {
                password: await auth.hashpw(req.body.password),
                FirstName: req.body.firstName,
                LastName: req.body.lastName,
                DOB: req.body.dob,
                Address: req.body.address
            },
            false,
            false
        )
            .catch((e) => {
                console.log(e);
                res.status(500).json({success: false, error: "SQLError"});
                return;
            });

        if (!success) {
            res.status(409).json({success: false, error: "UserExists"});
            return;
        }
        res.status(200).json({success: true});
    });

    app.post("/customer/logout",
        checkSessionForCustomer,
        async (req, res) => {
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

    app.post('/customer/registerEvent',
        checkSessionForCustomer,
        getRequestingCustomer,
        async (req, res) => {
            const {eventId} = req.body;
            if (!eventId) {
                return res.status(400).json({success: false, error: 'MissingEventID'});
            }
            db.themeparkDB('EVENT_TICKET').insert({EventID: eventId, CustomerID: req.requestingCustomer.CustomerID})
                .then(() => res.status(200).json({success: true}))
                .catch((error) => {
                    if (error.sqlState === '45000')
                        return res.status(500).json({success: false, error: error.sqlMessage});
                    console.log(error);
                    res.status(500).json({success: false, error: "SQLError"});
                });
        }
    );

    app.post('/customer/registerPass',
        checkSessionForCustomer,
        getRequestingCustomer,
        async (req, res) => {
            const {passId} = req.body;
            if (!passId) {
                return res.status(400).json({success: false, error: 'MissingPassID'});
            }
            db.themeparkDB('PASS_TICKET').insert({PassID: passId, CustomerID: req.requestingCustomer.CustomerID})
                .then(() => res.status(200).json({success: true}))
                .catch((error) => {
                    if (error.sqlState === '45000')
                        return res.status(500).json({success: false, error: error.sqlMessage});
                    console.log(error);
                    res.status(500).json({success: false, error: "SQLError"});
                });
        }
    );

    app.post('/customer/unregisterEvent',
        checkSessionForCustomer,
        getRequestingCustomer,
        async (req, res) => {
            const {eventId} = req.body;
            if (!eventId) {
                return res.status(400).json({success: false, error: 'MissingEventID'});
            }
            db.themeparkDB('EVENT_TICKET')
                .where({EventID: eventId, CustomerID: req.requestingCustomer.CustomerID})
                .del()
                .then((deletedCount) => {
                    if (deletedCount > 0) {
                        res.status(200).json({success: true});
                    } else {
                        res.status(404).json({success: false, error: 'EventNotRegistered'});
                    }
                })
                .catch((error) => {
                    console.error('Error purchasing pass:', error);
                    res.status(500).json({success: false, error: 'SQLError'});
                });
        }
    );

    app.post('/customer/unregisterPass',
        checkSessionForCustomer,
        getRequestingCustomer,
        async (req, res) => {
            const {passId} = req.body;
            if (!passId) {
                return res.status(400).json({success: false, error: 'MissingPassID'});
            }
            db.themeparkDB('PASS_TICKET')
                .where({PassID: passId, CustomerID: req.requestingCustomer.CustomerID})
                .del()
                .then((deletedCount) => {
                    if (deletedCount > 0) {
                        res.status(200).json({success: true});
                    } else {
                        res.status(404).json({success: false, error: 'PassNotPurchased'});
                    }
                })
                .catch((error) => {
                    console.error('Error purchasing pass:', error);
                    res.status(500).json({success: false, error: 'SQLError'});
                });
        }
    );

    app.get('/customer/tickets',
        checkSessionForCustomer,
        getRequestingCustomer,
        async (req, res) => {
            db.themeparkDB('EVENT_TICKET')
                .where('CustomerID', req.requestingCustomer.CustomerID)
                .where('Deleted', 0)
                .then((tickets) => {
                    if (tickets.length > 0) {
                        res.status(200).json({success: true, tickets});
                    } else {
                        res.status(404).json({success: false, error: 'NoTicketsFound'});
                    }
                })
                .catch((err) => {
                    console.error('Error fetching tickets:', err);
                    res.status(500).json({success: false, error: 'SQLError'});
                })
        });

    app.get('/customer/passes',
        checkSessionForCustomer,
        getRequestingCustomer,
        async (req, res) => {
            db.themeparkDB('PASS_TICKET')
                .where('CustomerID', req.requestingCustomer.CustomerID)
                .where('Deleted', 0)
                .then((passes) => {
                    if (passes.length > 0) {
                        res.status(200).json({success: true, passes});
                    } else {
                        res.status(404).json({success: false, error: 'NoPassesFound'});
                    }
                })
                .catch((err) => {
                    console.error('Error fetching Passes:', err);
                    res.status(500).json({success: false, error: 'SQLError'});
                })
        });
};