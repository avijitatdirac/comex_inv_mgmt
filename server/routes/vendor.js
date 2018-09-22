const express = require("express");
const router = express.Router();
const conn = require("../connection");
const { queryDatabaseWithPromise } = require("./utility");

/**
 * fetches the list of vendors
 */
router.post("/get_vendors", (req, res) => {
  const qry = `select id,
                      name, 
                      pan,
                      gst,
                      cin,
                      city,
                      main_contact_name
                from vendors`;
  queryDatabaseWithPromise(conn, qry, [])
    .then(vendors => {
      res.status(200).json({ vendors });
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ message: err });
    });
});

/**
 * get vendor details from vendors and vendor_alternate_contacts table
 */
router.post("/get_vendor_details", (req, res) => {
  const qry = `select id,
                      name, 
                      pan,
                      gst,
                      cin,
                      addr_line_1 as addressLine1,
                      addr_line_2 as addressLine2,
                      addr_line_3 as addressLine3,
                      city,
                      state,
                      pin,
                      main_contact_name as mainContactName,
                      main_contact_email as mainContactEmail,
                      main_contact_phone as mainContactPhone
                from vendors
                where id = ?`;

  const contactQry = `select id, 
                              vendor_id,
                              name,
                              email,
                              phone, 
                              is_active,
                              "UPDATE" as operation
                      from vendor_alternate_contacts 
                      where vendor_id = ? and is_active = 1`;

  const id = req.body.id;

  // sanity check data
  if (!id) {
    res.status(503).json({ error: "id is required" });
  }

  let allPromises = [];
  const params = [id];
  const qryPromise = queryDatabaseWithPromise(conn, qry, params);
  allPromises.push(qryPromise);
  const contactPromise = queryDatabaseWithPromise(conn, contactQry, params);
  allPromises.push(contactPromise);

  Promise.all(allPromises)
    .then(results => {
      res
        .status(200)
        .json({ ...results[0][0], alternateContactInfo: results[1] });
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ error: err });
    });
});

/**
 * Insert new vendor
 */
router.post("/insert_vendor", (req, res) => {
  const qry = `insert into vendors (
                      name,
                      pan,
                      gst,
                      cin,
                      addr_line_1,
                      addr_line_2,
                      addr_line_3,
                      city,
                      state,
                      pin,
                      main_contact_name,
                      main_contact_email,
                      main_contact_phone,
                      updt_ts 
                  ) values (
                      ?,
                      ?,
                      ?,
                      ?,
                      ?,
                      ?,
                      ?,
                      ?,
                      ?,
                      ?,
                      ?,
                      ?,
                      ?,
                      current_timestamp )`;

  const contactQry = `insert into vendor_alternate_contacts (
                      vendor_id,
                      name,
                      email,
                      phone,
                      updt_ts,
                      is_active
                    ) values (
                      ?,
                      ?,
                      ?,
                      ?,
                      current_timestamp,
                      1 )`;

  const {
    name,
    pan,
    gst,
    cin,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    state,
    pin,
    mainContactName,
    mainContactEmail,
    mainContactPhone
  } = req.body;

  // sanity check data, return if name is not present
  if (!name) {
    res.status(200).json({ success: false, error: "Name is required" });
    return;
  }
  // make sure alternateContactInfo is an array
  let { alternateContactInfo } = req.body;
  alternateContactInfo = Array.isArray(alternateContactInfo)
    ? alternateContactInfo
    : [];

  const qryParams = [
    name,
    pan,
    gst,
    cin,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    state,
    pin,
    mainContactName,
    mainContactEmail,
    mainContactPhone
  ];

  queryDatabaseWithPromise(conn, qry, qryParams)
    .then(result => {
      const insertId = result.insertId;
      if (!insertId) {
        throw new Error("Error inserting record");
      }
      let allPromises = [];
      alternateContactInfo.forEach(contact => {
        if (contact.is_active !== 1) {
          return;
        }
        const params = [insertId, contact.name, contact.email, contact.phone];
        allPromises.push(queryDatabaseWithPromise(conn, contactQry, params));
      });
      Promise.all(allPromises).then(results => {
        res.status(200).json({ success: true });
      });
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ error: err, success: false });
    });
});

/**
 * update vendor data
 */
router.post("/update_vendor", (req, res) => {
  const qry = `update vendors 
                  set name = ?,
                  pan = ?,
                  gst = ?,
                  cin = ?,
                  addr_line_1 = ?,
                  addr_line_2 = ?,
                  addr_line_3 = ?,
                  city = ?,
                  state = ?,
                  pin = ?,
                  main_contact_name = ?,
                  main_contact_email = ?,
                  main_contact_phone = ?,
                  updt_ts = current_timestamp
              where id = ?`;

  const contactInsQry = `insert into vendor_alternate_contacts (
                                    vendor_id,
                                    name,
                                    email,
                                    phone,
                                    updt_ts,
                                    is_active
                                  ) values (
                                    ?,
                                    ?,
                                    ?,
                                    ?,
                                    current_timestamp,
                                    1 )`;

  const contactUpdtQry = `update vendor_alternate_contacts 
                          set name = ?,
                          email = ?,
                          phone = ?,
                          is_active = ?,
                          updt_ts = current_timestamp
                      where id = ? and vendor_id = ?`;

  const {
    id,
    name,
    pan,
    gst,
    cin,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    state,
    pin,
    mainContactName,
    mainContactEmail,
    mainContactPhone
  } = req.body;

  // sanity check data
  if (!id) {
    res.status(200).json({ success: false, error: "id is required" });
    return;
  }

  // make sure alternateContactInfo is an array
  let { alternateContactInfo } = req.body;
  alternateContactInfo = Array.isArray(alternateContactInfo)
    ? alternateContactInfo
    : [];

  const qryParams = [
    name,
    pan,
    gst,
    cin,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    state,
    pin,
    mainContactName,
    mainContactEmail,
    mainContactPhone,
    id
  ];

  // first update the vendor table
  queryDatabaseWithPromise(conn, qry, qryParams)
    .then(result => {
      let allPromises = [];
      // for inserting new contact
      const insertContact = contact => {
        const params = [id, contact.name, contact.email, contact.phone];
        const promise = queryDatabaseWithPromise(conn, contactInsQry, params);
        allPromises.push(promise);
      };
      // for updating existing contact
      const updateContact = contact => {
        const params = [
          contact.name,
          contact.email,
          contact.phone,
          contact.is_active,
          contact.id,
          id
        ];
        const promise = queryDatabaseWithPromise(conn, contactUpdtQry, params);
        allPromises.push(promise);
      };

      alternateContactInfo.forEach(contact => {
        if (contact.is_active !== 1) {
          return;
        }
        if (contact.operation === "UPDATE" && contact.id && contact.id > 0) {
          updateContact(contact);
        } else {
          insertContact(contact);
        }
      });

      Promise.all(allPromises).then(r => {
        res.status(200).json({ success: true });
      });
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ success: false, error: err });
    });
});

module.exports = router;
