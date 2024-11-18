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

// Function to update an employee's details
    async function editEmployee(employeeID, updatedFields) {
    try {
      // Fetch the existing employee data
      const employee = await db('EMPLOYEE')
        .select('*')
        .where('EmployeeID', employeeID)
        .first();
  
      if (!employee) {
        throw new Error('Employee not found');
      }
  
      console.log('Current Employee Data:', employee);
  
      // Update the EMPLOYEE table
      await db('EMPLOYEE')
        .update({
          FirstName: updatedFields.firstName || employee.FirstName,
          LastName: updatedFields.lastName || employee.LastName,
          DOB: updatedFields.dob ? new Date(updatedFields.dob) : employee.DOB,
          Address: updatedFields.address || employee.Address,
          PhoneNumber: updatedFields.phoneNumber || employee.PhoneNumber,
          Email: updatedFields.email || employee.Email,
          Password: updatedFields.password || employee.Password,
          AccessLevel: updatedFields.accessLevel || employee.AccessLevel,
          StartDate: updatedFields.startDate ? new Date(updatedFields.startDate) : employee.StartDate,
          EndDate: updatedFields.endDate ? new Date(updatedFields.endDate) : employee.EndDate,
        })
        .where('EmployeeID', employeeID);
  
      console.log('Employee updated successfully.');
  
      // Fetch the updated employee data for confirmation
      const updatedEmployee = await db('EMPLOYEE')
        .select('*')
        .where('EmployeeID', employeeID)
        .first();
      console.log('Updated Employee Data:', updatedEmployee);
  
      return updatedEmployee;
    } catch (error) {
      console.error('Error editing employee:', error.message);
      throw error;
    }
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

async function getRidePopularitySummary(dateRange = ['1000-01-01', '9999-12-31']) {
    return db("RIDES as R")
        .leftJoin(
            db('RUNS')
                .select('*')
                .whereBetween('RideTime', dateRange)
                .as('RU'),
            'R.RideID',
            'RU.RideID'
        )
        .select({
            Ride_ID: 'R.RideID',
            Ride_Name: 'R.RideName',
            Category: 'R.Category',
            Number_Of_Runs: db.raw('COUNT(RU.RunID)'),
            Total_Riders: db.raw('IF(COUNT(RU.RunID) > 0, SUM(RU.NumofRiders), 0)'),
            AVG_Riders_Per_Run: db.raw(
                'IF(COUNT(RU.RunID) > 0, ROUND(AVG(RU.NumofRiders), 1), 0)'
            ),
            Ride_Capacity: 'R.Capacity',
            AVG_Percent_Capacity_Filled: db.raw(
                `CONCAT(ROUND(IF(COUNT(RU.RunID) > 0, 100 * AVG(RU.NumofRiders / R.Capacity), 0), 0), '%')`
            ),
            Fewest_Riders_On_Run: db.raw(
                'IF(COUNT(RU.RunID) > 0, MIN(RU.NumofRiders), 0)'
            ),
            Most_Riders_On_Run: db.raw(
                'IF(COUNT(RU.RunID) > 0, MAX(RU.NumofRiders), 0)'
            ),
        })
        .groupBy('R.RideID')
        .orderBy([
            {column: 'Total_Riders', order: 'desc'},
            {column: 'R.RideID', order: 'asc'},
        ]);
}

async function getCategoryPopularitySummary(dateRange = ['1000-01-01', '9999-12-31']) {
    return db('RIDES AS R')
        .leftJoin(
            db('RUNS')
                .select('*')
                .whereBetween('RideTime', dateRange)
                .as('RU'),
            'R.RideID',
            'RU.RideID'
        )
        .select({
            Category: 'R.Category',
            Total_Runs: db.raw('COUNT(RU.RunID)'),
            Total_Riders: db.raw('IF(COUNT(RU.RunID) > 0, SUM(RU.NumofRiders), 0)'),
            AVG_Riders_Per_Run: db.raw(
                'IF(COUNT(RU.RunID) > 0, ROUND(AVG(RU.NumofRiders), 1), 0)'
            ),
            AVG_Ride_Capacity: db.raw('ROUND(AVG(R.Capacity), 0)'),
            AVG_Percent_Capacity_Filled: db.raw(
                `CONCAT(ROUND(IF(COUNT(RU.RunID) > 0, 100 * AVG(RU.NumofRiders / R.Capacity), 0), 0), '%')`
            ),
        })
        .groupBy('R.Category')
        .orderBy([
            {column: 'Total_Riders', order: 'desc'},
            {column: 'R.Category', order: 'asc'},
        ]);
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
    editEmployee,
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
