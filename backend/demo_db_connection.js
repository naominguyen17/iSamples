var mysql = require('mysql2');

var con = mysql.createConnection({
    host: 'fel.ddns.net',
    user: 'iSamplesBackend',
    password: 'BdZZDw2F5fF4TepYdP1V',
    insecureAuth: true
});

con.connect(function(err) {
    if(err) throw err;
    console.log("Connected");
});
