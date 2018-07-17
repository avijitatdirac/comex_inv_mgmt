const express = require("express");
const router = express.Router();
const connection = require("./connection");

router.post("/get_asset", (req, res) => {
  const qry = "select id,type_name from asset_types";
  connection.query(qry, (error, results) => {
    if (!error) {
      res.status(200).json({
        results: results
      });
    } else {
      res.status(200).json({
        results: error
      });
    }
  });
});

router.post("/get_asset_status_count", (req, res) => {
  const qry1 =
    "select b.id,b.type_name,count(*) as out_of_stock from asset a,asset_types b where status=0 and a.asset_type_id=b.id group by a.asset_type_id  order by b.id";
  const qry2 =
    "select b.id,b.type_name,count(*) as in_stock from asset a,asset_types b where status=1 and a.asset_type_id=b.id group by a.asset_type_id  order by b.id";
  const qry3 =
    "select b.id,b.type_name,count(*) as damaged from asset a,asset_types b where status=2 and a.asset_type_id=b.id group by a.asset_type_id  order by b.id";
  let x, y;
  connection.query(qry1, (error, results) => {
    x = results;
  });
  connection.query(qry2, (error, results) => {
    y = results;
  });
  connection.query(qry3, (error, results) => {
    res.status(200).json({
      out_of_stock: x,
      in_stock: y,
      damaged: results
    });
  });
});

router.post("/in_damaged_stock", (req, res) => {
  var qry1 = "select * from asset where asset_type_id=? and status=?";
  var status = req.body.status;
  var id = req.body.id;
  connection.query(qry1, [id, status], (error, results) => {
    if (error) {
      res.status(501).json({ isSuccess: false, error: error });
    } else {
      res.status(200).json({ isSuccess: true, results: results });
    }
  });
});

router.post("/get_all_values", (req, res) => {
  var qry =
    "select b.* from asset_types a,asset b where a.id=b.asset_type_id and a.type_name=?";
  var x;
  var type_name = req.body.type_name;
  var qry1 =
    "select d.asset_id,d.attribute_id,a.attr_name,d.attribute_value from asset_types_attributes" +
    " a,asset_types b,asset c,asset_details d where b.id=a.asset_type_id and b.type_name=?" +
    "and  c.asset_type_id=b.id and d.asset_id=c.id and d.attribute_id=a.id order by d.asset_id,d.attribute_id";
  var hsnCodeQuery =
    "select distinct b.hsnCode from asset_types a,asset b where a.id=b.asset_type_id and a.type_name=?";
  connection.query(qry, [type_name], (error, results) => {
    if (error) {
      res.status(200).json({ isSuccess: false, error: error });
    } else {
      x = results;
    }
  });
  connection.query(hsnCodeQuery, [type_name], (error, results) => {
    if (error) {
      res.status(200).json({ isSuccess: false, error: error });
    } else {
      hsn_result = results;
    }
  });
  connection.query(qry1, [type_name], (error, results) => {
    res.status(201).json({
      isSuccess: true,
      dyna: results,
      static: x,
      hsnResult: hsn_result
    });
  });
});

router.post("/get_asset_type_customer_name", (req, res) => {
  var qry =
    "select distinct(d.CName), a.* from asset a,order_detail b,order_master c,customer d where a.asset_type_id=? and a.status=0 and a.id=b.asset_id and b.order_id=c.ID and d.Customer_Id=c.customer_id";
  var asset_type_id = req.body.asset_type_id;
  connection.query(qry, [asset_type_id], (error, results, fields) => {
    if (error) {
      res.status(501).json({ isSuccess: false, error: error });
    } else {
      res.status(200).json({ isSuccess: true, results: results });
    }
  });
});

module.exports = router;
