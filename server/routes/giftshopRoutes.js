const db = require("../utils/db");
const employee = require("./employeeRoutes");

// App routes
module.exports = (app) => {
    
    app.get('/giftshops', 
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('attractions'),
        (req, res) => {
        let query = db.themeparkDB("GIFTSHOP").orderBy("GiftshopID")
        if (!req.query.deleted)
            query = query.where("Deleted", 0);
        query.then((items) => {
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
        employee.getEmployeeAccessPerms,
        employee.requirePerms('attractions'),
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
        employee.getEmployeeAccessPerms,
        employee.requirePerms('attractions'),
        (req, res) => {
            let query = db.themeparkDB("GIFTSHOP").where('GiftshopID', req.params.id)
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

    app.post('/giftshops',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('attractions'),
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