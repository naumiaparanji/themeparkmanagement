const db = require("./db");
const employee = require("./employeeRoutes");

// App routes
module.exports = (app) => {
    
    app.get('/concessions', (req, res) => {
        db.themeparkDB("CONCESSION_STALL").where("Deleted", 0).orderBy("ConcessionID")
        .then((items) => {
            res.status(200).json({success: true, concessions: items});
        })
        .catch((e) => {
            console.error(e);
            res.status(500).json({success: false, error: "SQLError"});
        })
    });

    app.put('/concessions/:id',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.setMinEmployeeAccessLevel(2),
        (req, res) => {
            db.themeparkDB("CONCESSION_STALL").update(req.body).where('ConcessionID', req.params.id)
            .then(() => res.status(200).json({success: true}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    );

    app.delete('/concessions/:id',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.setMinEmployeeAccessLevel(2),
        (req, res) => {
            db.themeparkDB("CONCESSION_STALL").update("Deleted", 1).where('ConcessionID', req.params.id)
            .then(() => res.status(200).json({success: true}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    )

    app.post('/concessions',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.setMinEmployeeAccessLevel(2),
        (req, res) => {
            db.themeparkDB("CONCESSION_STALL").insert((req.body))
            .then(() => res.status(200).json({success: true}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    )

};