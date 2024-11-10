const db = require("./db");

// App routes
module.exports = (app) => {

    // This file should only contain singular routes that don't
    // fit into any particular category
    
    app.get('/attractions', (req, res) => {
        db.themeparkDB("ATTRACTIONS_LIST")
        .then((items) => {
            res.status(200).json({success: true, attractions: items});
        })
        .catch((e) => {
            console.error(e);
            res.status(500).json({success: false, error: "SQLError"});
        })
    });

};