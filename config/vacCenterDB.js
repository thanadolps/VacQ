const mysql = require("mysql");

const connection = mysql.createPool({
  host: "localhost",
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: "vacCenter",
});

module.exports = connection;
