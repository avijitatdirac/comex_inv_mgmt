const express = require("express");
const fs = require("fs");
const { resolve } = require("path");
const mysql = require("mysql");
const router = express.Router();

// List of endpoint used
const CHECK_LOGIN = "/check_login";
const LOGOUT = "/logout";

//DB connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA
});

// default router, sends React's index.html,
// so that React code can execute
router.get("/", (req, res) => {
  let indexHtml = fs.readFileSync(
    resolve(__dirname + "/../build/index.html"),
    "utf8"
  );
  res.status(200).send(indexHtml);
});

//validate email and password
router.post(CHECK_LOGIN, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);
  console.log(password);

  const qry = `select 
                  username, 
                  first_name, 
                  last_name, 
                  dept_id, 
                  role_id, 
                  email_address, 
                  company_id, 
                  user_status, 
                  branch_id 
              from users 
              where email_address = ? and password = ?`;
  connection.query(qry, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      res.status(503).json({
        message: "A database error occurred",
        error: err,
        is_success: false
      });
    }

    if (results.length === 0) {
      res
        .status(200)
        .json({ message: "Invalid username or password", is_success: false });
    } else {
      const result = results[0];
      const { username } = result;
      req.session.username = username;
      console.log(req.session);
      res.status(200).json({ message: "success", is_success: true, ...result });
    }
  });
});

// handle logout action
router.post(LOGOUT, (req, res) => {
  req.session.regenerate(err => {
    if (err) {
      throw err;
    }

    req.session.cookie.maxAge = eval(process.env.COOKIE_MAX_AGE);
    req.session.secret = process.env.SESSION_SECRET;
    req.session.resave = false;
    req.session.saveUninitialized = true;

    res.status(200).json({ message: "Session regenerated", is_success: true });
  });
});

module.exports = router;