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
 * @param {String} userEmail 
 * @param {Boolean} isEmployee 
 * @returns {String | undefined}
 */
async function getAuthInfo(userEmail , isEmployee =false) {
    var target = "CUSTOMER";
    if (isEmployee)
        target = "EMPLOYEE";
    const dbObj = await db(target).select("Password").where("Email", userEmail).first();
    if (dbObj !== undefined) return dbObj.Password;
    return dbObj;
}

async function registerCustomer(req, res, next) {
    // This will fail atm because all of the customer fields are NOT NULL
    await db("CUSTOMER").insert({Email: req.body.username, Password: await auth.hashpw(req.body.password)})
    .then((result) => {
        req.registrationError = result.length === 0;
        req.registrationErrorInfo = 'UserExists';
    })
    .catch((error) => {
        req.registrationError = true;
        req.registrationErrorInfo = 'SQLError';
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