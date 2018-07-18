const express = require("express");
const router = express.Router();
const connection = require("../connection");

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

router.post("/insert_customer_address", (req, res) => {
  // get all data from request
  var customerId = req.body.customerId;

  // get address (dynamic)

  var address = req.body.address;
  var jsonData = JSON.parse(address);
  var length = jsonData.length;

  // define sql queries
  var qrInsCustAddress = `insert into customer_location_master (
        Customer_Id,Address,GST_Value,
        Contact_Person_1,Contact_Number_1,Email_1, Contact_Person_1_Valid,
        Contact_Person_2,Contact_Number_2,Email_2, Contact_Person_2_Valid,
        Contact_Person_3,Contact_Number_3,Email_3, Contact_Person_3_Valid,
        Contact_Person_4,Contact_Number_4,Email_4, Contact_Person_4_Valid,
        Is_Main,Is_Valid,created_date,updated_date,SEZ,City,State,Pincode)
    values
    (?,?,?,
    ?,?,?,1,
    ?,?,?,1,
    ?,?,?,1,
    ?,?,?,1,
    ?,1,null,null,?,?,?,?)`;
  // start transaction
  connection.beginTransaction(function(err) {
    if (err) {
      throw err;
    }
    // running second query (dynamic) for each address
    for (i = 0; i < length; i++) {
      connection.query(
        qrInsCustAddress,
        [
          customerId,
          jsonData[i].Address,
          jsonData[i].GSTValue,

          jsonData[i].ContactPerson1,
          jsonData[i].ContactNumber1,
          jsonData[i].Email1,

          jsonData[i].ContactPerson2,
          jsonData[i].ContactNumber2,
          jsonData[i].Email2,

          jsonData[i].ContactPerson3,
          jsonData[i].ContactNumber3,
          jsonData[i].Email3,

          jsonData[i].ContactPerson4,
          jsonData[i].ContactNumber4,
          jsonData[i].Email4,

          jsonData[i].isMain,
          jsonData[i].SEZ,
          jsonData[i].City,
          jsonData[i].State,
          jsonData[i].Pincode
        ],
        (error, results, fields) => {
          // console.log('data: ',error, results, fields)
          if (error) {
            if (error.errno === 1062) {
              res.status(501).json({
                is_Error: true
              });
            }
            return connection.rollback();
            return;
          } else if (!error)
            res.status(200).json({
              results: "success"
            });
        }
      );
    }
    connection.commit(function(err) {
      if (err) {
        return connection.rollback();
      }
    });
  });
});

router.post("/insert_customer", (req, res) => {
  // get all data from request
  var customer_name = req.body.customer_name;
  //var city          = req.query.city
  //var state         = req.query.state
  var cin_number = req.body.cin;
  var pan_number = req.body.pan_number;
  var comments = req.body.comments;

  // get address (dynamic)

  var address = req.body.address;
  var jsonData = JSON.parse(address);
  var length = jsonData.length;

  // define sql queries

  var qrInsCustStatic =
    "insert into customer (CName, updated_date, created_date, Previously_Known_As, Pan_No, Comments,CIN) values(?,null,null,null,?,?,?)";

  var qrInsCustDynamic = `
    insert into customer_location_master (
        Customer_Id,Address,GST_Value,
        Contact_Person_1,Contact_Number_1,Email_1, Contact_Person_1_Valid,Contact_Person_1_role,
        Contact_Person_2,Contact_Number_2,Email_2, Contact_Person_2_Valid,Contact_Person_2_role,
        Contact_Person_3,Contact_Number_3,Email_3, Contact_Person_3_Valid,Contact_Person_3_role,
        Contact_Person_4,Contact_Number_4,Email_4, Contact_Person_4_Valid,Contact_Person_4_role,
        Is_Main,Is_Valid,created_date,updated_date,SEZ,City,State,Pincode)
    values
    ((SELECT max(Customer_Id) FROM customer),?,?,
    ?,?,?,1,?,
    ?,?,?,1,?,
    ?,?,?,1,?,
    ?,?,?,1,?,
    ?,1,null,null,?,?,?,?)`;
  // start transaction
  connection.beginTransaction(function(err) {
    if (err) {
      throw err;
    }

    // running first query (static data)
    connection.query(
      qrInsCustStatic,
      [customer_name, pan_number, comments, cin_number],
      (error, results, fields) => {
        if (!error) {
          // running second query (dynamic) for each address
          for (i = 0; i < length; i++) {
            connection.query(
              qrInsCustDynamic,
              [
                jsonData[i].Address,
                jsonData[i].GSTValue,

                jsonData[i].ContactPerson1,
                jsonData[i].ContactNumber1,
                jsonData[i].Email1,
                jsonData[i].ContactRole1,

                jsonData[i].ContactPerson2,
                jsonData[i].ContactNumber2,
                jsonData[i].Email2,
                jsonData[i].ContactRole2,

                jsonData[i].ContactPerson3,
                jsonData[i].ContactNumber3,
                jsonData[i].Email3,
                jsonData[i].ContactRole3,

                jsonData[i].ContactPerson4,
                jsonData[i].ContactNumber4,
                jsonData[i].Email4,
                jsonData[i].ContactRole4,

                jsonData[i].isMain,
                jsonData[i].SEZ,
                jsonData[i].City,
                jsonData[i].State,
                jsonData[i].Pincode
              ],
              (error, results, fields) => {
                if (error) {
                  return connection.rollback();
                  return;
                }
              }
            );
          }
        } else {
          if (error) {
            return connection.rollback();
            return;
          }
        }
      }
    );
    connection.commit(function(err) {
      if (err) {
        res.status(501).json({
          isSuccess: false,
          results: "failure"
        });
        return connection.rollback();
      } else {
        res.status(200).json({
          isSuccess: true,
          results: "success"
        });
      }
    });
  });
});

router.post("/modify_customer", (req, res) => {
  // get all data from request
  var customerId = req.body.customerId;
  var customer_name = req.body.customer_name;
  var comments = req.body.comments;
  var prevName = "";
  // get address (dynamic)

  var address = req.body.address;
  var jsonData = JSON.parse(address);
  var length = jsonData.length;

  // console.log('jsondata: ',jsonData)

  // console.log('request is: ',req.query)
  // define sql queries
  // update customer set CName = 'Ritu 3', updated_date = null, Previously_Known_As = concat(Previously_Known_As, 'name'), Comments=concat(Comments,'comment 2') where Customer_Id=2
  var qrGetPrevName = "select CName from customer where Customer_Id = ?";
  var qrUpdateCust = `update customer set
            CName = ?,
            updated_date = null,
            Previously_Known_As =?,
            Comments=concat(coalesce(Comments, ''),' ',?)
                where Customer_Id=?`;

  var qrUpdateCustDynamic = `update customer_location_master set
            GST_Value=?,
            Contact_Person_1=?,
            Contact_Number_1=?,
            Email_1=?,
            Contact_Person_1_Valid = ?,

            Contact_Person_2=?,
            Contact_Number_2=?,
            Email_2=?,
            Contact_Person_2_Valid = ?,

            Contact_Person_3=?,
            Contact_Number_3=?,
            Email_3=?,
            Contact_Person_3_Valid = ?,

            Contact_Person_4=?,
            Contact_Number_4=?,
            Email_4=?,
            Contact_Person_4_Valid = ?,
            Is_Main=?,
            Is_Valid=?,
            updated_date=null,
            SEZ=?
                where CID=?`;
  var prevName = null;
  // start transaction
  connection.beginTransaction(function(err) {
    if (err) {
      throw err;
    }

    // first get customer id
    connection.query(qrGetPrevName, [customerId], (error, results, fields) => {
      // name retrieval successful
      if (!error) {
        if (
          results &&
          results.length > 0 &&
          results[0].CName !== customer_name
        ) {
          prevName = results[0].CName;
        }
        // update the customer
        connection.query(
          qrUpdateCust,
          [customer_name, prevName, comments, customerId],
          (error, results, fields) => {
            // customer updation successful
            if (!error) {
              // running second query (dynamic) for each address
              for (var i = 0; i < jsonData.length; i++) {
                connection.query(
                  qrUpdateCustDynamic,
                  [
                    jsonData[i].GST_Value,
                    jsonData[i].Contact_Person_1,
                    jsonData[i].Contact_Number_1,
                    jsonData[i].Email_1,
                    jsonData[i].Contact_Person_1_Valid,

                    jsonData[i].Contact_Person_2,
                    jsonData[i].Contact_Number_2,
                    jsonData[i].Email_2,
                    jsonData[i].Contact_Person_2_Valid,

                    jsonData[i].Contact_Person_3,
                    jsonData[i].Contact_Number_3,
                    jsonData[i].Email_3,
                    jsonData[i].Contact_Person_3_Valid,

                    jsonData[i].Contact_Person_4,
                    jsonData[i].Contact_Number_4,
                    jsonData[i].Email_4,
                    jsonData[i].Contact_Person_4_Valid,

                    jsonData[i].Is_Main,
                    jsonData[i].Is_Valid,
                    jsonData[i].SEZ,
                    jsonData[i].CID
                  ],
                  (error, results, fields) => {
                    // console.log(error,results,fields)
                    if (error) {
                      if (error.errno === 1062) {
                        results.status(501).json({
                          is_Error: true
                        });
                      }
                      return connection.rollback();
                      return;
                    }
                  }
                );
              }
            } else {
              if (error) {
                if (error.errno === 1062) {
                  results.status(501).json({
                    is_Error: true
                  });
                }
                return connection.rollback();
                return;
              }
            }
          }
        );
      } else {
        if (error) {
          if (error.errno === 1062) {
            results.status(501).json({
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

module.exports = router;