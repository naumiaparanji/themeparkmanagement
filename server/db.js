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
async function getCustomers(){
    return await db("CUSTOMER");
}

async function setCustomer(fields){
    return await db("CUSTOMER").insert(fields)
    .onConflict("Email")
    .merge();
}

async function setEmployee(fields){
    return await db("EMPLOYEE").insert(fields)
    .onConflict("Email")
    .merge();
}

async function getAuthInfo(userEmail , isEmployee =false) {
    var target = "CUSTOMER";
    if (isEmployee)
        target = "EMPLOYEE";
    const dbObj = await db(target).select("Password").where("Email", userEmail).first();
    if (dbObj !== undefined) return dbObj.Password;
    return dbObj;
}


// Middleware
async function registerCustomer(req, res, next) {
    await db("CUSTOMER")
    .insert({Email: req.body.username, Password: await auth.hashpw(req.body.password)})
    .onConflict('Email')
    .ignore()
    .then((result) => {
        req.registrationError = result[0] === 0;
        if (req.registrationError) {
            req.registrationErrorInfo = 'UserExists';
            res.status(409);
        }
    })
    .catch((error) => {
        req.registrationError = true;
        req.registrationErrorInfo = 'SQLError';
        res.status(500);
        console.error(error);
    });
    next();
}

async function registerEmployee(req, res, next) {
    if (req.session.employeeUser === undefined) {
        req.registrationError = true;
        req.registrationErrorInfo = 'NotAuthorized';
        res.status(401);
        return next();
    }
    let newEmplyee = {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        DOB: req.body.dob,
        Address: req.body.address,
        PhoneNumber: req.body.phoneNumber,
        Email: req.body.email,
        Password: req.body.password,
        StartDate: req.body.startDate,
        EndDate: req.body.endDate
    };
    if (req.body.created != undefined) newEmplyee.Created = req.body.created; // Defaults to curdate() in the database
    await db("EMPLOYEE").insert(newEmplyee)
    .then((result) => {
        req.registrationError = result.length === 0;
        if (req.registrationError) {
            req.registrationErrorInfo = 'UserExists';
            res.status(409);
        }
    })
    .catch((error) => {
        req.registrationError = true;
        req.registrationErrorInfo = 'SQLError';
        res.status(500);
        console.error(error);
    });
    next();
}

module.exports = {
    themeparkDB: db,
    getCustomers,
    setCustomer,
    setEmployee,
    getAuthInfo,
    registerCustomer,
    registerEmployee
};