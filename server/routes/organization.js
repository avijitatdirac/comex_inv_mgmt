const express = require("express");
const router = express.Router();
const connection = require("../connection");

router.post("/get_organization_name", (req, res) => {
  const qry = "select id, name, address from organization";
  connection.query(qry, (error, result) => {
    if (error) {
      res.status(503).json({ message: "Database error", error });
    } else {
      if (result.length > 0) {
        const { id, name, address } = result[0];
        res.status(200).json({ id, name, address });
      } else {
        res.status(200).json({ id: "", name: "", address: "" });
      }
    }
  });
});

router.post("/save_organization", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const address = req.body.address;
  const qry = `insert into organization(
                        id,
                        name,
                        address 
                    ) values (
                        ?,
                        ?,
                        ?
                    ) on duplicate key update 
                        name = ?,
                        address = ?`;
  const params = [id, name, address, name, address];
  connection.query(qry, params, (error, result) => {
    if (error) {
      res.status(503).json({ message: "Database error", error });
    } else {
      res.status(200).json({ message: "success" });
    }
  });
});

module.exports = router;
