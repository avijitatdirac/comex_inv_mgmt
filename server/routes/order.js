const express = require("express");
const router = express.Router();
const connection = require("../connection");

router.post("/order_create", (req, res) => {
  var jsonData = req.body.data;
  var data = JSON.parse(jsonData);
  // console.log(req.query)
  var i;
  // inserts data into order master
  var qInsertOrderMaster = `insert into order_master
              (order_date,customer_id,total_amount,challan_number, customer_location_id,
                  parent_challan_id, uea_number, po, po_reference, cn_number, delivery_person_name, comment)
              values
              (?,?,?,last_insert_id()+1,?,?,?,?,?,?,?,?)`;

  // insert cart item details into order details
  var qInsertOrderDetails = `insert into order_detail
          (order_id,asset_id, rental_begin_date, rental_end_date, daily_unit_price, current_procurement_price,
              total_unit_price, gst_value, total_value, status)
          values((select max(ID) from order_master),?,?,?,?,?,?,?,?,1)`;

  var orderDate = data.orderDate;
  var customerId = data.customerId;
  var totalAmount = data.totalAmount;
  var customerLocationId = data.customerLocationId;
  var parentChallanId = data.parentChallanId;
  var ueaNumber = data.ueaNumber;
  var po = data.po;
  var poReference = data.poReference;
  var cnNumber = data.cnNumber;
  var deliveryPersonName = data.deliveryPersonName;
  var comment = data.comment;
  var cartAssetDetails = data.cartAssetDetails;
  var last_challan_number = "";

  // console.log('\n***CArt:', cartAssetDetails)

  connection.beginTransaction(function(err) {
    if (err) {
      throw err;
    }
    connection.query(
      qInsertOrderMaster,
      [
        orderDate,
        customerId,
        totalAmount,
        customerLocationId,
        parentChallanId,
        ueaNumber,
        po,
        poReference,
        cnNumber,
        deliveryPersonName,
        comment
      ],
      (error, results, fields) => {
        if (error) {
          res.status(501).json({
            isSuccess: false,
            error: error
          });
          return connection.rollback();
          return;
          //check1
        } else {
          // console.log(cartAssetDetails[0].assetId)
          //order_id,asset_id,serial_number,rental_period,unit_price,gst_value,total_value
          for (i = 0; i < cartAssetDetails.length; i++) {
            // console.log('cart asset: ', cartAssetDetails[i].assetId)
            connection.query(
              qInsertOrderDetails,
              [
                cartAssetDetails[i].assetId,
                cartAssetDetails[i].rentalBeginDate,
                cartAssetDetails[i].rentalEndDate,
                cartAssetDetails[i].dailyUnitPrice,
                cartAssetDetails[i].currentProcurementPrice,
                cartAssetDetails[i].totalUnitPrice,
                cartAssetDetails[i].gstValue,
                cartAssetDetails[i].totalValue,
                cartAssetDetails[i].status
              ],
              (errro, results, fields) => {
                // console.log('erf: ', error,results,fields)
                if (error) {
                  // return connection.rollback();

                  return connection.rollback();
                  return;
                }
                //console.log(cartAssetDetails[i].assetId,cartAssetDetails[i].serialNo,cartAssetDetails[i].unitPrice,cartAssetDetails[i].gst,cartAssetDetails[i].totalPrice)
              }
            );
          }
        }
      }
    );
    connection.commit(function(err) {
      if (err) {
        res.status(501).json({
          isSuccess: false,
          error: error
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

router.post("/get_customer_order_details", (req, res) => {
  // input cutomer_id

  // 1. fetch entries from order master based on the id
  // 2. from fk location_id fetch the corresponding locations
  // 3. fetch the details form order detail on the basis of order_id

  var qry = `select a.*,b.*,c.*,d.*,e.*,f.type_name from order_master a,order_detail b,customer c,customer_location_master d,asset e,asset_types f
          where a.customer_id=c.Customer_Id and a.customer_location_id=d.CID and a.ID=b.order_id and b.asset_id=e.id and e.asset_type_id=f.id and a.customer_id=? and b.status=1`;
  var customer_id = req.body.customer_id;
  connection.query(qry, [customer_id], (error, results, fields) => {
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

router.post("/get_customer_assets_for_addassetpage", (req, res) => {
  var qry1 = `select a.*,b.*,c.serial_no from order_master a,order_detail b,asset c where a.ID=b.order_id and c.id = b.asset_id`;

  connection.query(qry1, (error, results, fields) => {
    if (error) {
      res.status(501).json({
        isSuccess: false,
        error: error
      });
      return;
    } else {
    }

    res.status(200).json({
      isSuccess: true,
      results: results
    });
  });
});

module.exports = router;
