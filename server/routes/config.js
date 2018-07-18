const express = require("express");
const router = express.Router();
const connection = require("../connection");

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

router.post("/change_config_table", (req, res) => {
  var asset_id = req.body.asset_id;
  var child_asset_id = req.body.child_asset_id;

  var qry = `insert into asset_config
        (asset_id,child_asset_id,create_timestamp,update_timestamp,parent_asset_id,status)
        values
        (?,?,null,null,null,1)`;

  connection.query(
    qry,
    [asset_id, child_asset_id],
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

router.post("/change_config_table_on_add", (req, res) => {
  var qry = `insert into asset_config
          (asset_id,child_asset_id,create_timestamp,update_timestamp,parent_asset_id,status)
          values
          (?,?,null,null,null,1)`;

  var data = req.body.data;
  var jsonData = JSON.parse(data);
  var i;
  var asset_id, child_asset_id;
  connection.beginTransaction(function(err) {
    if (err) {
      throw err;
    }
    for (i = 0; i < jsonData.length; i++) {
      if (jsonData[i].parentId >= 0) {
        //console.log(jsonData[i])
        asset_id = jsonData[jsonData[i].parentId].assetId;
        child_asset_id = jsonData[i].assetId;
        connection.query(
          qry,
          [child_asset_id, asset_id],
          (error, results, response) => {
            if (error) {
              res.status(501).json({
                error: error
              });
              return connection.rollback();
              return;
            }
          }
        );
      }
    }
    connection.commit(function(err) {
      if (err) {
        return connection.rollback();
      } else {
        res.status(200).json({
          isSuccess: true
        });
      }
    });
  });
});

router.post("/change_config_table_on_delete", (req, res) => {
  // var qry1="select id from asset where serial_no=?"
  var qry =
    "insert into asset_config(asset_id,child_asset_id,create_timestamp,update_timestamp,parent_asset_id,status) values((select id from asset where serial_no=?),null,null,null,?,0)";
  var serial_no = req.body.serial_no;
  var id = req.body.asset_id;
  connection.query(qry, [serial_no, id], (error, results, fields) => {
    if (error) {
      res.status(501).json({
        isSuccess: false,
        error: error
      });
      return;
    } else {
      res.status(200).json({
        isSuccess: true
      });
    }
  });
});

module.exports = router;
