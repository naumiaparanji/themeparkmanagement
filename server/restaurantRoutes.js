const db = require("./db");
const employee = require("./employeeRoutes");

// App routes
module.exports = (app) => {
    
    app.get('/restaurants', (req, res) => {
        db.themeparkDB("RESTAURANT").where("Deleted", 0).orderBy("RestaurantID")
        .then((items) => {
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
        (req, res) => {
            db.themeparkDB("RESTAURANT").update("Deleted", 1).where('RestaurantID', req.params.id)
            .then(() => res.status(200).json({success: true}))
            .catch((e) => {
                console.error(e);
                res.status(500).json({success: false, error: "SQLError"});
            });
        }
    )

    app.post('/restaurants',
        employee.checkSessionForEmployee,
        employee.getRequestingEmployee,
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