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

    app.post('/events/register', async (req, res) => {
        const { eventId, customerId } = req.body;
    
        try {
            // Call the new function to insert a new event ticket
            await db.registerForEvent(eventId, customerId);
            res.status(200).json({ success: true, message: 'Registration successful! The event should now be added to your account.' });
        } catch (error) {
            console.error('Error in registration:', error);
            if (error.sqlState === '45000') {  // Trigger error indicating full capacity
                res.status(400).json({ success: false, message: 'Sorry, we are currently at maximum capacity for the event. Please check back at a later time!' });
            } else {
                res.status(500).json({ success: false, message: 'An error occurred, please try again later.' });
            }
        }
    });

    app.get('/events/categories', (req, res) => {
        db.getEventCategories()
        .then((items) => {
            res.status(200).json({success: true, categories: items});
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
            db.themeparkDB("EVENTS").insert((req.body))
            .then(() => res.status(200).json({success: true}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    )

};
