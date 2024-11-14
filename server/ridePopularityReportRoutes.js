// Themepark modules
const auth = require("./auth");
const db = require("./db");
const employee = require("./employeeRoutes");

const MANAGER_ACCESS_LEVEL = 1;

// App routes
module.exports = (app) => {
    app.get('/ridePopularity/category',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.setMinEmployeeAccessLevel(MANAGER_ACCESS_LEVEL),
        (req, res) => {
            db.getCategoryPopularitySummary()
                .then((result) => res.status(200).json({success: true, rows: result}))
                .catch((e) => {
                    console.error(e);
                    res.status(500).json({success: false, error: "SQLError"});
                });
        }
    );

    app.get('/ridePopularity/ride',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.setMinEmployeeAccessLevel(MANAGER_ACCESS_LEVEL),
        (req, res) => {
            db.getRidePopularitySummary()
                .then((result) => res.status(200).json({success: true, rows: result}))
                .catch((e) => {
                    console.error(e);
                    res.status(500).json({success: false, error: "SQLError"});
                });
        }
    );

    app.get('/ridePopularity/runs',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.setMinEmployeeAccessLevel(MANAGER_ACCESS_LEVEL),
        (req, res) => {
            db.getRidePopularityInfo()
                .then((result) => res.status(200).json({success: true, rows: result}))
                .catch((e) => {
                    console.error(e);
                    res.status(500).json({success: false, error: "SQLError"});
                });
        }
    );
};
