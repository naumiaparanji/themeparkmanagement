const db = require("../utils/db");
const getCurrentTime = require("../utils/currentTime");
const employee = require("./employeeRoutes");

// App routes
module.exports = (app) => {
    app.post("/runs/input",
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('runs'),
        async (req, res) => {
            const rideData = await db.getRides().catch((e) => {
                console.log(e);
                res.status(500).json({success: false, error: "SQLError"});
                return;
            });

            const ride = rideData.find((element) => element.RideName === req.body.rideName);
            if (ride === undefined) {
                res.status(501).json({success: false, error: "BadRide"});
                return;
            }

            // Validate the rider count
            const rideCap = Number(ride.Capacity);
            const numericRiders = Number(req.body.numRiders);
            if (!Number.isInteger(numericRiders) || numericRiders < 0) {
                res.status(503).json({success: false, error: "InvalidRiderCount"});
                return;
            } else if (numericRiders > rideCap) {
                res.status(502).json({success: false, error: "OverCapacity", capacity: rideCap});
                return;
            }

            const empID = req.requestingEmployee.EmployeeID;
            const rideTime = getCurrentTime();

            try {
                const runs = await db.setRuns(
                    {
                        EmployeeID: empID,
                        RideID: ride.RideID,
                        RideTime: rideTime,
                        NumofRiders: numericRiders,
                    },
                    true
                );
                res.status(201).json({success: runs});
            } catch (e) {
                console.error(e);

                if (e.code === "ER_SIGNAL_EXCEPTION") {
                    res.status(400).json({
                        success: false,
                        error: "RideUnderMaintenance",
                        message: "This ride cannot be operated, it is under maintenance. Please check back at a later time!",
                    });
                } else {
                    res.status(500).json({success: false, error: "SQLError"});
                }
            }
        });
};
