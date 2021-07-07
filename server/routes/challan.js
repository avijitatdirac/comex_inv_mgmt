const express = require("express");
const router = express.Router();
const connection = require("../connection");

router.post("/get_challan", (req, res) => {
  var qry = `SELECT challan_number FROM order_master where customer_id = ?;`;
  var customer_id = req.body.customer_id;
  // var challan_number
  connection.query(qry, [customer_id], (error, results, fields) => {
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

router.post("/insert_challan_draft", (req, res) => {
  var challanType = req.body.challan_type;
  var challanDescription = req.body.challan_description;
  var challanDetails = req.body.challan_details;

  var qry = `insert into challan_draft
            (challan_type, challan_description, challan_details, create_timestamp, update_timestamp)
            values (?, ?, ?, null, null)`;

  connection.query(
    qry,
    [challanType, challanDescription, challanDetails],
    (error, results, response) => {
      if (error) {
        res.status(501).json({
          isSuccess: false,
          error: error
        });
      } else {
        res.status(200).json({
          isSuccess: true
        });
      }
    }
  );
});

router.post("/modify_challan_draft", (req, res) => {
  var id = req.body.id;
  var challanType = req.body.challan_type;
  var challanDescription = req.body.challan_description;
  var challanDetails = req.body.challan_details;

  var qry = `update challan_draft set
            challan_type = ?,
            challan_description = ?,
            challan_details = ?,
            create_timestamp = null,
            update_timestamp = null
                where id = ?`;

  connection.query(
    qry,
    [challanType, challanDescription, challanDetails, id],
    (error, results, response) => {
      if (error) {
        res.status(501).json({
          isSuccess: false,
          error: error
        });
      } else {
        res.status(200).json({
          isSuccess: true
        });
      }
    }
  );
});

module.exports = router;
