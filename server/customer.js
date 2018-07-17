const express = require("express");
const router = express.Router();
const connection = require("./connection");

router.post("/get_customer_roles", (req, res) => {
  const qrGetRoles = "SELECT * FROM  customer_role";
  connection.query(qrGetRoles, (error, results) => {
    if (error) {
      res.status(503).json({ isSuccess: false, error: error });
    } else {
      res.status(201).json({ isSuccess: true, customerRoles: results });
    }
  });
});

router.post("/get_customer", (req, res) => {
  const qrGetCust = "SELECT * FROM  customer";
  const qrGetCustLoc =
    "SELECT cl.* FROM  customer as c, customer_location_master as cl where c.Customer_Id=cl.Customer_Id";
  connection.query(qrGetCust, (error, results) => {
    if (error) {
      res.status(501).json({ isSuccess: false, error: error });
    } else {
      customerDetails = results;
    }
  });
  connection.query(qrGetCustLoc, (error, results) => {
    if (error) {
      res.status(501).json({ isSuccess: false, error: error });
    } else {
      res.status(201).json({
        isSuccess: true,
        customerDetails: customerDetails,
        locationDetails: results
      });
    }
  });
});

module.exports = router;
