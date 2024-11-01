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
            res.status(200).json({ success: true, message: 'Registration successful!' });
        } catch (error) {
            console.error('Error in registration:', error);
            if (error.sqlState === '45000') {  // Trigger error indicating full capacity
                res.status(400).json({ success: false, message: 'Sorry, slots filled' });
            } else {
                res.status(500).json({ success: false, message: 'An error occurred, please try again later.' });
            }
        }
    });
    
};
