// Themepark modules
const auth = require("../utils/auth");
const employee = require("./employeeRoutes");
const db = require("../utils/db");

// App routes
module.exports = (app) => {

    // Event registration route
    app.get('/events', (req, res) => {
        let query = db.themeparkDB("EVENTS").orderBy("EventID");
        if (!req.query.deleted)
            query = query.where("Deleted", 0);
        query.then((events) => {
            res.status(200).json({success: true, events: events});
        })
        .catch((e) => {
            console.error(e);
            res.status(500).json({success: false, error: "SQLError"});
        })
    });

    app.get('/events/categories', (req, res) => {
        db.getEventCategories()
        .then((items) => {
            res.status(200).json({success: true, categories: items.map((cat) => cat.EventType)});
        })
        .catch((e) => {
            console.error(e);
            res.status(500).json({success: false, error: "SQLError"});
        });
    })
    
    app.put('/events/:id',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('events'),
        (req, res) => {
            req.body.EventDateTime = new Date(req.body.EventDateTime);
            db.themeparkDB("EVENTS").update(req.body).where('EventID', req.params.id)
            .then(() => res.status(200).json({success: true}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    )

    app.delete('/events/:id',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('events'),
        (req, res) => {
            req.body.EventDateTime = new Date(req.body.EventDateTime);
            let query = db.themeparkDB("EVENTS").where('EventID', req.params.id);
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

    app.post('/events',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('events'),
        (req, res) => {
            req.body.EventDateTime = new Date(req.body.EventDateTime);
            db.themeparkDB("EVENTS").insert((req.body))
            .then(() => res.status(200).json({success: true}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    )

    app.get('/events/tickets', 
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('reports'),
        (req, res) => {
            db.themeparkDB("EVENT_TICKETS_INFO")
            .then((tickets) => res.status(200).json({success: true, tickets: tickets}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    );

    app.get('/events/tickets/summary', 
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('reports'),
        (req, res) => {
            db.themeparkDB("EVENT_SALES_SUMMARY")
            .then((tickets) => res.status(200).json({success: true, tickets: tickets}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    );

    app.get('/events/names', 
        (req, res) => {
            db.themeparkDB("EVENTS").select("EventName").distinct()
            .then((names) => res.status(200).json({success: true, names: names.map((n) => n.EventName)}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    );

};
