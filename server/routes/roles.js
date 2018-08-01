const express = require("express");
const router = express.Router();
const connection = require("../connection");
const { queryDatabaseWithPromise } = require("./utility");

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

router.post("/save_roles", (req, res) => {
  const roles = req.body.roles;
  const insertRole = "insert into user_roles (role_name) values (?)";
  const insertPrivilege =
    "insert ignore into user_role_privilege_mapping (role_id, privilege_id) values (?, ?)";
  const delPrivilege =
    "delete from user_role_privilege_mapping where role_id = ? and privilege_id = ?";
  let allPromises = [];
  roles.forEach(role => {
    if (role.role_id > 0) {
      Object.keys(role.privileges).forEach(key => {
        const params = [role.role_id, key];
        if (role.privileges[key]) {
          const p = queryDatabaseWithPromise(
            connection,
            insertPrivilege,
            params
          );
          allPromises.push(p);
        } else {
          const p = queryDatabaseWithPromise(connection, delPrivilege, params);
          allPromises.push(p);
        }
      });
    } else {
      queryDatabaseWithPromise(connection, insertRole, [role.role_name])
        .then(result => {
          const roleId = result.insertId;
          Object.keys(role.privileges).forEach(key => {
            if (role.privileges[key]) {
              const p = queryDatabaseWithPromise(connection, insertPrivilege, [
                roleId,
                key
              ]);
              allPromises.push(p);
            }
          });
        })
        .catch(err => {
          console.error(err);
        });
    }
  });
  Promise.all(allPromises)
    .then(data => {
      // console.log(data);
      res.status(200).json({ message: "success" });
    })
    .catch(err => {
      res.status(503).json({ message: "Error occurres", error: err });
    });
});

router.post("/get_user_roles", (req, res) => {
  const qry = `select role_id, role_name from user_roles`;
  queryDatabaseWithPromise(connection, qry, [])
    .then(result => {
      res.status(200).json({ roles: result });
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ error: err });
    });
});

module.exports = router;
