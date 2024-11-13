// Themepark modules
const auth = require("./auth");
const employee = require("./employeeRoutes");
const db = require("./db");

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

    // Event registration route
    app.get('/events', (req, res) => {
        db.getEvents()
        .then((events) => {
            res.status(200).json({success: true, events: events});
        })
        .catch((e) => {
            console.error(e);
            res.status(500).json({success: false, error: "SQLError"});
        })
    });

    //removed events/register because customer/registerEvent does the same thing

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
        (req, res) => {
            req.body.EventDateTime = new Date(req.body.EventDateTime);
            db.themeparkDB("EVENTS").update("Deleted", 1).where('EventID', req.params.id)
            .then(() => res.status(200).json({success: true}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    )

    app.post('/events',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
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

};
