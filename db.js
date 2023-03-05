const mysql = require('mysql'); //mysqlを使うためのやーつ

var dbconnection = mysql.createConnection({
  host: process.env.DB_HOSTNAME,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = dbconnection;
