const mysql = require("mysql");

// DB Configurations
const DB_CONFIG = {
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000
};

// create connection pool
const pool = mysql.createPool(DB_CONFIG);

// log pool event for DEBUGGING
pool.on("acquire", function(connection) {
  console.log("Connection %d acquired", connection.threadId);
  console.log("All Connections: ", pool._allConnections.length);
  console.log("Free Connections: ", pool._freeConnections.length);
});

pool.on("connection", function(connection) {
  console.log("New DB Connection: ", connection.threadId);
});

pool.on("release", function(connection) {
  console.log("Connection %d released", connection.threadId);
  console.log("All Connections: ", pool._allConnections.length);
  console.log("Free Connections: ", pool._freeConnections.length);
});

function connectDatabase() {
  return pool;
}

// function connectDatabase() {
//   const conn = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_SCHEMA
//   });
//   conn.connect(err => {
//     if (!err) {
//       console.log("Successfully connected to database");
//     } else {
//       console.log("Cannot connect to the database", err);
//     }
//   });
//   return conn;
// }

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
