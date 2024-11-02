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

// Predefined queries
async function getUser(userEmail, isEmployee = false) {
  if (!userEmail) return;
  let target = "CUSTOMER";
  if (isEmployee) target = "EMPLOYEE";
  return await db(target).where("Email", userEmail).first();
}

async function getUsers(limit, offsetCount, isEmployee=false) {
    let target = "CUSTOMER";
    let order = "CustomerID";
    if (isEmployee) {
        target = "EMPLOYEE";
        order = "EmployeeID";
    }
    let query = db(target)
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
    return await db("RIDES").orderBy("RideID");
}

async function getEvents() {
  return await db("EVENTS").orderBy("EventID");
}

async function setMaintenanceRequest(fields, isEmployee, merge = true) {
  if (!isEmployee) return false;

  if(isEmployee) target = "MAINTENANCE";
  let query = db(target).insert({RideID: fields.RideID, Date: fields.Date, Description: fields.Description});
  let result = await query;
  const maintenanceID = result;
  target = "RIDE_STATUS";
  query = db(target).insert({RideID: fields.RideID, Status: fields.Status, WeatherCondition: "CLEAR"});
  result = await query;
  const rideStatusID = result;
  target = "M_STATUS";
  query = db(target).insert({MaintenanceID: maintenanceID, RideStatusID: rideStatusID});
  result = await query;

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
  getEvents,
  setMaintenanceRequest,
  registerForEvent
};
