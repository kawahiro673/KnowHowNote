const mysql = require('mysql'); //mysqlを使うためのやーつ

var exports = mysql.createConnection({
  host: 'us-cdbr-east-06.cleardb.net',
  port: 3306,
  user: 'b7a48a6bf21f12',
  password: '386777a7',
  database: 'heroku_436d62cc5e9f7c4',
});

module.exports = exports;
