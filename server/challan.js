const express = require("express");
const router = express.Router();
const connection = require("./connection");

router.post("/get_challan_drafts", (req, res) => {
  var qry = `select id, challan_type, challan_description, create_timestamp, update_timestamp from challan_draft`;
  // var challan_number
  connection.query(qry, (error, results, fields) => {
    if (error) {
      res.status(501).json({
        isSuccess: false,
        error: error
      });
    } else {
    }
    res.status(200).json({
      isSuccess: true,
      results: results
    });
  });
});

router.post("/get_challan_details", (req, res) => {
  var challanId = req.body.challan_id;
  var qry = "select challan_details from challan_draft where id = ?";
  connection.query(qry, [challanId], (error, results, fields) => {
    if (!error) {
      res.status(200).json({
        isSuccess: true,
        results: results
      });
    } else {
      res.status(501).json({
        isSuccess: false,
        error: error
      });
    }
  });
});

router.post("/delete_challan_details", (req, res) => {
  var challanId = req.body.challan_id;
  var qry = "delete from challan_draft where id = ?";
  connection.query(qry, [challanId], (error, results, fields) => {
    if (!error) {
      res.status(200).json({
        isSuccess: true
      });
    } else {
      res.status(501).json({
        isSuccess: false,
        error: error
      });
    }
  });
});

module.exports = router;
