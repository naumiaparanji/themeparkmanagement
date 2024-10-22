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
async function getUser(userEmail, isEmployee=false) {
    if (!userEmail) return;
    let target = "CUSTOMER";
    if (isEmployee)
        target = "EMPLOYEE";
    return await db(target).where("Email", userEmail).first();
}

async function setUser(userEmail, fields, isEmployee=false, merge=true) {
    if (!userEmail) return false;
    let target = "CUSTOMER";
    if (isEmployee)
        target = "EMPLOYEE";
    fields.Email = userEmail;
    let query = db(target).insert(fields).onConflict("Email");
    if (merge) query = query.merge();
    else query = query.ignore();
    const result = await query;
    return result[0] != 0; // Returned id should never be 0 unless there was a conflict
}

module.exports = {
    themeparkDB: db,
    getUser,
    setUser,
};