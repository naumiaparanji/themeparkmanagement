const db = require("./db");
const employee = require("./employeeRoutes");

// App routes
module.exports = (app) => {
    
    app.get('/giftshops', (req, res) => {
        db.themeparkDB("GIFTSHOP").where("Deleted", 0).orderBy("GiftshopID")
        .then((items) => {
            res.status(200).json({success: true, giftshops: items});
        })
        .catch((e) => {
            console.error(e);
            res.status(500).json({success: false, error: "SQLError"});
        })
    });

    app.put('/giftshops/:id',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        (req, res) => {
            db.themeparkDB("GIFTSHOP").update(req.body).where('GiftshopID', req.params.id)
            .then(() => res.status(200).json({success: true}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    );

    app.delete('/giftshops/:id',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        (req, res) => {
            db.themeparkDB("GIFTSHOP").update("Deleted", 1).where('GiftshopID', req.params.id)
            .then(() => res.status(200).json({success: true}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    )

    app.post('/giftshops',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        (req, res) => {
            db.themeparkDB("GIFTSHOP").insert((req.body))
            .then(() => res.status(200).json({success: true}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    )

};