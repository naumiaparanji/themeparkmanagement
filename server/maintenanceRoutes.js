// Themepark modules
const auth = require("./auth");
const db = require("./db");

// Auth check middleware

// const employeeAuth = auth.authenticate(async (username) => {
//     const user = await db.getUser(username, true);
//     if (!user) return undefined;
//     return user.Password;
// });

const checkSessionForEmployee = async (req, res, next) => {
    if (req.session.employeeUser === undefined) {
        res.status(401).json({success: false, error: 'NotAuthorized'});
        return;
    }
    return next();
}

const getRequestingEmployee = async (req, res, next) => {
    if (req.session.employeeUser)
        req.requestingEmployee = await db.getUser(req.session.employeeUser, true);
    next();
}

// App routes
module.exports = (app) => {

    app.post("/employee/maintenance", checkSessionForEmployee, getRequestingEmployee, async (req, res) => {
        res.status(200).json({success: true, 
            user: req.session.employeeUser,
            firstName: req.requestingEmployee.FirstName,
            lastName: req.requestingEmployee.LastName,
            accessLevel: req.requestingEmployee.AccessLevel
        });
    });

    app.get("/customer/info", async (req, res) => {
        if (req.session.user == undefined) {
            res.status(401).json({success: false, error: 'NotAuthorized'});
            return;
        }
        res.status(200).json({success: true, user: req.session.user});
    });

    app.post("/maintenance/input", async (req, res) => {

        const rideData = await db.getRides()
            .catch((e) => {
                console.log(e);
                res.status(500).json({success: false, error: "SQLError"});
                return;
            });
            
        console.log(rideData);
        
        let ride = rideData.find(element => element.RideName === req.body.rideName);

        console.log(ride);

        const success = await db.setMaintenanceRequest({RideID: ride.RideID, date: req.body.date, description: req.body.description, /*need to insert status into RIDE_STATUS*/}, true, true)
        .catch((e) => {
            console.log(e);
            res.status(500).json({success: false, error: "SQLError"});
            return;
        });
        
        // if(!success) {
        //     res.status(409).json({success: false, error: "UserExists"});
        //     return;
        // }
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