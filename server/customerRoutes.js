// Themepark modules
const auth = require("./auth");
const db = require("./db");

// Auth check middleware
const customerAuth = auth.authenticate(async (username) => {
    const user = await db.getUser(username);
    if (!user) return undefined;
    return user.Password;
});

// App routes
module.exports = (app) => {

    app.post("/customer/login", customerAuth, async (req, res) => {
        if (req.authorized) {
            auth.pruneSessions(req.body.username, 99);
            req.session.regenerate((err) => {
                if (err) {
                    res.status(500).json({success: false, error: 'SessionUpdateFailed', errorDetails: err});
                    return;
                }

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

    app.get("/customer/info", async (req, res) => {
        if (!req.session.user) {
            return res.status(401).json({ success: false, error: 'NotAuthorized' });
        }
    
        try {
            // Query the database for the user's full profile
            const user = await db.themeparkDB('CUSTOMER')
                .where('Email', req.session.user) // Assuming session stores user email
                .andWhere('Deleted', 0) // Optional: filter out soft-deleted users
                .first(); // Retrieve a single user
    
            if (!user) {
                return res.status(404).json({ success: false, error: 'UserNotFound' });
            }
    
            res.status(200).json({ success: true, user });
        } catch (err) {
            console.error('Error fetching user info:', err);
            res.status(500).json({ success: false, error: 'ServerError' });
        }
    });
    
    

    app.post("/customer/register", async (req, res) => {
        if (!req.body.username || !req.body.password) {
            res.status(400).json({success: false, error:"MissingParams"});
            return;
        }
        const success = await db.setUser(req.body.username, 
            {
                password: await auth.hashpw(req.body.password), 
                FirstName: req.body.firstName, 
                LastName: req.body.lastName, 
                DOB: req.body.dob, 
                Address: req.body.address}, 
                false,
                false
            )
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

};