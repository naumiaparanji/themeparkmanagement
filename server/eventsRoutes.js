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

    // JUST AN EXAMPLE
    app.get("/events/status", async (req, res) => {
        if (!req.session.user) {
            res.status(401).json({success: false, error: 'NotAuthorized'});
            return;
        }
        res.status(200).json({success: true, status:"ok"});
    });

}