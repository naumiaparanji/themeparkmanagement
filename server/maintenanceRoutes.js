// Themepark modules
const auth = require("./auth");
const db = require("./db");
const {
  checkSessionForEmployee,
  getRequestingEmployee,
} = require("./employeeRoutes");

// App routes
module.exports = (app) => {
  app.get("/maintenance/data/allCategories", async (req, res) => {
    const categoriesData = await db.getRidesCategories().catch((e) => {
      console.log(e);
      res.status(500).json({ success: false, error: "SQLError" });
      return;
    });
    res.status(200).json({
      success: true,
      data: categoriesData,
    });
  });

  app.get("/maintenance/data/allRideNames", async (req, res) => {
    const rideNameData = await db.getRidesNames().catch((e) => {
      console.log(e);
      res.status(500).json({ success: false, error: "SQLError" });
      return;
    });
    res.status(200).json({
      success: true,
      data: rideNameData,
    });
  });

  app.get("/maintenance/data/searchReturn", async (req, res) => {
    const maintenanceTicket = await db.getMaintenanceTicket().catch((e) => {
      console.log(e);
      res.status(500).json({ success: false, error: "SQLError" });
      return;
    });
    res.status(200).json({
      success: true,
      data: maintenanceTicket,
    });
  });

  // for update CURRENTLY NOT WORKING
  app.put("/maintenance/data/update", async (req, res) => {
    const maintenanceID = req.params.searchMaintenanceId;
    try {
      await db.query("UPDATE MAINTENANCE SET  WHERE MaintenanceID = ?", [
        maintenanceID,
      ]);
      res
        .status(200)
        .json({ message: "Maintenance ticket updated successfully" });
    } catch (error) {
      console.error("Error updating maintenance ticket.", error);
      res
        .status(500)
        .json({ message: "Server error updating maintenance ticket." });
    }
  });

  // for delete
  app.delete("/maintenance/data/delete/:maintenanceID", async (req, res) => {
    const {maintenanceID} = req.params;
    try {
      return await db.deleteMaintenanceTicket(maintenanceID);
      // need to delete in M_STATUS and update in RIDES
      res
        .status(200)
        .json({ message: "Maintenance ticket deleted successfully" });
    } catch (error) {
      console.error("Error deleting maintenance ticket.", error);
      res
        .status(500)
        .json({ message: "Server error deleting maintenance ticket." });
    }
  });

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
