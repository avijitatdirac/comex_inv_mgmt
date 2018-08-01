const express = require("express");
const router = express.Router();
const connection = require("../connection");
const { queryDatabaseWithPromise } = require("./utility");
router.post("/get_branch_names", (req, res) => {
  const qry = "select id, name from branch";
  connection.query(qry, (error, result) => {
    if (error) {
      res.status(503).json({ message: "Database error", error });
    } else {
      res.status(200).json({ branchNames: result });
    }
  });
});

router.post("/save_new_branch", (req, res) => {
  const new_branch = req.body.new_branch;
  const qry = "insert into branch (name) values (?)";
  const selectQry = "select id, name from branch";
  queryDatabaseWithPromise(connection, qry, [new_branch])
    .then(r => {
      if (r.insertId) {
        queryDatabaseWithPromise(connection, selectQry, []).then(result => {
          res.status(200).json({ branches: result });
        });
      } else {
        res.status(503).json({ message: "database error" });
      }
    })
    .catch(err => {
      res.status(503).json({ error: err });
    });
});

module.exports = router;
