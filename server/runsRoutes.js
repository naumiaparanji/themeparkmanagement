const auth = require("./auth");
const db = require("./db");

const checkSessionForEmployee = async (req, res, next) => {
    if (req.session.employeeUser === undefined) {
        res.status(401).json({ success: false, error: "NotAuthorized" });
        return;
    }
    return next();
};

const getRequestingEmployee = async (req, res, next) => {
    if (req.session.employeeUser)
        req.requestingEmployee = await db.getUser(req.session.employeeUser, true);
    next();
};

// App routes
module.exports = (app) => {
    app.post(
        "/employee/runs",
        checkSessionForEmployee,
        getRequestingEmployee,
        async (req, res) => {
            res
                .status(200)
                .json({
                    success: true,
                    user: req.session.employeeUser,
                    firstName: req.requestingEmployee.FirstName,
                    lastName: req.requestingEmployee.LastName,
                    accessLevel: req.requestingEmployee.AccessLevel,
                });
        }
    );

    app.post("/runs/input", async (req, res) => {
        const rideData = await db.getRides().catch((e) => {
            console.log(e);
            res.status(500).json({ success: false, error: "SQLError" });
            return;
        });

        const ride = rideData.find(
            (element) => element.RideName === req.body.rideName
        );

        const empID = "1";//req.requestingEmployee.EmployeeID; fixme: remove and fix

        const runs = await db
            .setRuns(
                {
                    EmployeeID: empID,
                    RideID: ride.RideID,
                    RideTime: req.body.rideTime,
                    NumofRiders: req.body.numRiders,
                },
                true,
                true
            )
            .catch((e) => {
                console.log(e);
                res.status(500).json({ success: false, error: "SQLError" });
                return;
            });

        res.status(201).json({ success: true });
    });

};
