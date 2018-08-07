const express = require("express");
const router = express.Router();
const conn = require("../connection");
const { queryDatabaseWithPromise } = require("./utility");

router.post("/get_vendors", (req, res) => {
  const qry = `select vendor_id, vendor_name, address, contact_no, email, gst_no, pan_no from vendors`;
  queryDatabaseWithPromise(conn, qry, [])
    .then(result => {
      res.status(200).json({ vendors: result });
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ message: err });
    });
});

router.post("/insert_vendor", (req, res) => {
  const qry = `insert into vendors (vendor_name, address, contact_no, email, gst_no, pan_no) values (?, ?, ?, ?, ?, ?)`;
  const vendor_name = req.body.vendor_name;
  const address = req.body.address;
  const contact_no = req.body.contact_no;
  const email = req.body.email;
  const gst_no = req.body.gst_no;
  const pan_no = req.body.pan_no;
  const params = [vendor_name, address, contact_no, email, gst_no, pan_no];
  queryDatabaseWithPromise(conn, qry, params)
    .then(result => {
      if (result.insertId) {
        res.status(200).json({ vendor_id: result.insertId });
      } else {
        res.status(503).json({ message: "Internal server error" });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ message: err });
    });
});

router.post("/update_vendor", (req, res) => {
  const qry = `update vendors set vendor_name = ?, address = ?, contact_no = ?, email = ?, gst_no = ?, pan_no = ? where vendor_id = ?`;
  const vendor_name = req.body.vendor_name;
  const address = req.body.address;
  const contact_no = req.body.contact_no;
  const email = req.body.email;
  const gst_no = req.body.gst_no;
  const pan_no = req.body.pan_no;
  const vendor_id = req.body.vendor_id;
  const params = [
    vendor_name,
    address,
    contact_no,
    email,
    gst_no,
    pan_no,
    vendor_id
  ];
  queryDatabaseWithPromise(conn, qry, params)
    .then(result => {
      res.status(200).json({ message: "success" });
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ message: err });
    });
});

module.exports = router;
