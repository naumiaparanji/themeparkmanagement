// Themepark modules
const auth = require("./auth");
const db = require("./db");
const {checkSessionForEmployee, getRequestingEmployee} = require("./employeeRoutes");

// Auth check middleware

// const employeeAuth = auth.authenticate(async (username) => {
//     const user = await db.getUser(username, true);
//     if (!user) return undefined;
//     return user.Password;
// });

// App routes
module.exports = (app) => {
  app.post(
    "/employee/maintenance",
    checkSessionForEmployee,
    getRequestingEmployee,
    async (req, res) => {
      res
        .status(200)
        .json({
          success: true,
          user: req.session.employeeUser,
          firstName: req.requestingEmployee.FirstName,
          lastName: req.requestingEmployee.LastName,
          accessLevel: req.requestingEmployee.AccessLevel,
        });
    }
  );

  app.post("/maintenance/input", async (req, res) => {
    const rideData = await db.getRides().catch((e) => {
      console.log(e);
      res.status(500).json({ success: false, error: "SQLError" });
      return;
    });

    const ride = rideData.find(
      (element) => element.RideName === req.body.rideName
    );

    const statusValue = (req.body.status === "Operational" ? 1 : 0);

    const maintenance = await db
    .setMaintenanceRequest(
        {
        RideID: ride.RideID,
        Date: req.body.date,
        Description: req.body.description,
        Status: statusValue,
        },
        true,
        true
    )
    .catch((e) => {
        console.log(e);
        res.status(500).json({ success: false, error: "SQLError" });
        return;
    });

    // get ride status id

    // insert both into joined table

    // if(!success) {
    //     res.status(409).json({success: false, error: "UserExists"});
    //     return;
    // }
    res.status(201).json({ success: true });
  });
  
};
