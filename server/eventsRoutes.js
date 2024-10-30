// Themepark modules
const auth = require("./auth");
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

    // Example route
    app.get("/events/status", async (req, res) => {
        if (!req.session.user) {
            res.status(401).json({success: false, error: 'NotAuthorized'});
            return;
        }
        res.status(200).json({success: true, status: "ok"});
    });

    // Event registration route
    app.post('/register', async (req, res) => {
        // Extract eventId and customerId from request body
        const { eventId, customerId } = req.body;

        // Check if the user is authorized
        if (!req.session.user) {
            res.status(401).json({ success: false, error: 'NotAuthorized' });
            return;
        }

        try {
            // Attempt to insert a new ticket into the EVENT_TICKET table
            await db.query(`INSERT INTO EVENT_TICKET (EventID, CustomerID) VALUES (?, ?)`, [eventId, customerId]);
            res.status(200).json({ success: true, message: 'Registration successful!' });
        } catch (error) {
            // Handle capacity trigger error or other errors
            if (error.sqlState === '45000') {  // Trigger error indicating full capacity
                res.status(400).json({ success: false, message: 'Sorry, slots filled' });
            } else {
                res.status(500).json({ success: false, message: 'An error occurred, please try again later.' });
            }
        }
    });
};
