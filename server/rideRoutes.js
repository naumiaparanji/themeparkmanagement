// Themepark modules
const auth = require("./auth");
const db = require("./db");
const { checkSessionForEmployee, getRequestingEmployee } = require("./employeeRoutes");
const getCurrentTime = require("./currentTime");

// App routes
module.exports = (app) => {

    /*
    Add API routes here :)
    Authorized requests will have req.session.user and/or req.session.employeeUser
    set to the user's email address. It's all done automatically.
    
    REMEMBER THESE ARE SEPARATE ACCOUNTS!

    SQL queries go in db.js. You can also import the database object with
    const { themeparkDB } = require('./db');
    and add query functions to your own js file.
    */

    app.get("/rides/names", async (req, res) => {
        const rideData = await db.getRides().catch((e) => {
            console.log(e);
            res.status(500).json({ success: false, error: "SQLError" });
        });

        let rideNames = [];
        for (let ride of rideData) {
            rideNames.push(ride.RideName);
        }

        if (rideNames.length === 0) {
            res.status(501).json({ success: false, error: "NoRides" });
            return;
        }

        res.status(200).json({ success: true, rideNames: rideNames });
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

    app.post("/rides/input", checkSessionForEmployee, getRequestingEmployee, async (req, res) => {
        const numericRideAgeLimit = Number(req.body.RideAgeLimit);
        const numericCapacity = Number(req.body.Capacity);
        if (!Number.isInteger(numericRideAgeLimit) || numericRideAgeLimit < 0) {
            res.status(502).json({ success: false, error: "InvalidRideAgeLimit" });
            return;
        }
        if (!Number.isInteger(numericCapacity) || numericCapacity <= 0) {
            res.status(503).json({ success: false, error: "InvalidCapacity" });
            return;
        }

        try {
            const rides = await db.setRides(
                {
                    RideName: req.body.rideName,
                    Category: req.body.category,
                    RideAgeLimit: req.body.ageLimit,
                    Capacity: req.body.capacity,
                    Created: getCurrentTime()
                },
                true
            );
            res.status(201).json({ success: rides });
        } catch (e) {
            console.error(e);
            res.status(500).json({ success: false, error: "SQLError" });
        }
    });

}