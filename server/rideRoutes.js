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

    app.get("/rides", (req, res) => {
        db.getRides()
        .then((rides) => {
            res.status(200).json({success: true, rides: rides});
        })
        .catch((e) => {
            console.error(e);
            res.status(500).json({success: false, error: "SQLError"});
        })
    });

}