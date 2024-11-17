const db = require("../utils/db");
const employee = require("./employeeRoutes");

// App routes
module.exports = (app) => {

    app.get('/restaurants', (req, res) => {
        let query = db.themeparkDB("RESTAURANT").orderBy("RestaurantID");
        if (!req.query.deleted)
            query = query.where("Deleted", 0);
        query.then((items) => {
            res.status(200).json({success: true, restaurants: items});
        })
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            })
    });

    app.put('/restaurants/:id',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('attractions'),
        (req, res) => {
            db.themeparkDB("RESTAURANT").update(req.body).where('RestaurantID', req.params.id)
                .then(() => res.status(200).json({success: true}))
                .catch((e) => {
                    console.error(e);
                    res.status(500).json({success: false, error: "SQLError"});
                });
        }
    );

    app.delete('/restaurants/:id',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('attractions'),
        (req, res) => {
            let query = db.themeparkDB("RESTAURANT").where('RestaurantID', req.params.id);
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

    app.post('/restaurants',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
        employee.getEmployeeAccessPerms,
        employee.requirePerms('attractions'),
        (req, res) => {
            db.themeparkDB("RESTAURANT").insert((req.body))
                .then(() => res.status(200).json({success: true}))
                .catch((e) => {
                    console.error(e);
                    res.status(500).json({success: false, error: "SQLError"});
                });
        }
    )

};