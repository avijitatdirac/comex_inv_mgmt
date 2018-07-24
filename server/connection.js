const mysql = require("mysql");

function connectDatabase() {
  const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA
  });
  conn.connect(err => {
    if (!err) {
      console.log("Successfully connected to database");
    } else {
      console.log("Cannot connect to the database", err);
    }
  });
  return conn;
}

// /**
//  * create a singleton DB connection here which can be imported everywhere and used
//  *
//  * NOTE: we should later change this to connection pool to support heavy user load
//  */
// var dbConn;
// function connectDatabase() {
//   if (!dbConn) {
//     dbConn = mysql.createConnection({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_SCHEMA
//     });
//     dbConn.connect(err => {
//       if (!err) {
//         console.log("Successfully connected to database");
//       } else {
//         console.log("Cannot connect to the database", err);
//       }
//     });
//   }
//   return dbConn;
// }

module.exports = connectDatabase();
