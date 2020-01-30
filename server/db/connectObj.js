var mysql = require("mysql");
const config = {
    host     : 'localhost',       
    user     : 'root',              
    password : '12345678',       
    port: '3306',                   
    database: 'yiyoumei2' 
}
const con = mysql.createConnection(config);
con.connect();
module.exports = con;


