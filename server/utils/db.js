// Themepark database code

const auth = require("./auth");
const db = require("knex")({
    client: "mysql2",
    connection: {
        host: process.env.MYSQL_ADDR,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    },
});

module.exports = {
    themeparkDB: db,
    getUser: async (email) => {
        return await db("CUSTOMER")
            .where("Email", email)
            .andWhere("Deleted", 0)
            .first();
    },
};

// Predefined queries
async function getUser(userEmail, isEmployee = false) {
    if (!userEmail) return;
    let target = "CUSTOMER";
    if (isEmployee) target = "EMPLOYEE";
    return await db(target).where("Deleted", 0).where("Email", userEmail).first();
}

async function getUsers(limit, offsetCount, isEmployee = false) {
    let target = "CUSTOMER";
    let order = "CustomerID";
    if (isEmployee) {
        target = "EMPLOYEE";
        order = "EmployeeID";
    }
    let query = db(target).where("Deleted", 0).orderBy(order).limit(limit);
    const offset = limit * offsetCount;
    if (offset > 0) query = query.offset(offset);
    return await query;
}

async function setUser(userEmail, fields, isEmployee = false, merge = true) {
    if (!userEmail) return false;
    let target = "CUSTOMER";
    if (isEmployee) target = "EMPLOYEE";
    fields.Email = userEmail;
    let query = db(target).insert(fields).onConflict("Email");
    if (merge) query = query.merge();
    else query = query.ignore();
    const result = await query;
    return result[0] != 0; // Returned id should never be 0 unless there was a conflict
}

async function getRides() {
    return await db("RIDES").where("Deleted", 0).orderBy("RideID");
}

//the dynamic dropdown funciton
async function getAvailableRides() {
    return await db("RIDES")
        .select("RideID", "RideName", "Category", "Capacity")
        .where({ Functioning: 1, Deleted: 0 })
        .orderBy("RideID");
}

async function getRidesNames() {
    let query = db("RIDES")
        .select("RideName")
        .where("Deleted", 0)
        .orderBy("RideName")
        .distinct();
    return await query;
}

async function getRidesCategories() {
    let query = db("RIDES")
        .select("Category")
        .where("Deleted", 0)
        .orderBy("Category")
        .distinct();
    return await query;
}

async function getEventCategories() {
    return await db("EVENTS")
        .select("EventType")
        .where("Deleted", 0)
        .distinct()
        .orderBy("EventType");
}

async function getPassCategories() {
    return await db("PASSES")
        .select("PassType")
        .where("Deleted", 0)
        .distinct()
        .orderBy("PassType");
}

async function getPassCategories() {
    return await db("PASSES")
        .select("PassType")
        .where("Deleted", 0)
        .distinct()
        .orderBy("PassType");
}

async function setMaintenanceRequest(fields, isEmployee) {
    if (!isEmployee) return false;

    let target = "MAINTENANCE";
    let query = db(target).insert({
        RideID: fields.RideID,
        Date: fields.Date,
        Description: fields.Description,
    });
    let result = await query;
    const maintenanceID = result;
    target = "RIDE_STATUS";
    query = db(target).insert({
        RideID: fields.RideID,
        Status: fields.Status,
        WeatherCondition: "CLEAR",
    }); // todo: allow weather condition to vary
    result = await query;
    const rideStatusID = result;
    target = "M_STATUS";
    query = db(target).insert({
        MaintenanceID: maintenanceID,
        RideStatusID: rideStatusID,
    });
    result = await query;

    return result[0] != 0;
}

async function getRideStatusID() {
    return await db("M_STATUS")
        .select("RideStatusID")
        .where("M_STATUS.Deleted", 0)
        .orderBy("MaintenanceID")
        .leftJoin(
            "MAINTENANCE",
            "M_STATUS.MaintenanceID",
            "MAINTENANCE.MaintenanceID"
        );
}

async function getResolveData() {
    return await db("MAINTENANCE")
        .select("Resolved")
        .where("MAINTENANCE.Deleted", 0)
        .distinct();
}

async function getMaintenanceTicket() {
    let result = await db("MAINTENANCE")
        .select()
        .where("MAINTENANCE.Deleted", 0)
        .orderBy("MAINTENANCE.MaintenanceID")
        .leftJoin("RIDES", "MAINTENANCE.RideID", "RIDES.RideID")
        .leftJoin("M_STATUS", "MAINTENANCE.MaintenanceID", "M_STATUS.MaintenanceID")
        .leftJoin(
            "RIDE_STATUS",
            "M_STATUS.RideStatusID",
            "RIDE_STATUS.RideStatusID"
        );
    console.log(result.toString());
    return result;
}

async function editMaintenanceTicket(fields) {
    const updatedRideID = (await getRides()).filter(
        (ride) => ride.RideName == fields.rideName
    )[0].RideID;

    const editMaintenance = await db("MAINTENANCE")
        .update({
            RideID: updatedRideID,
            Date: new Date(fields.date),
            Description: fields.description,
            Resolved: fields.resolveTicket,
        })
        .where("MaintenanceID", fields.maintenanceID);
    let rideStatusID = await db("M_STATUS")
        .select("RideStatusID")
        .where("MaintenanceID", fields.maintenanceID);
    const editRideStatus = await db("RIDE_STATUS")
        .update({Status: fields.status})
        .where("RideStatusID", rideStatusID[0].RideStatusID);
    return editRideStatus;
}

async function deleteMaintenanceTicket(maintenanceID) {
    const deleteMaintenannce = await db("MAINTENANCE")
        .update({deleted: 1})
        .where("MaintenanceID", maintenanceID);
    const deleteMStatus = await db("M_STATUS")
        .update({deleted: 1})
        .where("MaintenanceID", maintenanceID);
    console.log("In Maintenance Table");
    console.log(deleteMaintenannce);
    console.log("In M_Status Table");
    console.log(deleteMStatus);
    return deleteMStatus;
}

async function deleteEmployee(EmployeeID) {
    const deleteEmployee = await db("EMPLOYEE")
        .update({deleted: 1})
        .where("EmployeeID", EmployeeID);
    console.log("In Employee Table");
    console.log(deleteEmployee);
    return deleteMStatus;
}


async function setRuns(fields, isEmployee) {
    if (!isEmployee) return false;

    let target = "RUNS";
    let query = db(target).insert(fields);
    let result = await query;

    return result[0] != 0;
}

async function getRidePopularityInfo() {
    let target = "RIDE_POPULARITY_INFO";
    return db(target).select();
}

async function getRidePopularitySummary() {
    let target = "RIDE_POPULARITY_SUMMARY";
    return db(target).select();
}

async function getCategoryPopularitySummary() {
    let target = "CATEGORY_POPULARITY_SUMMARY";
    return db(target).select();
}

async function setRides(fields, isEmployee) {
    if (!isEmployee) return false;

    let target = "RIDES";
    let query = db(target).insert(fields);
    let result = await query;

    return result[0] != 0;
}

module.exports = {
    themeparkDB: db,
    getUser,
    setUser,
    getUsers,
    getRides,
    getAvailableRides,
    getRidesNames,
    getRidesCategories,
    getEventCategories,
    getPassCategories,
    setMaintenanceRequest,
    getRideStatusID,
    getResolveData,
    getMaintenanceTicket,
    editMaintenanceTicket,
    deleteMaintenanceTicket,
    deleteEmployee,
    setRuns,
    getRidePopularityInfo,
    getRidePopularitySummary,
    getCategoryPopularitySummary,
    setRides,
};
