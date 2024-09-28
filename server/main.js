// Themepark modules
const tp_auth = require("./tp_auth");
const tp_db = require("./tp_db");

// Server modules
const express = require("express");
const app = express();
const port = Number(process.env.SERVER_PORT);

// Example usage of themepark modules
async function runTest() {
    console.log("Running tests on themepark modules...");

    ret_txt = "";

    // Password verification example
    hashed_pw = await tp_auth.hashpw("password"); 
    ret_txt += hashed_pw + "\n" + await tp_auth.checkpw("password", hashed_pw) + "\n"; // Should output hash string and true

    // DB testing
    customers = await tp_db.getCustomers();
    for (element of customers) {
        ret_txt += `Updating password for ${element["Email"]}\n`;

        // Update local state of customer entity
        element["Password"] = await tp_auth.hashpw("password");

        // Push modified state to database
        // Conflics such as failure or connection loss should be handled properly in final implementation
        await tp_db.setCustomer(element);
    }

    return ret_txt;
}

// Routes for server requests. Uses express.js
// express-session can also be used for session management

app.get("/", async (req, res) => {
    console.log(`Received request from ${req.ip} at path /`);
    try {
        res_body = await runTest();
        res.send("<pre>" + res_body + "</pre>");
    } catch (e) {
        console.log(e);
        res.send("Whoops! An error occurred!");
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});