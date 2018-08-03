//Enviourment configaration
require("dotenv").config();
const PORT = process.env.PORT || 5000;

// import all external modules
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const { resolve } = require("path");

// create express app
const app = express();
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: false }));
app.use(cookieParser());
app.use(morgan("common"));

// generate session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "__DUMMY_SESSION_KEY__",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: eval(process.env.COOKIE_MAX_AGE) }
  })
);

// import router modules
const auth = require("./authentication");
const login = require("./routes/login");
const cust = require("./routes/customer");
const asset = require("./routes/asset");
const assetConfig = require("./routes/config");
const order = require("./routes/order");
const challan = require("./routes/challan");
const branch = require("./routes/branch");
const user = require("./routes/user");
const organization = require("./routes/organization");
const roles = require("./routes/roles");
const vendor = require("./routes/vendor");

/**
 * serve all static files without any session authentication
 */
app.use(express.static("../build"));

/**
 * login router should be called without any session authentication
 * since session is created after login
 */
app.use("/login", login);

/**
 * authenticate all request to check if user has valid session
 */
app.use(auth);

/**
 * all router added after main authentication module
 * so that all API request made will be validated against
 * session information first in the main auth module
 */
app.use("/cust", cust);
app.use("/asset", asset);
app.use("/config", assetConfig);
app.use("/order", order);
app.use("/challan", challan);
app.use("/branch", branch);
app.use("/user", user);
app.use("/organization", organization);
app.use("/roles", roles);
app.use("/vendor", vendor);

/**
 *
 *
 * serve React's index.html file from build folder
 * browser request comes in for any url
 *
 *
 */

app.get("*", function(req, res) {
  let indexHtml = fs.readFileSync(resolve("../build/index.html"), "utf8");
  res.header("Content-Type", "text/html");
  res.status(200).send(indexHtml);
});

/**
 *
 * start the server on the given PORT
 *
 */
app.listen(PORT, () => console.log("server started on port " + PORT));

/**
 * handle uncaughtException to stop server from crashing.
 * NOTE: preety bad way of exception handling,
 * usually add some unnoticed bug in the application
 * should be removed if possible
 */
process.on("uncaughtException", err => {
  console.log("uncaughtException handler: ", err);
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

// app.get(`/get_customer_roles`, (req, res) => {
//   var qrGetRoles = "SELECT * FROM  customer_role";
//   connection.query(qrGetRoles, (error, results, fields) => {
//     if (error) {
//       res.status(503).json({
//         isSuccess: false,
//         error: error
//       });
//     } else
//       res.status(201).json({
//         isSuccess: true,
//         customerRoles: results
//       });
//   });
// });

// app.get(`/get_customer`, (req, res) => {
//   var id = req.query.id;
//   var qrGetCust = "SELECT * FROM  customer";
//   var qrGetCustLoc =
//     "SELECT cl.* FROM  customer as c, customer_location_master as cl where c.Customer_Id=cl.Customer_Id";
//   //"SELECT c.Customer_Id, CName, Previously_Known_As, Pan_No, Comments, id, Address, City, State, Pincode, GST_Value, Contact_Person, Contact_Number_1, Contact_Number_2, Email_1, Email_2, Is_Main, Is_Valid, SEZ FROM  customer as c, customer_location_master as cl where c.Customer_Id=cl.Customer_Id"
//   //var qry1="select a.Customer_Id,a.CName,a.Contact_No,a.Contact_person,a.Email,a.Address,a.Address1,a.Address2,a.City,a.State,a.Pincode,b.Account_Number,b.IFSC_Code,b.Bank_Name,b.Account_Name,b.GST_Details,b.HSN_Code,b.SAC_Code,c.Location as location_location,c.Contact_No as location_contact_no,c.Contact_person as location_contact_person,c.Email as location_email,c.Address as location_address,c.Address1 as location_address1,c.Address2 as location_address2,c.City as location_city,c.State as location_state,c.Pincode as location_pincode,c.Bill_To_Address as location_bill_to_address,c.Bill_To_Address1 as location_bill_to_address1,c.Bill_To_Address2 as location_bill_to_address2,c.Ship_To_Address as location_ship_to_address,c.Ship_To_Address1 as location_ship_to_address1,c.Ship_To_Address2 as location_ship_to_address2 from customer a,customer_financial b,customer_location_detail c where a.Customer_Id=? and a.Customer_Id=b.Customer_Detail_Id and a.Customer_Id=c.Customer_Id"
//   //if(!id)
//   //{
//   var location;
//   connection.query(qrGetCust, (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//     } else customerDetails = results;
//   });
//   connection.query(qrGetCustLoc, (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//     } else
//       res.status(201).json({
//         isSuccess: true,
//         customerDetails: customerDetails,
//         locationDetails: results
//       });
//   });
// });
// app.get(`/remove_asset_value`, (req, res) => {
//   var asset_id = req.query.asset_id;
//   var attribute_id = req.query.attribute_id;
//   var attribute_value = req.query.attribute_value;
//   var qry =
//     "update asset_details set attribute_value=concat(?,' ','removed') where asset_details.asset_id=? and asset_details.attribute_id=?";
//   connection.query(
//     qry,
//     [attribute_value, asset_id, attribute_id],
//     (error, results, fields) => {
//       if (error) {
//         res.status(501).json({
//           isSuccess: true,
//           error: error
//         });
//       } else {
//         res.status(200).json({
//           isError: false,
//           status: "success"
//         });
//       }
//     }
//   );
// });

// app.get(`/get_asset_status_count`, (req, res) => {
//   var qry1 =
//     "select b.id,b.type_name,count(*) as out_of_stock from asset a,asset_types b where status=0 and a.asset_type_id=b.id group by a.asset_type_id  order by b.id";
//   var qry2 =
//     "select b.id,b.type_name,count(*) as in_stock from asset a,asset_types b where status=1 and a.asset_type_id=b.id group by a.asset_type_id  order by b.id";
//   var qry3 =
//     "select b.id,b.type_name,count(*) as damaged from asset a,asset_types b where status=2 and a.asset_type_id=b.id group by a.asset_type_id  order by b.id";
//   var x, y;
//   connection.query(qry1, (error, results, fields) => {
//     x = results;
//   });
//   connection.query(qry2, (error, results, fields) => {
//     y = results;
//   });
//   connection.query(qry3, (error, results, fields) => {
//     res.status(200).json({
//       out_of_stock: x,
//       in_stock: y,
//       damaged: results
//     });
//   });
// });
// app.get(`/get_all_values`, (req, res) => {
//   var qry =
//     "select b.* from asset_types a,asset b where a.id=b.asset_type_id and a.type_name=?";
//   var x;
//   var type_name = req.query.type_name;
//   var qry1 =
//     "select d.asset_id,d.attribute_id,a.attr_name,d.attribute_value from asset_types_attributes" +
//     " a,asset_types b,asset c,asset_details d where b.id=a.asset_type_id and b.type_name=?" +
//     "and  c.asset_type_id=b.id and d.asset_id=c.id and d.attribute_id=a.id order by d.asset_id,d.attribute_id";
//   var hsnCodeQuery =
//     "select distinct b.hsnCode from asset_types a,asset b where a.id=b.asset_type_id and a.type_name=?";
//   connection.query(qry, [type_name], (error, results, fields) => {
//     if (error) {
//       res.status(200).json({
//         isSuccess: false,
//         error: error
//       });
//     } else {
//       x = results;
//     }
//   });
//   connection.query(hsnCodeQuery, [type_name], (error, results, fields) => {
//     if (error) {
//       res.status(200).json({
//         isSuccess: false,
//         error: error
//       });
//     } else {
//       hsn_result = results;
//     }
//   });
//   connection.query(qry1, [type_name], (error, results, fields) => {
//     res.status(201).json({
//       isSuccess: true,
//       dyna: results,
//       static: x,
//       hsnResult: hsn_result
//     });
//   });
// });
// app.get(`/get_all_modifiable_values`, (req, res) => {
//   var qry =
//     "select b.* from asset_types a,asset b where a.id=b.asset_type_id and a.type_name=?";
//   var x;
//   var type_name = req.query.type_name;
//   var qry1 =
//     "select d.asset_id,d.attribute_id,a.attr_name,d.attribute_value from asset_types_attributes a,asset_types b,asset c,asset_details d where b.id=a.asset_type_id and b.type_name=? and a.is_modifiable=1 and c.asset_type_id=b.id and d.asset_id=c.id and d.attribute_id=a.id order by d.asset_id,d.attribute_id";

//   connection.query(qry, [type_name], (error, results, fields) => {
//     if (error) {
//       res.status(200).json({
//         isSuccess: false,
//         error: error
//       });
//       return;
//     } else {
//       x = results;
//     }
//   });
//   connection.query(qry1, [type_name], (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: error
//       });
//       return;
//     } else {
//       res.status(201).json({
//         isSuccess: true,
//         dyna: results,
//         static: x
//       });
//     }
//   });
// });
// app.get(`/change_status_on_return2`, (req, res) => {
//   var qry = "update asset set status=? where id=?";

//   var i;
//   var data = req.query.data;
//   var jsonData = JSON.parse(data);
//   for (i = 0; i < jsonData.length; i++) {
//     var status = jsonData[i].status;
//     var id = jsonData[i].id;
//     connection.query(qry, [status, id]);
//   }
//   res.status(200).json({
//     isSuccess: true
//   });
// });
// app.get(`/get_asset_type_customer_name`, (req, res) => {
//   var qry =
//     "select distinct(d.CName), a.* from asset a,order_detail b,order_master c,customer d where a.asset_type_id=? and a.status=0 and a.id=b.asset_id and b.order_id=c.ID and d.Customer_Id=c.customer_id";
//   var asset_type_id = req.query.asset_type_id;
//   connection.query(qry, [asset_type_id], (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//     } else {
//       res.status(200).json({
//         isSuccess: true,
//         results: results
//       });
//     }
//   });
// });
// app.get(`/change_config_status`, (req, res) => {
//   // console.log(req.query)
//   var id = req.query.id;
//   var qry = "update asset_config set status=0 where id=?";
//   connection.query(qry, [id], (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//     } else {
//       res.status(200).json({
//         isSuccess: true
//       });
//     }
//   });
// });
// app.get(`/get_asset_config`, (req, res) => {
//   var qry1 =
//     "select b.*,a.serial_no from asset a,asset_config b where a.id=b.asset_id and b.status=1 order by b.id";
//   var qry2 =
//     "select a.serial_no from asset a,asset_config b where a.id=b.child_asset_id and b.status=1 order by b.id";
//   var x;
//   connection.query(qry1, (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//       return;
//     } else {
//       x = results;
//       connection.query(qry2, (error, results, fields) => {
//         res.json({
//           asset_config_id: x,
//           asset_config_child: results
//         });
//       });
//     }
//   });
// });
// app.get(`/in_damaged_stock`, (req, res) => {
//   var qry1 = "select * from asset where asset_type_id=? and status=?";
//   var status = req.query.status;
//   var id = req.query.id;
//   connection.query(qry1, [id, status], (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//     } else {
//       res.status(200).json({
//         isSuccess: true,
//         results: results
//       });
//     }
//   });
// });
// app.get(`/damaged_assets`, (req, res) => {
//   var qry = "select * from asset";
//   connection.query(qry, (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//     } else {
//       res.status(200).json({
//         isSuccess: true,
//         results: results
//       });
//     }
//   });
// });
// app.get(`/return_from_repair`, (req, res) => {
//   var qry = "update asset set status=1 where id=?";
//   var id = req.query.id;
//   connection.query(qry, [id], (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//     } else {
//       res.status(200).json({
//         isSuccess: true
//       });
//     }
//   });
// });
// app.get(`/send_for_repair`, (req, res) => {
//   var qry =
//     "update asset set status=2, comments=concat(coalesce(comments, ''),' ',?)  where id=?";
//   var id = req.query.id;
//   var comments = req.query.comments;
//   connection.query(qry, [comments, id], (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//     } else {
//       res.status(200).json({
//         isSuccess: true
//       });
//     }
//   });
// });
// app.get(`/get_customer_order_details2`, (req, res) => {
//   var qry =
//     "SELECT a.make,b.* from asset a,order_detail b,order_master c where b.order_id=c.id and c.ID=? and a.status=0 and c.customer_id=? and b.serial_number=a.serial_no";
//   var customer_id = req.query.customer_id;
//   var challan_number = req.query.challan_number;
//   connection.query(
//     qry,
//     [challan_number, customer_id],
//     (error, results, fields) => {
//       if (error) {
//         res.status(501).json({
//           isSuccess: false,
//           error: error
//         });
//       } else {
//         res.status(200).json({
//           isSuccess: true,
//           results: results
//         });
//       }
//     }
//   );
// });
// app.post(`/change_config_table_on_add`, (req, res) => {
//   var qry = `insert into asset_config
//         (asset_id,child_asset_id,create_timestamp,update_timestamp,parent_asset_id,status)
//         values
//         (?,?,null,null,null,1)`;
//   //var asset_id=req.query.asset_id
//   //var child_asset_id=req.query.child_asset_id
//   var data = req.query.data;
//   var jsonData = JSON.parse(data);
//   var i;
//   var asset_id, child_asset_id;
//   connection.beginTransaction(function(err) {
//     if (err) {
//       throw err;
//     }
//     for (i = 0; i < jsonData.length; i++) {
//       if (jsonData[i].parentId >= 0) {
//         //console.log(jsonData[i])
//         asset_id = jsonData[jsonData[i].parentId].assetId;
//         child_asset_id = jsonData[i].assetId;
//         connection.query(
//           qry,
//           [child_asset_id, asset_id],
//           (error, results, response) => {
//             if (error) {
//               res.status(501).json({
//                 error: error
//               });
//               return connection.rollback();
//               return;
//             }
//           }
//         );
//       }
//     }
//     connection.commit(function(err) {
//       if (err) {
//         return connection.rollback();
//       } else {
//         res.status(200).json({
//           isSuccess: true
//         });
//       }
//     });
//   });
// });
// app.post(`/order_create`, (req, res) => {
//   var jsonData = req.query.data;
//   var data = JSON.parse(jsonData);
//   // console.log(req.query)
//   var i;
//   // inserts data into order master
//   var qInsertOrderMaster = `insert into order_master
//             (order_date,customer_id,total_amount,challan_number, customer_location_id,
//                 parent_challan_id, uea_number, po, po_reference, cn_number, delivery_person_name, comment)
//             values
//             (?,?,?,last_insert_id()+1,?,?,?,?,?,?,?,?)`;

//   // insert cart item details into order details
//   var qInsertOrderDetails = `insert into order_detail
//         (order_id,asset_id, rental_begin_date, rental_end_date, daily_unit_price, current_procurement_price,
//             total_unit_price, gst_value, total_value, status)
//         values((select max(ID) from order_master),?,?,?,?,?,?,?,?,1)`;

//   var orderDate = data.orderDate;
//   var customerId = data.customerId;
//   var totalAmount = data.totalAmount;
//   var customerLocationId = data.customerLocationId;
//   var parentChallanId = data.parentChallanId;
//   var ueaNumber = data.ueaNumber;
//   var po = data.po;
//   var poReference = data.poReference;
//   var cnNumber = data.cnNumber;
//   var deliveryPersonName = data.deliveryPersonName;
//   var comment = data.comment;
//   var cartAssetDetails = data.cartAssetDetails;
//   var last_challan_number = "";

//   // console.log('\n***CArt:', cartAssetDetails)

//   connection.beginTransaction(function(err) {
//     if (err) {
//       throw err;
//     }
//     connection.query(
//       qInsertOrderMaster,
//       [
//         orderDate,
//         customerId,
//         totalAmount,
//         customerLocationId,
//         parentChallanId,
//         ueaNumber,
//         po,
//         poReference,
//         cnNumber,
//         deliveryPersonName,
//         comment
//       ],
//       (error, results, fields) => {
//         if (error) {
//           res.status(501).json({
//             isSuccess: false,
//             error: error
//           });
//           return connection.rollback();
//           return;
//           //check1
//         } else {
//           // console.log(cartAssetDetails[0].assetId)
//           //order_id,asset_id,serial_number,rental_period,unit_price,gst_value,total_value
//           for (i = 0; i < cartAssetDetails.length; i++) {
//             // console.log('cart asset: ', cartAssetDetails[i].assetId)
//             connection.query(
//               qInsertOrderDetails,
//               [
//                 cartAssetDetails[i].assetId,
//                 cartAssetDetails[i].rentalBeginDate,
//                 cartAssetDetails[i].rentalEndDate,
//                 cartAssetDetails[i].dailyUnitPrice,
//                 cartAssetDetails[i].currentProcurementPrice,
//                 cartAssetDetails[i].totalUnitPrice,
//                 cartAssetDetails[i].gstValue,
//                 cartAssetDetails[i].totalValue,
//                 cartAssetDetails[i].status
//               ],
//               (errro, results, fields) => {
//                 // console.log('erf: ', error,results,fields)
//                 if (error) {
//                   // return connection.rollback();

//                   return connection.rollback();
//                   return;
//                 }
//                 //console.log(cartAssetDetails[i].assetId,cartAssetDetails[i].serialNo,cartAssetDetails[i].unitPrice,cartAssetDetails[i].gst,cartAssetDetails[i].totalPrice)
//               }
//             );
//           }
//         }
//       }
//     );
//     connection.commit(function(err) {
//       if (err) {
//         res.status(501).json({
//           isSuccess: false,
//           error: error
//         });
//         return connection.rollback();
//       } else {
//         res.status(200).json({
//           isSuccess: true
//         });
//       }
//     });
//   });
// });

// app.post(`/change_config_table_on_delete`, (req, res) => {
//   // var qry1="select id from asset where serial_no=?"
//   var qry =
//     "insert into asset_config(asset_id,child_asset_id,create_timestamp,update_timestamp,parent_asset_id,status) values((select id from asset where serial_no=?),null,null,null,?,0)";
//   var serial_no = req.query.serial_no;
//   var id = req.query.asset_id;
//   connection.query(qry, [serial_no, id], (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//       return;
//     } else {
//       res.status(200).json({
//         isSuccess: true
//       });
//     }
//   });
// });

// app.post(`/insert_asset_value`, (req, res) => {
//   var i;
//   var typeName = req.query.type_name;
//   var static = JSON.parse(req.query.static);
//   var dynamic = JSON.parse(req.query.dynamic);
//   //change_config_table
//   var qryAsset =
//     "insert into asset(asset_type_id, serial_no, purchase_date, purchase_price, supplier, warehouse_location, procurement_date, status, create_timestamp, update_timestamp, part_code, make, warranty_end_date, transfer_order_no, comments, supplier_invoice, supplier_date, branch, transfer_order_date,hsnCode) values ((select id from asset_types where type_name=?),?,?,?,?,?,?,?,null,null,?,?,?,?,?,?,?,?,?,?)";

//   var qryAssetDetails =
//     "insert into asset_details(asset_id,attribute_id,attribute_value,create_timestamp,update_timestamp) values ((select id from asset where serial_no=?),?,?,null,null)";

//   connection.beginTransaction(function(err) {
//     if (err) {
//       throw err;
//     }
//     connection.query(
//       qryAsset,
//       [
//         typeName,
//         static.serialNo,
//         static.purchaseDate,
//         static.purchasePrice,
//         static.supplier,
//         static.warehouseLocation,
//         static.procurementDate,
//         static.status,
//         static.partCode,
//         static.make,
//         static.warrantyEndDate,
//         static.transferOrder,
//         static.comment,
//         static.supplierInvoiceNo,
//         static.supplierInvoiceDate,
//         static.branch,
//         static.transferOrderDate,
//         static.hsnCode
//       ],
//       (error, results, fields) => {
//         if (error) {
//           // console.log('query 1 fail')
//           res.status(501).json({
//             isSuccess: false,
//             error: error
//           });
//           return connection.rollback();
//           //return;
//         } else {
//           for (i = 0; i < dynamic.length; i++) {
//             // console.log('query 2')
//             connection.query(
//               qryAssetDetails,
//               [static.serialNo, dynamic[i].id, dynamic[i].value],
//               (error, results, fields) => {
//                 if (error) {
//                   res.status(501).json({
//                     isSuccess: false,
//                     error: error
//                   });
//                   return connection.rollback();
//                   return;
//                 }
//               }
//             );
//           }
//           res.status(200).json({
//             isSuccess: true
//           });
//         }
//       }
//     );

//     connection.commit(function(err) {
//       if (err) {
//         return connection.rollback();
//       }
//     });
//   });
// });
// app.get("/change_inventory_status", (req, res) => {
//   var i;
//   var qry = "update asset set status=0 where id=? ";
//   var maxChallanNoQuery = `select max(challan_number) last_challan from order_master`;
//   var last_challan_number = "";

//   var check = JSON.parse(req.query.data);
//   //console.log(check)
//   // console.log(req.query)
//   for (i = 0; i < check.length; i++) {
//     connection.query(qry, [check[i]], (error, results, fields) => {
//       if (error) {
//         res.status(501).json({
//           isSuccess: false,
//           error: error
//         });
//         return;
//       }
//     });
//   }
//   connection.query(maxChallanNoQuery, (error, results, fields) => {
//     last_challan_number = results;
//     console.log("last_challan_number=" + JSON.stringify(last_challan_number));
//     res.status(200).json({
//       isSuccess: true,
//       last_challan_number
//     });
//   });
// });

// app.post(`/insert_asset_type`, (req, res) => {
//   var type_name = req.query.type_name;
//   var attributes = req.query.attributes;
//   var jsonData = JSON.parse(attributes);
//   var length = jsonData.length;
//   var i;
//   var qry =
//     "insert into asset_types(type_name,is_active,create_timestamp,update_timestamp) values (?,true,null,null)";
//   var qry2 = `insert into asset_types_attributes(asset_type_id,attr_name,is_modifiable,is_mandatory,is_active,create_timestamp,update_timestamp,is_printable) values ((select id from asset_types where id=(SELECT MAX(id) from asset_types)),?,?,?,true,null,null,?)`;
//   connection.beginTransaction(function(err) {
//     if (err) {
//       throw err;
//     }
//     //check1
//     connection.query(qry, [type_name], (error, results, fields) => {
//       if (!error) {
//         res.status(200).json({
//           results: "success"
//         });
//         for (i = 0; i < length; i++) {
//           connection.query(qry2, [
//             jsonData[i].name,
//             jsonData[i].isMandatory,
//             jsonData[i].isModifiable,
//             jsonData[i].isPrintable
//           ]);
//         }
//       } else {
//         if (error) {
//           if (error.errno === 1062) {
//             res.status(501).json({
//               is_Error: true
//             });
//           }
//           return connection.rollback();
//           return;
//         }
//       }
//     });
//     connection.commit(function(err) {
//       if (err) {
//         return connection.rollback();
//       }
//     });
//   });
// });

// API to insert more attributes into existing asset-type
// usage /modify_asset_type?type_name=[type name]&attributes=[new attributes]
// app.post(`/modify_asset_type`, (req, res) => {
//   var type_name = req.query.type_name;
//   var attributes = req.query.attributes;
//   var jsonData = JSON.parse(attributes);
//   var length = jsonData.length;

//   // for false insertion
//   var assetIds = [];
//   var insAttribId = "";

//   // console.log('type_name:', type_name)
//   var qry = `insert into asset_types_attributes(asset_type_id,attr_name,is_modifiable,is_mandatory,is_active,create_timestamp,update_timestamp,is_printable) values ((select id from asset_types where type_name = ?),?,?,?,true,null,null,?)`;

//   // fetch all the asset ids for which modification is required
//   var qGetAssetIds = `SELECT id FROM asset where asset_type_id = (select id from asset_types where type_name = ?)`;

//   // get the newly inserted attribute-id
//   var qGetAttribId = `SELECT max(id) as attribute_id FROM asset_types_attributes`;

//   // insert null data into the newly inserted attribute field of all assets with the changed asset-type
//   var qInsertAssetDetails = `insert into asset_details (asset_id, attribute_id, attribute_value) values (?,?,?)`;

//   connection.beginTransaction(function(err) {
//     if (err) {
//       throw err;
//     }

//     // insert new attributes
//     for (var i = 0; i < length; i++) {
//       connection.query(qry, [
//         type_name,
//         jsonData[i].name,
//         jsonData[i].isMandatory,
//         jsonData[i].isModifiable,
//         jsonData[i].isPrintable
//       ]);
//       // console.log(`insert into asset_types_attributes(asset_type_id,attr_name,is_modifiable,is_mandatory,is_active,create_timestamp,update_timestamp) values ((select id from asset_types where type_name = ${type_name}),${jsonData[i].name},${jsonData[i].isMandatory},${jsonData[i].isModifiable},true,null,null)`)
//       // insert here

//       // getting attribute id
//       connection.query(qGetAttribId, (error, results, fields) => {
//         if (!error) {
//           insAttribId = results[0].attribute_id;
//         } else {
//           res.status(200).json({
//             results: error
//           });
//         }
//       });
//       // getting asset ids
//       connection.query(qGetAssetIds, [type_name], (error, results, fields) => {
//         if (!error) {
//           // query success, we obtained the asset id fields

//           assetIds = results;
//           assetIds.forEach(element => {
//             // insert black attribute for each asset in this asset-type
//             connection.query(qInsertAssetDetails, [
//               element.id,
//               insAttribId,
//               ""
//             ]);
//           });
//         } else {
//           res.status(200).json({
//             results: error
//           });
//         }
//       });
//     }

//     connection.commit(function(err) {
//       if (err) {
//         res.status(501).json({
//           isSuccess: "false"
//         });
//         return connection.rollback();
//       } else if (!err) {
//         res.status(200).json({
//           isSuccess: "true"
//         });
//       }
//     });
//   });
// });

// app.get(`/get_asset`, (req, res) => {
//   var qry = "select id,type_name from asset_types";
//   connection.query(qry, (error, results, fields) => {
//     if (!error) {
//       res.status(200).json({
//         results: results
//       });
//     } else {
//       res.status(200).json({
//         results: error
//       });
//     }
//   });
// });

// app.get(`/get_asset_type`, (req, res) => {
//   var type_name = req.query.type_name;
//   var qry =
//     "select id,asset_type_id,attr_name,is_modifiable,is_mandatory,is_printable from asset_types_attributes where asset_type_id=(select id from asset_types where type_name=?)";
//   connection.query(qry, [type_name], (error, results, fields) => {
//     res.status(200).json({
//       results: results
//     });
//   });
// });
// app.get(`/get_asset_config_on_id`, (req, res) => {
//   var id = req.query.id;
//   var qry =
//     "select a.make,a.serial_no,b.* from asset a,asset_config b where a.id=b.asset_id and b.asset_id=?";
//   connection.query(qry, [id], (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         error: error,
//         isSuccess: false
//       });
//     } else {
//       res.status(200).json({
//         results: results,
//         isSuccess: true
//       });
//     }
//   });
// });
// app.get(`/insert_customer2`, (req, res) => {
//   var qry =
//     "insert into customer(CName,Contact_No,Contact_person,Email,Address,Address1,Address2,City,State,Pincode,created_date,updated_date) values(?,?,?,?,?,?,?,?,?,?,null,null)";
//   //var qry1="select Customer_Id from im_customer where im_customer_Id=(SELECT MAX(Customer_Id) from im_customer)"
//   var qry2 = `insert into customer_financial(Customer_Detail_Id,Account_Number,IFSC_Code,Bank_Name,Account_Name,GST_Details,HSN_Code,SAC_Code,created_date,updated_date) values ((select Customer_Id from customer where Customer_Id=(SELECT MAX(Customer_Id) from customer)),?,?,?,?,?,?,?,null,null)`;
//   var qry3 = `insert into customer_location_detail(Customer_Id,Location,Contact_No,Contact_person,Email,Address,Address1,Address2,City,State,Pincode,Bill_To_Address,Bill_To_Address1,Bill_To_Address2,Ship_To_Address,Ship_To_Address1,Ship_To_Address2,created_date,updated_date) values((select Customer_Id from customer where Customer_Id=(SELECT MAX(Customer_Id) from customer)),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,null,null)`;
//   var cname = req.query.CName;
//   var contact_no = req.query.Contact_No;
//   var contact_person = req.query.Contact_person;
//   var email = req.query.Email;
//   var address = req.query.Address;
//   var address1 = req.query.Address1;
//   var address2 = req.query.Address2;
//   var city = req.query.City;
//   var state = req.query.State;
//   var pincode = req.query.Pincode;
//   var account_Number = req.query.accountNumber;
//   var iFSC_Code = req.query.ifscCode;
//   var bank_Name = req.query.bankName;
//   var account_Name = req.query.accountName;
//   var gST_Details = req.query.gstDetails;
//   var hSN_Code = req.query.hsnCode;
//   var sAC_Code = req.query.sacCode;
//   var location = req.query.location;
//   var bill_To_Address = req.query.billToAddress;
//   var bill_To_Address1 = req.query.billToAddress1;
//   var bill_To_Address2 = req.query.billToAddress2;
//   var ship_To_Address = req.query.shipToAddress;
//   var ship_To_Address1 = req.query.shipToAddress1;
//   var ship_To_Address2 = req.query.shipToAddress2;
//   connection.beginTransaction(function(err) {
//     if (err) {
//       throw err;
//     }
//     connection.query(
//       qry,
//       [
//         cname,
//         contact_no,
//         contact_person,
//         email,
//         address,
//         address1,
//         address2,
//         city,
//         state,
//         pincode
//       ],
//       (error, results, fields) => {
//         if (error) {
//           if (error.errno === 1062) {
//             res.json({ isError: true, message: "Email id already Exists" });
//             return;
//           }
//         } else {
//           res.status(200).json({ isError: false });
//           connection.query(qry2, [
//             account_Number,
//             iFSC_Code,
//             bank_Name,
//             account_Name,
//             gST_Details,
//             hSN_Code,
//             sAC_Code
//           ]);
//           connection.query(qry3, [
//             location,
//             contact_no,
//             contact_person,
//             email,
//             address,
//             address1,
//             address2,
//             city,
//             state,
//             pincode,
//             bill_To_Address,
//             bill_To_Address1,
//             bill_To_Address2,
//             ship_To_Address,
//             ship_To_Address1,
//             ship_To_Address2
//           ]);
//         }
//       }
//     );
//     connection.commit(function(err) {
//       if (err) {
//         return connection.rollback();
//       }
//     });
//   });
// });

// app.get("/", (req, res) => {
//   res.send("Created by Avilash, Meghnad, Ritaraj");
// });
// app.get(`/get_all`, (req, res) => {
//   var qry = "select * from Customer";
//   connection.query(qry, (error, results, fields) => {
//     if (error) {
//       res.status(503).json({
//         message: error,
//         isError: "true"
//       });
//     }

//     if (results && results.length > 0) {
//       var cname = results[0].CName;
//       response.status(200).json({
//         message: "success",
//         cname: cname
//       });
//     }
//   });
// });

// app.post(`/insert_customer`, (req, res) => {
//   // get all data from request
//   var customer_name = req.query.customer_name;
//   //var city          = req.query.city
//   //var state         = req.query.state
//   var cin_number = req.query.cin;
//   var pan_number = req.query.pan_number;
//   var comments = req.query.comments;

//   // get address (dynamic)

//   var address = req.query.address;
//   var jsonData = JSON.parse(address);
//   var length = jsonData.length;

//   // define sql queries

//   var qrInsCustStatic =
//     "insert into customer (CName, updated_date, created_date, Previously_Known_As, Pan_No, Comments,CIN) values(?,null,null,null,?,?,?)";

//   var qrInsCustDynamic = `
//     insert into customer_location_master (
//         Customer_Id,Address,GST_Value,
//         Contact_Person_1,Contact_Number_1,Email_1, Contact_Person_1_Valid,Contact_Person_1_role,
//         Contact_Person_2,Contact_Number_2,Email_2, Contact_Person_2_Valid,Contact_Person_2_role,
//         Contact_Person_3,Contact_Number_3,Email_3, Contact_Person_3_Valid,Contact_Person_3_role,
//         Contact_Person_4,Contact_Number_4,Email_4, Contact_Person_4_Valid,Contact_Person_4_role,
//         Is_Main,Is_Valid,created_date,updated_date,SEZ,City,State,Pincode)
//     values
//     ((SELECT max(Customer_Id) FROM customer),?,?,
//     ?,?,?,1,?,
//     ?,?,?,1,?,
//     ?,?,?,1,?,
//     ?,?,?,1,?,
//     ?,1,null,null,?,?,?,?)`;
//   // start transaction
//   connection.beginTransaction(function(err) {
//     if (err) {
//       throw err;
//     }

//     // running first query (static data)
//     connection.query(
//       qrInsCustStatic,
//       [customer_name, pan_number, comments, cin_number],
//       (error, results, fields) => {
//         if (!error) {
//           // running second query (dynamic) for each address
//           for (i = 0; i < length; i++) {
//             connection.query(
//               qrInsCustDynamic,
//               [
//                 jsonData[i].Address,
//                 jsonData[i].GSTValue,

//                 jsonData[i].ContactPerson1,
//                 jsonData[i].ContactNumber1,
//                 jsonData[i].Email1,
//                 jsonData[i].ContactRole1,

//                 jsonData[i].ContactPerson2,
//                 jsonData[i].ContactNumber2,
//                 jsonData[i].Email2,
//                 jsonData[i].ContactRole2,

//                 jsonData[i].ContactPerson3,
//                 jsonData[i].ContactNumber3,
//                 jsonData[i].Email3,
//                 jsonData[i].ContactRole3,

//                 jsonData[i].ContactPerson4,
//                 jsonData[i].ContactNumber4,
//                 jsonData[i].Email4,
//                 jsonData[i].ContactRole4,

//                 jsonData[i].isMain,
//                 jsonData[i].SEZ,
//                 jsonData[i].City,
//                 jsonData[i].State,
//                 jsonData[i].Pincode
//               ],
//               (error, results, fields) => {
//                 if (error) {
//                   return connection.rollback();
//                   return;
//                 }
//               }
//             );
//           }
//         } else {
//           if (error) {
//             return connection.rollback();
//             return;
//           }
//         }
//       }
//     );
//     connection.commit(function(err) {
//       if (err) {
//         res.status(501).json({
//           isSuccess: false,
//           results: "failure"
//         });
//         return connection.rollback();
//       } else {
//         res.status(200).json({
//           isSuccess: true,
//           results: "success"
//         });
//       }
//     });
//   });
// });
// // customer modification API
// app.get(`/modify_customer`, (req, res) => {
//     var asset_id = req.query.asset_id
//     var attribute_id = req.query.attribute_id
//     var attribute_value = req.query.attribute_value
//     var qry = "update customer set attribute_value=concat(?,' ','removed') where asset_details.asset_id=? and asset_details.attribute_id=?"
//     connection.query(qry, [attribute_value, asset_id, attribute_id], (error, results, fields) => {

//         if (error) {
//             res.status(501).json({
//                 isSuccess: true,
//                 error: error
//             })
//         }
//         else {
//             res.status(200).json({
//                 isError: false,
//                 status: 'success'
//             })
//         }
//     }
//     )
// })

// app.post(`/modify_customer`, (req, res) => {
//   // get all data from request
//   var customerId = req.query.customerId;
//   var customer_name = req.query.customer_name;
//   var comments = req.query.comments;
//   var prevName = "";
//   // get address (dynamic)

//   var address = req.query.address;
//   var jsonData = JSON.parse(address);
//   var length = jsonData.length;

//   // console.log('jsondata: ',jsonData)

//   // console.log('request is: ',req.query)
//   // define sql queries
//   // update customer set CName = 'Ritu 3', updated_date = null, Previously_Known_As = concat(Previously_Known_As, 'name'), Comments=concat(Comments,'comment 2') where Customer_Id=2
//   var qrGetPrevName = "select CName from customer where Customer_Id = ?";
//   var qrUpdateCust = `update customer set
//             CName = ?,
//             updated_date = null,
//             Previously_Known_As =?,
//             Comments=concat(coalesce(Comments, ''),' ',?)
//                 where Customer_Id=?`;

//   var qrUpdateCustDynamic = `update customer_location_master set
//             GST_Value=?,
//             Contact_Person_1=?,
//             Contact_Number_1=?,
//             Email_1=?,
//             Contact_Person_1_Valid = ?,

//             Contact_Person_2=?,
//             Contact_Number_2=?,
//             Email_2=?,
//             Contact_Person_2_Valid = ?,

//             Contact_Person_3=?,
//             Contact_Number_3=?,
//             Email_3=?,
//             Contact_Person_3_Valid = ?,

//             Contact_Person_4=?,
//             Contact_Number_4=?,
//             Email_4=?,
//             Contact_Person_4_Valid = ?,
//             Is_Main=?,
//             Is_Valid=?,
//             updated_date=null,
//             SEZ=?
//                 where CID=?`;
//   var prevName = null;
//   // start transaction
//   connection.beginTransaction(function(err) {
//     if (err) {
//       throw err;
//     }

//     // first get customer id
//     connection.query(qrGetPrevName, [customerId], (error, results, fields) => {
//       // name retrieval successful
//       if (!error) {
//         if (
//           results &&
//           results.length > 0 &&
//           results[0].CName !== customer_name
//         ) {
//           prevName = results[0].CName;
//         }
//         // update the customer
//         connection.query(
//           qrUpdateCust,
//           [customer_name, prevName, comments, customerId],
//           (error, results, fields) => {
//             // customer updation successful
//             if (!error) {
//               // running second query (dynamic) for each address
//               for (var i = 0; i < jsonData.length; i++) {
//                 connection.query(
//                   qrUpdateCustDynamic,
//                   [
//                     jsonData[i].GST_Value,
//                     jsonData[i].Contact_Person_1,
//                     jsonData[i].Contact_Number_1,
//                     jsonData[i].Email_1,
//                     jsonData[i].Contact_Person_1_Valid,

//                     jsonData[i].Contact_Person_2,
//                     jsonData[i].Contact_Number_2,
//                     jsonData[i].Email_2,
//                     jsonData[i].Contact_Person_2_Valid,

//                     jsonData[i].Contact_Person_3,
//                     jsonData[i].Contact_Number_3,
//                     jsonData[i].Email_3,
//                     jsonData[i].Contact_Person_3_Valid,

//                     jsonData[i].Contact_Person_4,
//                     jsonData[i].Contact_Number_4,
//                     jsonData[i].Email_4,
//                     jsonData[i].Contact_Person_4_Valid,

//                     jsonData[i].Is_Main,
//                     jsonData[i].Is_Valid,
//                     jsonData[i].SEZ,
//                     jsonData[i].CID
//                   ],
//                   (error, results, fields) => {
//                     // console.log(error,results,fields)
//                     if (error) {
//                       if (error.errno === 1062) {
//                         results.status(501).json({
//                           is_Error: true
//                         });
//                       }
//                       return connection.rollback();
//                       return;
//                     }
//                   }
//                 );
//               }
//             } else {
//               if (error) {
//                 if (error.errno === 1062) {
//                   results.status(501).json({
//                     is_Error: true
//                   });
//                 }
//                 return connection.rollback();
//                 return;
//               }
//             }
//           }
//         );
//       } else {
//         if (error) {
//           if (error.errno === 1062) {
//             results.status(501).json({
//               is_Error: true
//             });
//           }
//           return connection.rollback();
//           return;
//         }
//       }
//     });
//     connection.commit(function(err) {
//       if (err) {
//         return connection.rollback();
//       }
//     });
//   });
// });

// app.post(`/insert_customer_address`, (req, res) => {
//   // get all data from request
//   var customerId = req.query.customerId;

//   // get address (dynamic)

//   var address = req.query.address;
//   var jsonData = JSON.parse(address);
//   var length = jsonData.length;

//   // define sql queries
//   var qrInsCustAddress = `insert into customer_location_master (
//         Customer_Id,Address,GST_Value,
//         Contact_Person_1,Contact_Number_1,Email_1, Contact_Person_1_Valid,
//         Contact_Person_2,Contact_Number_2,Email_2, Contact_Person_2_Valid,
//         Contact_Person_3,Contact_Number_3,Email_3, Contact_Person_3_Valid,
//         Contact_Person_4,Contact_Number_4,Email_4, Contact_Person_4_Valid,
//         Is_Main,Is_Valid,created_date,updated_date,SEZ,City,State,Pincode)
//     values
//     (?,?,?,
//     ?,?,?,1,
//     ?,?,?,1,
//     ?,?,?,1,
//     ?,?,?,1,
//     ?,1,null,null,?,?,?,?)`;
//   // start transaction
//   connection.beginTransaction(function(err) {
//     if (err) {
//       throw err;
//     }
//     // running second query (dynamic) for each address
//     for (i = 0; i < length; i++) {
//       connection.query(
//         qrInsCustAddress,
//         [
//           customerId,
//           jsonData[i].Address,
//           jsonData[i].GSTValue,

//           jsonData[i].ContactPerson1,
//           jsonData[i].ContactNumber1,
//           jsonData[i].Email1,

//           jsonData[i].ContactPerson2,
//           jsonData[i].ContactNumber2,
//           jsonData[i].Email2,

//           jsonData[i].ContactPerson3,
//           jsonData[i].ContactNumber3,
//           jsonData[i].Email3,

//           jsonData[i].ContactPerson4,
//           jsonData[i].ContactNumber4,
//           jsonData[i].Email4,

//           jsonData[i].isMain,
//           jsonData[i].SEZ,
//           jsonData[i].City,
//           jsonData[i].State,
//           jsonData[i].Pincode
//         ],
//         (error, results, fields) => {
//           // console.log('data: ',error, results, fields)
//           if (error) {
//             if (error.errno === 1062) {
//               res.status(501).json({
//                 is_Error: true
//               });
//             }
//             return connection.rollback();
//             return;
//           } else if (!error)
//             res.status(200).json({
//               results: "success"
//             });
//         }
//       );
//     }
//     connection.commit(function(err) {
//       if (err) {
//         return connection.rollback();
//       }
//     });
//   });
// });

// get challans for a customer
// app.get(`/get_challan`, (req, res) => {
//   var qry = `SELECT challan_number FROM order_master where customer_id = ?;`;
//   var customer_id = req.query.customer_id;
//   // var challan_number
//   connection.query(qry, [customer_id], (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//     } else {
//     }
//     res.status(200).json({
//       isSuccess: true,
//       results: results
//     });
//   });
// });

// app.get(`/get_customer_assets_for_addassetpage`, (req, res) => {
//   var qry1 = `select a.*,b.*,c.serial_no from order_master a,order_detail b,asset c where a.ID=b.order_id and c.id = b.asset_id`;

//   connection.query(qry1, (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//       return;
//     } else {
//     }

//     res.status(200).json({
//       isSuccess: true,
//       results: results
//     });
//   });
// });

// app.get("/change_inventory_status_to_on_repair", (req, res) => {
//   var i;
//   var qry = "update asset set status=3 where id=? ";
//   var check = JSON.parse(req.query.data);
//   //console.log(check)
//   // console.log(req.query)
//   for (i = 0; i < check.length; i++) {
//     connection.query(qry, [check[i]], (error, results, fields) => {
//       if (error) {
//         res.status(501).json({
//           isSuccess: false,
//           error: error
//         });
//         return;
//       }
//     });
//   }
//   res.status(200).json({
//     isSuccess: true
//   });
// });

// get unavailable (out of stock) assets
// app.get(`/get_out_of_stock_assets`, (req, res) => {
//   var qGetStatic = `SELECT * FROM asset where status = 0 order by id`;
//   var qGetDynamic = `
//         SELECT attribute_id, attr_name, attribute_value, asset_id
//         FROM asset_details d, asset_types_attributes t
//         where d.attribute_id = t.id
//         and asset_id in (SELECT id FROM asset where status = 0) order by asset_id`;
//   var staticData;

//   connection.query(qGetStatic, (error, results, fields) => {
//     if (error) {
//       res.status(200).json({
//         isSuccess: false,
//         error: error
//       });
//     } else {
//       staticData = results;
//     }
//   });
//   connection.query(qGetDynamic, (error, results, fields) => {
//     res.status(201).json({
//       isSuccess: true,
//       static: staticData,
//       dynamic: results
//     });
//   });
// });

// app.post(`/change_config_table`, (req, res) => {
//   var asset_id = req.query.asset_id;
//   var child_asset_id = req.query.child_asset_id;

//   var qry = `insert into asset_config
//         (asset_id,child_asset_id,create_timestamp,update_timestamp,parent_asset_id,status)
//         values
//         (?,?,null,null,null,1)`;

//   connection.query(
//     qry,
//     [asset_id, child_asset_id],
//     (error, results, response) => {
//       if (error) {
//         res.status(501).json({
//           isSuccess: false,
//           error: error
//         });
//       } else {
//         res.status(200).json({
//           isSuccess: true
//         });
//       }
//     }
//   );
// });

// app.get(`/get_all_asset`, (req, res) => {
//   var qry = `select * from asset`;

//   connection.query(qry, (error, results, response) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//     } else {
//       res.status(200).json({
//         isSuccess: true,
//         results: results
//       });
//     }
//   });
// });

// app.post(`/update_warranty`, (req, res) => {
//   var assetId = req.query.asset_id;
//   var newWarranty = req.query.warranty_date;
//   var qry = `update asset set warranty_end_date = ? where id = ?`;

//   connection.query(qry, [newWarranty, assetId], (error, results, response) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//     } else {
//       res.status(200).json({
//         isSuccess: true
//       });
//     }
//   });
// });

// app.use(bodyParser.urlencoded({
//     extended: true
// }));

// app.use(bodyParser.json());

// app.post(`/insert_challan_draft`, (req, res) => {
//   var challanType = req.query.challan_type;
//   var challanDescription = req.query.challan_description;
//   var challanDetails = req.body.challan_details;

//   var qry = `insert into challan_draft
//             (challan_type, challan_description, challan_details, create_timestamp, update_timestamp)
//             values (?, ?, ?, null, null)`;

//   connection.query(
//     qry,
//     [challanType, challanDescription, challanDetails],
//     (error, results, response) => {
//       if (error) {
//         res.status(501).json({
//           isSuccess: false,
//           error: error
//         });
//       } else {
//         res.status(200).json({
//           isSuccess: true
//         });
//       }
//     }
//   );
// });

// modify challand draft
// app.post(`/modify_challan_draft`, (req, res) => {
//   var id = req.query.id;
//   var challanType = req.query.challan_type;
//   var challanDescription = req.query.challan_description;
//   var challanDetails = req.body.challan_details;

//   var qry = `update challan_draft set
//             challan_type = ?,
//             challan_description = ?,
//             challan_details = ?,
//             create_timestamp = null,
//             update_timestamp = null
//                 where id = ?`;

//   connection.query(
//     qry,
//     [challanType, challanDescription, challanDetails, id],
//     (error, results, response) => {
//       if (error) {
//         res.status(501).json({
//           isSuccess: false,
//           error: error
//         });
//       } else {
//         res.status(200).json({
//           isSuccess: true
//         });
//       }
//     }
//   );
// });

// get all draft challans
// app.get(`/get_challan_drafts`, (req, res) => {
//   var qry = `select id, challan_type, challan_description, create_timestamp, update_timestamp from challan_draft`;
//   var customer_id = req.query.customer_id;
//   // var challan_number
//   connection.query(qry, (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//     } else {
//     }
//     res.status(200).json({
//       isSuccess: true,
//       results: results
//     });
//   });
// });

// API that accepts a challandId and outputs the challan details of that asset
// app.get(`/get_challan_details`, (req, res) => {
//   var challanId = req.query.challan_id;
//   var qry = "select challan_details from challan_draft where id = ?";
//   connection.query(qry, [challanId], (error, results, fields) => {
//     if (!error) {
//       res.status(200).json({
//         isSuccess: true,
//         results: results
//       });
//     } else {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//     }
//   });
// });

// API that accepts a challandId and deletes that challan
// app.get(`/delete_challan_details`, (req, res) => {
//   var challanId = req.query.challan_id;
//   var qry = "delete from challan_draft where id = ?";
//   connection.query(qry, [challanId], (error, results, fields) => {
//     if (!error) {
//       res.status(200).json({
//         isSuccess: true
//       });
//     } else {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//     }
//   });
// });

// app.get("/reset_inventory_status", (req, res) => {
//   var i;
//   var qry = "update asset set status=1 where id=? ";
//   var check = JSON.parse(req.query.data);
//   //console.log(check)
//   // console.log('query is: ',req.query)
//   for (i = 0; i < check.length; i++) {
//     connection.query(qry, [check[i]], (error, results, fields) => {
//       if (error) {
//         res.status(501).json({
//           isSuccess: false,
//           error: error
//         });
//         return;
//       }
//     });
//   }
//   res.status(200).json({
//     isSuccess: true
//   });
// });

// app.get(`/get_customer_order_details`, (req, res) => {
//   // input cutomer_id

//   // 1. fetch entries from order master based on the id
//   // 2. from fk location_id fetch the corresponding locations
//   // 3. fetch the details form order detail on the basis of order_id

//   var qry = `select a.*,b.*,c.*,d.*,e.*,f.type_name from order_master a,order_detail b,customer c,customer_location_master d,asset e,asset_types f
//         where a.customer_id=c.Customer_Id and a.customer_location_id=d.CID and a.ID=b.order_id and b.asset_id=e.id and e.asset_type_id=f.id and a.customer_id=? and b.status=1`;
//   var customer_id = req.query.customer_id;
//   connection.query(qry, [customer_id], (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//     } else {
//       res.status(200).json({
//         isSuccess: true,
//         results: results
//       });
//     }
//   });
// });

/*
selectedcheckboxassets:
[
    {"id":2,"status":"1","comments":""},
    {"id":3,"status":"2","comments":"Bad"},
    {"id":14,"status":"2","comments":"Damaged"},
    {"id":13,"status":"1","comments":""}
]
update the staus and comment of the asset table for the ids given

selectedorderids
[2,3,5,6]

update the order_detail table and set status to 0 according to the oids given
*/

// app.get(`/change_status_on_return`, (req, res) => {
//   var qUpdateAsset =
//     "update asset set status = ?, comments = concat(coalesce(comments, ''),' ',?) where id = ?";
//   var qUpdateOrder = "update order_detail set status = 0 where oid = ?";

//   var assetUpdates = JSON.parse(req.query.data);
//   var orderUpdates = JSON.parse(req.query.oid);
//   connection.beginTransaction(function(err) {
//     if (err) {
//       throw err;
//     }
//     for (var i = 0; i < assetUpdates.length; i++) {
//       // var str ="update asset set status = "+assetUpdates[i].status+", comments= concat(coalesce(comments, ''),' ',"+assetUpdates[i].comments+") where id = "+assetUpdates[i].id

//       connection.query(
//         qUpdateAsset,
//         [assetUpdates[i].status, assetUpdates[i].comments, assetUpdates[i].id],
//         (error, results, response) => {
//           if (error) {
//             // console.log('***error: ', error)
//             res.status(501).json({
//               error
//             });
//             return connection.rollback();
//             return;
//           }
//         }
//       );
//     }

//     for (var i = 0; i < orderUpdates.length; i++) {
//       // console.log('***order: ', orderUpdates[i])
//       connection.query(
//         qUpdateOrder,
//         [orderUpdates[i]],
//         (error, results, response) => {
//           if (error) {
//             // console.log('***error2: ', error)
//             res.status(501).json({
//               error
//             });
//             return connection.rollback();
//             return;
//           }
//         }
//       );
//     }
//     connection.commit(function(err) {
//       if (err) {
//         res.status(501).json({
//           error: err
//         });
//         return connection.rollback();
//       } else {
//         res.status(200).json({
//           isSuccess: true
//         });
//       }
//     });
//   });
// });

// this.state.challanCartItem.make
// this.state.selectedCustomerDetail.CName

// app.get(`/get_customer_office_departments`, (req, res) => {
//   var qry = "SELECT * from customer_office_departments";
//   connection.query(qry, (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//     } else {
//       res.status(200).json({
//         isSuccess: true,
//         results: results
//       });
//     }
//   });
// });

// app.get(`/get_customer_location_contacts`, (req, res) => {
//   var qry = "SELECT * from customer_location_contacts";
//   connection.query(qry, (error, results, fields) => {
//     if (error) {
//       res.status(501).json({
//         isSuccess: false,
//         error: error
//       });
//     } else {
//       res.status(200).json({
//         isSuccess: true,
//         results: results
//       });
//     }
//   });
// });

/*
* serves the index.html file when endpoint do not match any router
* index.html file is the root file for react 
*  
*/
