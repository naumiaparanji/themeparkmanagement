const db = require("./db");
const getCurrentTime = require("./currentTime");

const checkSessionForEmployee = async (req, res, next) => {
    if (req.session.employeeUser === undefined) {
        res.status(401).json({ success: false, error: "NotAuthorized" });
        return;
    }
    next();
};

const getRequestingEmployee = async (req, res, next) => {
    if (req.session.employeeUser)
        req.requestingEmployee = await db.getUser(req.session.employeeUser, true);
    next();
};

// App routes
module.exports = (app) => {
    app.post("/runs/input", checkSessionForEmployee, getRequestingEmployee, async (req, res) => {
        const rideData = await db.getRides().catch((e) => {
            console.log(e);
            res.status(500).json({ success: false, error: "SQLError" });
        });

        const ride = rideData.find((element) => element.RideName === req.body.rideName);
        if (ride === undefined) {
            res.status(501).json({success: false, error: "BadRide"});
            return;
        }

        // ensuring that the number of riders is not in excess of the ride's capacity and a valid count
        let rideCap = Number(ride.Capacity);
        let numericRiders = Number(req.body.numRiders);
        if (!Number.isInteger(numericRiders) || numericRiders < 0) {
            res.status(503).json({success: false, error: "InvalidRiderCount"});
            return;
        }
        else if (rideCap < numericRiders) {
            res.status(502).json({success: false, error: "OverCapacity", capacity: rideCap});
            return;
        }

        const empID = req.requestingEmployee.EmployeeID;

        const rideTime = getCurrentTime();

        const runs = await db
            .setRuns(
                {
                    EmployeeID: empID,
                    RideID: ride.RideID,
                    RideTime: rideTime,
                    NumofRiders: numericRiders,
                },
                true
            )
            .catch((e) => {
                console.log(e);
                res.status(500).json({ success: false, error: "SQLError" });
            });

        res.status(201).json({ success: runs });
    });

};
