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

router.post("/insert_asset_type", (req, res) => {
  var type_name = req.body.type_name;
  var attributes = req.body.attributes;
  var jsonData = JSON.parse(attributes);
  var length = jsonData.length;
  var i;
  var qry =
    "insert into asset_types(type_name,is_active,create_timestamp,update_timestamp) values (?,true,null,null)";
  var qry2 = `insert into asset_types_attributes(asset_type_id,attr_name,is_modifiable,is_mandatory,is_active,create_timestamp,update_timestamp,is_printable) values ((select id from asset_types where id=(SELECT MAX(id) from asset_types)),?,?,?,true,null,null,?)`;
  connection.beginTransaction(function(err) {
    if (err) {
      throw err;
    }
    //check1
    connection.query(qry, [type_name], (error, results, fields) => {
      if (!error) {
        res.status(200).json({
          results: "success"
        });
        for (i = 0; i < length; i++) {
          connection.query(qry2, [
            jsonData[i].name,
            jsonData[i].isMandatory,
            jsonData[i].isModifiable,
            jsonData[i].isPrintable
          ]);
        }
      } else {
        if (error) {
          if (error.errno === 1062) {
            res.status(501).json({
              is_Error: true
            });
          }
          return connection.rollback();
          return;
        }
      }
    });
    connection.commit(function(err) {
      if (err) {
        return connection.rollback();
      }
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

router.post("/remove_asset_value", (req, res) => {
  var asset_id = req.body.asset_id;
  var attribute_id = req.body.attribute_id;
  var attribute_value = req.body.attribute_value;
  var qry =
    "update asset_details set attribute_value=concat(?,' ','removed') where asset_details.asset_id=? and asset_details.attribute_id=?";
  connection.query(
    qry,
    [attribute_value, asset_id, attribute_id],
    (error, results, fields) => {
      if (error) {
        res.status(501).json({ isSuccess: true, error: error });
      } else {
        res.status(200).json({ isError: false, status: "success" });
      }
    }
  );
});

router.post("/get_all_modifiable_values", (req, res) => {
  var qry =
    "select b.* from asset_types a,asset b where a.id=b.asset_type_id and a.type_name=?";
  var x;
  var type_name = req.body.type_name;
  var qry1 =
    "select d.asset_id,d.attribute_id,a.attr_name,d.attribute_value from asset_types_attributes a,asset_types b,asset c,asset_details d where b.id=a.asset_type_id and b.type_name=? and a.is_modifiable=1 and c.asset_type_id=b.id and d.asset_id=c.id and d.attribute_id=a.id order by d.asset_id,d.attribute_id";

  connection.query(qry, [type_name], (error, results, fields) => {
    if (error) {
      res.status(200).json({
        isSuccess: false,
        error: error
      });
      return;
    } else {
      x = results;
    }
  });
  connection.query(qry1, [type_name], (error, results, fields) => {
    if (error) {
      res.status(501).json({
        isSuccess: error
      });
      return;
    } else {
      res.status(201).json({
        isSuccess: true,
        dyna: results,
        static: x
      });
    }
  });
});

router.post("/change_config_status", (req, res) => {
  var id = req.body.id;
  var qry = "update asset_config set status=0 where id=?";
  connection.query(qry, [id], (error, results, fields) => {
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
  });
});

router.post("/get_asset_config", (req, res) => {
  var qry1 =
    "select b.*,a.serial_no from asset a,asset_config b where a.id=b.asset_id and b.status=1 order by b.id";
  var qry2 =
    "select a.serial_no from asset a,asset_config b where a.id=b.child_asset_id and b.status=1 order by b.id";
  var x;
  connection.query(qry1, (error, results, fields) => {
    if (error) {
      res.status(501).json({
        isSuccess: false,
        error: error
      });
      return;
    } else {
      x = results;
      connection.query(qry2, (error, results, fields) => {
        res.json({
          asset_config_id: x,
          asset_config_child: results
        });
      });
    }
  });
});

router.post("/damaged_assets", (req, res) => {
  var qry = "select * from asset";
  connection.query(qry, (error, results, fields) => {
    if (error) {
      res.status(501).json({
        isSuccess: false,
        error: error
      });
    } else {
      res.status(200).json({
        isSuccess: true,
        results: results
      });
    }
  });
});

router.post("/insert_asset_value", (req, res) => {
  var i;
  var typeName = req.body.type_name;
  var static = JSON.parse(req.body.static);
  var dynamic = JSON.parse(req.body.dynamic);
  //change_config_table
  var qryAsset =
    "insert into asset(asset_type_id, serial_no, purchase_date, purchase_price, supplier, warehouse_location, procurement_date, status, create_timestamp, update_timestamp, part_code, make, warranty_end_date, transfer_order_no, comments, supplier_invoice, supplier_date, branch, transfer_order_date,hsnCode) values ((select id from asset_types where type_name=?),?,?,?,?,?,?,?,null,null,?,?,?,?,?,?,?,?,?,?)";

  var qryAssetDetails =
    "insert into asset_details(asset_id,attribute_id,attribute_value,create_timestamp,update_timestamp) values ((select id from asset where serial_no=?),?,?,null,null)";

  connection.beginTransaction(function(err) {
    if (err) {
      throw err;
    }
    connection.query(
      qryAsset,
      [
        typeName,
        static.serialNo,
        static.purchaseDate,
        static.purchasePrice,
        static.supplier,
        static.warehouseLocation,
        static.procurementDate,
        static.status,
        static.partCode,
        static.make,
        static.warrantyEndDate,
        static.transferOrder,
        static.comment,
        static.supplierInvoiceNo,
        static.supplierInvoiceDate,
        static.branch,
        static.transferOrderDate,
        static.hsnCode
      ],
      (error, results, fields) => {
        if (error) {
          // console.log('query 1 fail')
          res.status(501).json({
            isSuccess: false,
            error: error
          });
          return connection.rollback();
          //return;
        } else {
          for (i = 0; i < dynamic.length; i++) {
            // console.log('query 2')
            connection.query(
              qryAssetDetails,
              [static.serialNo, dynamic[i].id, dynamic[i].value],
              (error, results, fields) => {
                if (error) {
                  res.status(501).json({
                    isSuccess: false,
                    error: error
                  });
                  return connection.rollback();
                  return;
                }
              }
            );
          }
          res.status(200).json({
            isSuccess: true
          });
        }
      }
    );

    connection.commit(function(err) {
      if (err) {
        return connection.rollback();
      }
    });
  });
});

router.post("/send_for_repair", (req, res) => {
  var qry =
    "update asset set status=2, comments=concat(coalesce(comments, ''),' ',?)  where id=?";
  var id = req.body.id;
  var comments = req.body.comments;
  connection.query(qry, [comments, id], (error, results, fields) => {
    if (error) {
      res.status(501).json({ isSuccess: false, error: error });
    } else {
      res.status(200).json({ isSuccess: true });
    }
  });
});

router.post("/return_from_repair", (req, res) => {
  var qry = "update asset set status=1 where id=?";
  var id = req.body.id;
  connection.query(qry, [id], (error, results, fields) => {
    if (error) {
      res.status(501).json({ isSuccess: false, error: error });
    } else {
      res.status(200).json({ isSuccess: true });
    }
  });
});

router.post("/change_status_on_return", (req, res) => {
  var qUpdateAsset =
    "update asset set status = ?, comments = concat(coalesce(comments, ''),' ',?) where id = ?";
  var qUpdateOrder = "update order_detail set status = 0 where oid = ?";

  var assetUpdates = JSON.parse(req.body.data);
  var orderUpdates = JSON.parse(req.body.oid);
  connection.beginTransaction(function(err) {
    if (err) {
      throw err;
    }
    for (var i = 0; i < assetUpdates.length; i++) {
      // var str ="update asset set status = "+assetUpdates[i].status+", comments= concat(coalesce(comments, ''),' ',"+assetUpdates[i].comments+") where id = "+assetUpdates[i].id

      connection.query(
        qUpdateAsset,
        [assetUpdates[i].status, assetUpdates[i].comments, assetUpdates[i].id],
        (error, results, response) => {
          if (error) {
            // console.log('***error: ', error)
            res.status(501).json({
              error
            });
            return connection.rollback();
            return;
          }
        }
      );
    }

    for (var i = 0; i < orderUpdates.length; i++) {
      // console.log('***order: ', orderUpdates[i])
      connection.query(
        qUpdateOrder,
        [orderUpdates[i]],
        (error, results, response) => {
          if (error) {
            // console.log('***error2: ', error)
            res.status(501).json({
              error
            });
            return connection.rollback();
            return;
          }
        }
      );
    }
    connection.commit(function(err) {
      if (err) {
        res.status(501).json({
          error: err
        });
        return connection.rollback();
      } else {
        res.status(200).json({
          isSuccess: true
        });
      }
    });
  });
});

router.post("/reset_inventory_status", (req, res) => {
  var i;
  var qry = "update asset set status=1 where id=? ";
  var check = JSON.parse(req.body.data);
  //console.log(check)
  // console.log('query is: ',req.query)
  for (i = 0; i < check.length; i++) {
    connection.query(qry, [check[i]], (error, results, fields) => {
      if (error) {
        res.status(501).json({
          isSuccess: false,
          error: error
        });
        return;
      }
    });
  }
  res.status(200).json({
    isSuccess: true
  });
});

router.post("/change_inventory_status", (req, res) => {
  var i;
  var qry = "update asset set status=0 where id=? ";
  var maxChallanNoQuery = `select max(challan_number) last_challan from order_master`;
  var last_challan_number = "";

  var check = JSON.parse(req.body.data);

  for (i = 0; i < check.length; i++) {
    connection.query(qry, [check[i]], (error, results, fields) => {
      if (error) {
        res.status(501).json({
          isSuccess: false,
          error: error
        });
        return;
      }
    });
  }
  connection.query(maxChallanNoQuery, (error, results, fields) => {
    last_challan_number = results;
    console.log("last_challan_number=" + JSON.stringify(last_challan_number));
    res.status(200).json({
      isSuccess: true,
      last_challan_number
    });
  });
});

module.exports = router;
