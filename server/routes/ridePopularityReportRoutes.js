// Themepark modules
const auth = require("../utils/auth");
const db = require("../utils/db");
const employee = require("./employeeRoutes");

// App routes
module.exports = (app) => {
    app.get('/ridePopularity/category',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('reports'),
        (req, res) => {
            db.getCategoryPopularitySummary(req.query.dateRange)
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
        employee.getEmployeeAccessPerms,
        employee.requirePerms('reports'),
        (req, res) => {
            db.getRidePopularitySummary(req.query.dateRange)
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
        employee.getEmployeeAccessPerms,
        employee.requirePerms('reports'),
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
