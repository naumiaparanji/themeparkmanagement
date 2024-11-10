// Themepark modules
const auth = require("./auth");
const db = require("./db");
const {
  checkSessionForEmployee,
  getRequestingEmployee,
} = require("./employeeRoutes");

// App routes
module.exports = (app) => {
  app.get(
    "/maintenance/data/allCategories",
    async (req, res) => {
      const categoriesData = await db
        .getRidesCategories()
        .catch((e) => {
          console.log(e);
          res.status(500).json({ success: false, error: "SQLError" });
          return;
        });
      res.status(200).json({
        success: true,
        data: categoriesData
      });
    }
  );

  app.get(
    "/maintenance/data/allRideNames",
    async (req, res) => {
      const rideNameData = await db
        .getRidesNames()
        .catch((e) => {
          console.log(e);
          res.status(500).json({ success: false, error: "SQLError" });
          return;
        });
      res.status(200).json({
        success: true,
        data: rideNameData
      });
    }
  );

  app.post(
    "/employee/maintenance",
    checkSessionForEmployee,
    getRequestingEmployee,
    async (req, res) => {
      res.status(200).json({
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
    
    if (ride === undefined) {
      res.status(503).json({ success: false, error: "BadRide" });
      return;
    }

    const statusValue = req.body.status === "Operational" ? 1 : 0;

    const maintenance = await db
      .setMaintenanceRequest(
        {
          RideID: ride.RideID,
          Date: req.body.date,
          Description: req.body.description,
          Status: statusValue,
        },
        true
      )
      .catch((e) => {
        console.log(e);
        res.status(500).json({ success: false, error: "SQLError" });
        return;
      });
      
    res.status(201).json({ success: maintenance });
  });
};
