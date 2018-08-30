const express = require("express");
const router = express.Router();
const connection = require("../connection");
const { queryDatabaseWithPromise } = require("./utility");

router.post("/get_asset_config", (req, res) => {
  const qry1 =
    "select b.*,a.serial_no from asset a,asset_config b where a.id=b.asset_id and b.status=1 order by b.id";
  const qry2 =
    "select a.serial_no from asset a,asset_config b where a.id=b.child_asset_id and b.status=1 order by b.id";

  let allPromises = [];
  const p1 = queryDatabaseWithPromise(connection, qry1, []);
  allPromises.push(p1);
  const p2 = queryDatabaseWithPromise(connection, qry2, []);
  allPromises.push(p2);

  Promise.all(allPromises)
    .then(data => {
      res.status(200).json({
        asset_config_id: data[0],
        asset_config_child: data[1]
      });
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ error: err, isSuccess: false });
    });

  // connection.query(qry1, (error, results, fields) => {
  //   if (error) {
  //     res.status(501).json({
  //       isSuccess: false,
  //       error: error
  //     });
  //     return;
  //   } else {
  //     x = results;
  //     connection.query(qry2, (error, results, fields) => {
  //       res.json({
  //         asset_config_id: x,
  //         asset_config_child: results
  //       });
  //     });
  //   }
  // });
});

router.post("/change_config_table", (req, res) => {
  const asset_id = req.body.asset_id;
  const child_asset_id = req.body.child_asset_id;

  const qry = `insert into asset_config
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
  const qry = `insert into asset_config
          (asset_id,child_asset_id,create_timestamp,update_timestamp,parent_asset_id,status)
          values
          (?,?,null,null,null,1)`;

  const jsonData = JSON.parse(req.body.data);
  let allPromises = [];
  jsonData.forEach(element => {
    if (element.parentId >= 0) {
      const asset_id = jsonData[element.parentId].assetId;
      const child_asset_id = element.assetId;
      const p = queryDatabaseWithPromise(connection, qry, [
        child_asset_id,
        asset_id
      ]);
      allPromises.push(p);
    }
  });

  Promise.all(allPromises)
    .then(data => {
      res.status(200).json({ isSuccess: true });
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ error: err, isSuccess: false });
    });

  // connection.beginTransaction(function(err) {
  //   if (err) {
  //     throw err;
  //   }
  //   for (i = 0; i < jsonData.length; i++) {
  //     if (jsonData[i].parentId >= 0) {
  //       //console.log(jsonData[i])
  //       asset_id = jsonData[jsonData[i].parentId].assetId;
  //       child_asset_id = jsonData[i].assetId;
  //       connection.query(
  //         qry,
  //         [child_asset_id, asset_id],
  //         (error, results, response) => {
  //           if (error) {
  //             res.status(501).json({
  //               error: error
  //             });
  //             return connection.rollback();
  //             return;
  //           }
  //         }
  //       );
  //     }
  //   }
  //   connection.commit(function(err) {
  //     if (err) {
  //       return connection.rollback();
  //     } else {
  //       res.status(200).json({
  //         isSuccess: true
  //       });
  //     }
  //   });
  // });
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
