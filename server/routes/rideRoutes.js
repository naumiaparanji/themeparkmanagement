// Themepark modules
const auth = require("../utils/auth");
const db = require("../utils/db");
const employee = require("./employeeRoutes");
const getCurrentTime = require("../utils/currentTime");

// App routes
module.exports = (app) => {

    app.get("/rides/names", async (req, res) => {
        const rideData = await db.getRides().catch((e) => {
            console.log(e);
            res.status(500).json({success: false, error: "SQLError"});
        });

        let rideNames = [];
        for (let ride of rideData) {
            rideNames.push(ride.RideName);
        }

        if (rideNames.length === 0) {
            res.status(501).json({success: false, error: "NoRides"});
            return;
        }

        res.status(200).json({success: true, rideNames: rideNames});
    });

    app.get("/rides", (req, res) => {
        db.getRides()
            .then((rides) => {
                res.status(200).json({success: true, rides: rides});
            })
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            })
    });

    app.post("/rides/input",
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('rides'),
        async (req, res) => {
            const numericRideAgeLimit = Number(req.body.ageLimit);
            const numericCapacity = Number(req.body.capacity);
            if (!Number.isInteger(numericRideAgeLimit) || numericRideAgeLimit < 0) {
                res.status(502).json({success: false, error: "InvalidRideAgeLimit"});
                return;
            }
            if (!Number.isInteger(numericCapacity) || numericCapacity <= 0) {
                res.status(503).json({success: false, error: "InvalidCapacity"});
                return;
            }

            try {
                const rides = await db.setRides(
                    {
                        RideName: req.body.rideName,
                        Category: req.body.category,
                        RideAgeLimit: numericRideAgeLimit,
                        Capacity: numericCapacity,
                        Created: getCurrentTime()
                    },
                    true
                );
                res.status(201).json({success: rides});
            } catch (e) {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            }
        });

}