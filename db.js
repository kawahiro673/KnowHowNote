const mysql = require('mysql'); //mysqlを使うためのやーつ

var dbconnection = mysql.createConnection({
  // host: 'us-cdbr-east-06.cleardb.net',
  // port: 3306,
  // user: 'b7a48a6bf21f12',
  // password: '386777a7',
  // database: 'heroku_436d62cc5e9f7c4',
  host: process.env.DB_HOSTNAME,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = dbconnection;
