const express = require("express");
const router = express.Router();
const connection = require("../connection");

router.post("/get_user_list", (req, res) => {
  const qry = `select 
                  first_name,
                  last_name,
                  email_address,
                  role_id,
                  branch_id
              from users`;
  connection.query(qry, (error, result) => {
    if (error) {
      res.status(503).json({ message: "Database error", error });
    } else {
      res.status(200).json({ userList: result });
    }
  });
});

router.post("/save_user_details", (req, res) => {
  const qry = `insert into users(
        username, 
        password, 
        first_name, 
        last_name, 
        email_address, 
        role_id, 
        branch_id
    ) values (
        ?,
        ?, 
        ?, 
        ?, 
        ?, 
        ?, 
        ?
    ) on duplicate key update 
                    password = ?,
                    first_name = ?,
                    last_name = ?,
                    role_id = ?,
                    branch_id = ?`;

  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email_address = req.body.email_address;
  const password = req.body.password;
  const role_id = req.body.role_id;
  const branch_id = req.body.branch_id;
  const params = [
    email_address,
    password,
    first_name,
    last_name,
    email_address,
    role_id,
    branch_id,
    password,
    first_name,
    last_name,
    role_id,
    branch_id
  ];
  connection.query(qry, params, (error, result) => {
    if (error) {
      res.status(503).json({ message: "Database error", error });
    } else {
      res.status(200).json({ message: "success" });
    }
  });
});

module.exports = router;
