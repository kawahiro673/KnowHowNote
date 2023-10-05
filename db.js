const mysql = require('mysql');
const pool = mysql.createPool({
  host: process.env.DB_HOSTNAME,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = pool;
