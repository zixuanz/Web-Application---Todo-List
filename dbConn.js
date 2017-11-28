var mysql = require("mysql");
const dbConfig = require("./config/db.js");
var pool = mysql.createPool(dbConfig.mysqlConfig);

module.exports = pool;
