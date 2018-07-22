const express = require("express");
const router = express.Router();
const connection = require("../connection");

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

module.exports = router;
