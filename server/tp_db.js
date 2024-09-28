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

async function getCustomers(){
    return await db("CUSTOMER");
}

async function setCustomer(fields){
    return await db("CUSTOMER").insert(fields)
    .onConflict("Email")
    .merge();
}

// etc...

module.exports = {
    getCustomers,
    setCustomer
};