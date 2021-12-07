const mysql = require('mysql2/promise');
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors'); // allows middleman to be accessed from public
const path = require('path');


const port = 3000;

const sqlPool = mysql.createPool({
    host: 'fel.ddns.net',
    user: 'iSamplesBackend',
    password: 'BdZZDw2F5fF4TepYdP1V',
    database: 'plantHierarchy'
});

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({origin: "*"})); // allow public interaction

// Returns json object of the table per the interface.
async function retrieveJSONTable() {
    const con = await sqlPool.getConnection();
    let query = "SELECT * FROM PlantCharValues";
    const [rows, fields] = await con.query(query);
    con.release();
    return [rows, fields];
}

async function transformDataList(rows) {
    var data = {};
    var colnames = {"PlantName":null};
    for(let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let pname = row.PlantName;
        let cname = row.PartChar;
        if(!(pname in data)) {
            data[pname] = {"PlantName": pname};
        }
        data[pname][cname] = row.ValueName;
        colnames[cname]=null;
    }
    // fill in null for absent values?
    // no need.
    return [Object.values(data), Object.keys(colnames)];
}

async function retrieveJSONHiearchy() {    
    const con = await sqlPool.getConnection();
    function setDefault(map, primaryKeys, val) {
        let lastMap = map;
        primaryKeys.forEach((item, idx) => {
            if(idx >= (primaryKeys.length-1)) {
                return;
            }
            if(!(item in lastMap)) {
                lastMap[item] = {};
            }
            lastMap = lastMap[item];
        });
        lastMap[primaryKeys[primaryKeys.length-1]] = val;
        return lastMap;
    }
    let query = "SELECT * FROM BindingList";
    const [rows, fields] = await con.query(query);
    con.release();
    var data = {AllPlants: {}};
    let plants = data.AllPlants;
    var cols = ["PlantName", "PartName", "CharName", "ValueName"];
    for(let i = 0; i < rows.length; i++) {
        let row = rows[i];
        setDefault(plants, [row[cols[0]], row[cols[1]], row[cols[2]]],
            row[cols[3]]);
        
    }
    return [rows, fields, data, cols];
}

app.get("/data/list", async (req, res)=>{
    console.log("Prompted "+req.get("Accept"));
    res.format({
        "application/json": async function() {
            // user sent GET with application/json
            let retval = await retrieveJSONTable();
            let [rows, fields] = retval;
            // rows (names are ordered lexicographically):
            // +-----------+------------+-----------+
            // | PlantName | PartChar   | ValueName |
            // +-----------+------------+-----------+
            // | PlantB    | Leaf_Color | Red       |
            // | PlantA    | Leaf_Color | Green     |
            // | PlantA    | Stem_Color | Green     |
            // | PlantA    | Leaf_Shape | Toothed   |
            // +-----------+------------+-----------+
            [data, colnames] = await transformDataList((rows));
            console.log(rows);
            console.log(data);
            res.json({"data":data, "colnames": colnames});
        },
        default: async function() {
            let retval = await retrieveJSONTable();
            let [rows, fields] = retval;
            [data, colnames] = await transformDataList((rows));
            console.log(rows);
            console.log(data);
            res.json({"data":data, "colnames": colnames});
        }
    });
});

app.get("/data/hierarchy", async (req, res)=>{
    console.log("Prompted "+req.get("Accept"));
    res.format({
        "application/json": async function() {
            // user sent GET with application/json
            let retval = await retrieveJSONHiearchy();
            let [rows, fields, data, cols] = retval;
            console.log(retval);
            res.json({data: data, colnames: cols});
        },
        default: async function() {
            let retval = await retrieveJSONHiearchy();
            let [rows, fields, data, cols] = retval;
            console.log(retval);
            res.json({data: data, colnames: cols});
        }
    });
});

app.get("/", (req,res)=> {
    console.log("Prompted index");
    res.format({
        "text/html": ()=> {
            // send the frontend.html file
            res.sendFile(path.resolve(__dirname, "../index.html"));
        }
    })

});

app.get(/^\/\w+.(html|css|js)/, (req, res)=> {
    console.log("Prompted web");
    console.log(req.url);
    res.format({
        "text/html": ()=> {
            // send the frontend.html file
            res.sendFile(path.resolve(__dirname, ".."+req.url));
        }
    })
})

app.listen(port, function () {
    console.log("SERVER STARTED PORT: "+port);
});