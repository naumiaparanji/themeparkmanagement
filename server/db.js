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

async function getEvents() {
  return await db("EVENTS").where("Deleted", 0).orderBy("EventID");
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

async function getMaintenanceTicket(){
  return await db("MAINTENANCE").select().where("MAINTENANCE.Deleted", 0).orderBy("MaintenanceID").leftJoin('RIDES', 'MAINTENANCE.RideID', 'RIDES.RideID');
}

async function deleteMaintenanceTicket(maintenanceID) {
  return await db("MAINTENANCE").update({deleted: 1}).where("MaintenanceID", maintenanceID);
}

async function setRuns(fields, isEmployee) {
    if (!isEmployee) return false;

    let target = "RUNS";
    let query = db(target).insert(fields);
    let result = await query;

    return result[0] != 0;
}

async function registerForEvent(eventId, customerId) {
  try {
      // Insert a new event ticket
      const result = await db('EVENT_TICKET').insert({ EventID: eventId, CustomerID: customerId });
      return result;  // Return result if successful
  } catch (error) {
      console.error('Error during event registration:', error);
      throw error;  // Re-throw the error to be handled by the caller
  }
}


module.exports = {
  themeparkDB: db,
  getUser,
  setUser,
  getUsers,
  getRides,
  getRidesNames,
  getRidesCategories,
  getEvents,
  getEventCategories,
  setMaintenanceRequest,
  getMaintenanceTicket,
  deleteMaintenanceTicket,
  setRuns,
  registerForEvent
};
