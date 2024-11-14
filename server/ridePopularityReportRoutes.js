// Themepark modules
const auth = require("./auth");
const db = require("./db");

// App routes
module.exports = (app) => {
    app.get("/ridePopularity/data/allCategories", async (req, res) => {
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

    app.get("/ridePopularity/data/allRideNames", async (req, res) => {
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

    app.get("/ridePopularity/data/searchReturn", async (req, res) => {
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
};
