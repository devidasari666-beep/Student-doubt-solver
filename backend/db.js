const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "devi@12345",
  database: "doubtdb"
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database!");
});

module.exports = db;