const express = require("express");
const router = express.Router();
const connection = require("../connection");

router.post("/get_all_roles_privileges", (req, res) => {
  const qry = `SELECT 
            r.role_id,
            r.role_name,
            p.id AS privilege_id,
            p.privilege_name
        FROM
            user_role_privilege_mapping m
                JOIN
            user_roles r ON m.role_id = r.role_id
                JOIN
            user_privileges p ON m.privilege_id = p.id`;

  connection.query(qry, (error, result) => {
    if (error) {
      res.status(503).json({ message: "Database error", error });
    } else {
      res.status(200).json({ data: result });
    }
  });
});

router.post("/get_all_privileges", (req, res) => {
  const qry = `SELECT 
                id AS privilege_id, privilege_name
            FROM
                user_privileges`;

  connection.query(qry, (error, result) => {
    if (error) {
      res.status(503).json({ message: "Database error", error });
    } else {
      res.status(200).json({ data: result });
    }
  });
});

module.exports = router;
