var mysql = require("mysql");
const config = {
    host     : 'localhost',       
    user     : 'root',              
    password : '123456',       
    port: '3306',                   
    database: 'yiyoumei' 
}
const con = mysql.createConnection(config);
con.connect();
module.exports = con;


