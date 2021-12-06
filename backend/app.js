const mysql = require('mysql2/promise');
const express = require("express");
const bodyParser = require('body-parser');
const port = 3000;

const sqlPool = mysql.createPool({
    host: 'fel.ddns.net',
    user: 'iSamplesBackend',
    password: 'BdZZDw2F5fF4TepYdP1V',
    database: 'plantsamples'
});

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
// Returns json object of the table per the interface.
async function retrieveJSONTable() {
    const con = await sqlPool.getConnection();
    let query = "SELECT * FROM LiteralCharacterValues";
    const [rows, fields] = await con.query(query);
    con.release();
    return [rows, fields];
}
app.get("/", async (req, res)=>{
    console.log("Prompted "+req.get("Content-Type"));
    res.format({
        "application/json": async function() {
            // user sent GET with application/json
            let retval = await retrieveJSONTable();
            let [rows, fields] = retval;
            console.log('retval ', retval);
            res.json(rows);
        },
        default: async function() {
            let retval = await retrieveJSONTable();
            let [rows, fields] = retval;
            console.log('retval ', retval);
            res.json(rows);
        }
    });
});

app.listen(port, function () {
    console.log("SERVER STARTED PORT: 3000");
});