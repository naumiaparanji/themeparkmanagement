// Themepark database code

const db = require("knex")({
    client: "mysql2",
    connection: {
        host: process.env.MYSQL_ADDR,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DB,
    },
});
const auth = require("./auth");

async function getCustomers(){
    return await db("CUSTOMER");
}

async function setCustomer(fields){
    return await db("CUSTOMER").insert(fields)
    .onConflict("Email")
    .merge();
}

/**
 * Query the database for user authentication info and returns a password hash if the user exists
 * @param {String} user_email 
 * @param {Boolean} is_employee 
 * @returns {String | undefined}
 */
async function getAuthInfo(user_email, is_employee=false) {
    var target = "CUSTOMER";
    if (is_employee)
        target = "EMPLOYEE";
    const dbObj = await db(target).select("Password").where("Email", user_email).first();
    if (dbObj !== undefined) return dbObj.Password;
    return dbObj;
}

async function registerCustomer(req, res, next) {
    // Just an example. Needs work.
    await db("CUSTOMER").insert({Email: req.body.username, Password: await auth.hashpw(req.body.password)})
    .returning('CustomerID')
    .then((result) => {
        req.reg_error = result.length === 0;
    })
    .catch((error) => {
        req.reg_error = true;
        console.error(error);
    });
    next();
}

// etc...

module.exports = {
    getCustomers,
    setCustomer,
    getAuthInfo,
    registerCustomer
};