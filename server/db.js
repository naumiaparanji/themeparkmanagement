// Themepark database code

const auth = require("./auth");
const db = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.MYSQL_ADDR,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
  },
});

module.exports = {
  themeparkDB: db,
  getUser: async (email) => {
      return await db('CUSTOMER').where('Email', email).andWhere('Deleted', 0).first();
  }
};

// Predefined queries
async function getUser(userEmail, isEmployee = false) {
  if (!userEmail) return;
  let target = "CUSTOMER";
  if (isEmployee) target = "EMPLOYEE";
  return await db(target).where("Deleted", 0).where("Email", userEmail).first();
}

async function getUsers(limit, offsetCount, isEmployee=false) {
    let target = "CUSTOMER";
    let order = "CustomerID";
    if (isEmployee) {
        target = "EMPLOYEE";
        order = "EmployeeID";
    }
    let query = db(target).where("Deleted", 0)
    .orderBy(order)
    .limit(limit)
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

async function getRides(){
    return await db("RIDES").where("Deleted", 0).orderBy("RideID");
}

async function getRidesNames() {
  let query = db("RIDES").select("RideName").where("Deleted", 0).orderBy("RideName").distinct();
  return await query;
}

async function getRidesCategories(){
  let query = db("RIDES").select("Category").where("Deleted", 0).orderBy("Category").distinct();
  // const offset = limit * offsetCount;
  // if (offset > 0) query = query.offset(offset);
  return await query;
}

async function getEventCategories() {
  return await db("EVENTS").select("EventType").where("Deleted", 0).distinct().orderBy("EventType");
}

async function setMaintenanceRequest(fields, isEmployee) {
  if (!isEmployee) return false;

  let target = "MAINTENANCE";
  let query = db(target).insert({RideID: fields.RideID, Date: fields.Date, Description: fields.Description});
  let result = await query;
  const maintenanceID = result;
  target = "RIDE_STATUS";
  query = db(target).insert({RideID: fields.RideID, Status: fields.Status, WeatherCondition: "CLEAR"}); // todo: allow weather condition to vary
  result = await query;
  const rideStatusID = result;
  target = "M_STATUS";
  query = db(target).insert({MaintenanceID: maintenanceID, RideStatusID: rideStatusID});
  result = await query;

  return result[0] != 0;
}

async function getRideStatusID(){
  return await db("M_STATUS").select("RideStatusID ").where("M_STATUS.Deleted", 0).orderBy("MaintenanceID").leftJoin("MAINTENANCE", "M_STATUS.MaintenanceID", "MAINTENANCE.MaintenanceID");
}

async function getMaintenanceTicket(){
  return await db("MAINTENANCE").select().where("MAINTENANCE.Deleted", 0).orderBy("MaintenanceID").leftJoin('RIDES', 'MAINTENANCE.RideID', 'RIDES.RideID');
}

async function editMaintenanceTicket(fields){
    const editMaintenance = await db("MAINTENANCE").update({RideID: fields.rideID, Date: new Date(fields.date), Description: fields.description}).where("MaintenanceID", fields.maintenanceID);
    const rideStatusID = await db("M_STATUS").select("RideStatusID").where("MaintenanceID", fields.maintenanceID);
    const editRideStatus = await db("RIDE_STATUS").update({Status: fields.status}).where("RideStatusID", rideStatusID);

    return editRideStatus;
}

async function deleteMaintenanceTicket(maintenanceID) {
  const deleteMaintenannce = await db("MAINTENANCE").update({deleted: 1}).where("MaintenanceID", maintenanceID);
  const deleteMStatus = await db("M_STATUS").update({deleted: 1}).where("MaintenanceID", maintenanceID);
  console.log("In Maintenance Table");
  console.log(deleteMaintenannce);
  console.log("In M_Status Table");
  console.log(deleteMStatus);
  return deleteMStatus;
}

async function deleteEmployee(EmployeeID) {
  const deleteEmployee = await db("EMPLOYEE").update({deleted: 1}).where("EmployeeID", EmployeeID);
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

module.exports = {
  themeparkDB: db,
  getUser,
  setUser,
  getUsers,
  getRides,
  getRidesNames,
  getRidesCategories,
  getEventCategories,
  setMaintenanceRequest,
  getRideStatusID,
  getMaintenanceTicket,
  editMaintenanceTicket,
  deleteMaintenanceTicket,
  deleteEmployee,
  setRuns
};
