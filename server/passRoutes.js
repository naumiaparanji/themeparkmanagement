// Themepark modules
const auth = require("./auth");
const employee = require("./employeeRoutes");
const db = require("./db");

// App routes
module.exports = (app) => {

    app.get('/passes', (req, res) => {
        let query = db.themeparkDB("PASSES").orderBy("PassID");
        if (!req.query.deleted)
            query = query.where("Deleted", 0);
        query.then((passes) => {
            res.status(200).json({success: true, passes: passes});
        })
        .catch((e) => {
            console.error(e);
            res.status(500).json({success: false, error: "SQLError"});
        })
    });

    app.get('/passes/types', (req, res) => {
        db.getPassCategories()
        .then((items) => {
            res.status(200).json({success: true, categories: items.map((cat) => cat.PassType)});
        })
        .catch((e) => {
            console.error(e);
            res.status(500).json({success: false, error: "SQLError"});
        });
    })
    
    app.put('/passes/:id',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('passes'),
        (req, res) => {
            req.body.PassDateTime = new Date(req.body.PassDateTime);
            db.themeparkDB("PASSES").update(req.body).where('PassID', req.params.id)
            .then(() => res.status(200).json({success: true}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    )

    app.delete('/passes/:id',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('passes'),
        (req, res) => {
            req.body.PassDateTime = new Date(req.body.PassDateTime);
            let query = db.themeparkDB("PASSES").where('PassID', req.params.id);
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

    app.post('/passes',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('passes'),
        (req, res) => {
            req.body.PassDateTime = new Date(req.body.PassDateTime);
            db.themeparkDB("PASSES").insert((req.body))
            .then(() => res.status(200).json({success: true}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    )

    app.get('/passes/tickets', 
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('reports'),
        (req, res) => {
            db.themeparkDB("PASSES_TICKETS_INFO")
            .then((passes) => res.status(200).json({success: true, passes: passes}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    );

    app.get('/passes/names', 
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('reports'),
        (req, res) => {
            db.themeparkDB("PASSES").select("PassName").distinct()
            .then((passnames) => res.status(200).json({success: true, names: names.map((n) => n.PassName)}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    );

};
