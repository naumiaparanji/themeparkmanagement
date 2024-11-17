const db = require("../utils/db");
const employee = require("./employeeRoutes");

// App routes
module.exports = (app) => {
    
    app.get('/concessions', (req, res) => {
        let query = db.themeparkDB("CONCESSION_STALL").orderBy("ConcessionID");
        if (!req.query.deleted)
            query = query.where("Deleted", 0);
        query.then((items) => {
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
        employee.getEmployeeAccessPerms,
        employee.requirePerms('attractions'),
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
        employee.getEmployeeAccessPerms,
        employee.requirePerms('attractions'),
        (req, res) => {
            let query = db.themeparkDB("CONCESSION_STALL").where('ConcessionID', req.params.id);
            if (req.query.permanent)
                query = query.delete();
            else
                query = query.update("Deleted", 1)
            query.then(() => res.status(200).json({success: true}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    )

    app.post('/concessions',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('attractions'),
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