const express = require("express");
const router = express.Router();
const conn = require("../connection");
const { queryDatabaseWithPromise } = require("./utility");

/**
 * fetch organization details from organization and organization_alternate_contacts table
 */
router.post("/get_organization_details", (req, res) => {
  const qry = `select id,
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
                      main_contact_phone
                  from organization`;

  const alt_contact_qry = `select id,
                                  organization_id,
                                  name,
                                  email,
                                  phone
                            from organization_alternate_contacts`;

  let allPromises = [];
  const orgPromise = queryDatabaseWithPromise(conn, qry, []);
  allPromises.push(orgPromise);
  const contactPromise = queryDatabaseWithPromise(conn, alt_contact_qry, []);
  allPromises.push(contactPromise);

  Promise.all(allPromises)
    .then(results => {
      const id = results[0][0].id;
      const name = results[0][0].name;
      const panNumber = results[0][0].pan;
      const gst = results[0][0].gst;
      const cin = results[0][0].cin;
      const addressLine1 = results[0][0].addr_line_1;
      const addressLine2 = results[0][0].addr_line_2;
      const addressLine3 = results[0][0].addr_line_3;
      const city = results[0][0].city;
      const state = results[0][0].state;
      const pin = results[0][0].pin;
      const mainContactPersonName = results[0][0].main_contact_name;
      const mainContactPersonEmail = results[0][0].main_contact_email;
      const mainContactPersonPhone = results[0][0].main_contact_phone;
      const alternateContactInfo = results[1];
      res.status(200).json({
        id,
        name,
        panNumber,
        gst,
        cin,
        addressLine1,
        addressLine2,
        addressLine3,
        city,
        state,
        pin,
        mainContactPersonName,
        mainContactPersonEmail,
        mainContactPersonPhone,
        alternateContactInfo
      });
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ error: err });
    });
});

/**
 * update the organization details in organization and organization_alternate_contacts table
 * NOTE: we are not inserting anything here.
 * Assumption is there will be only one organization.
 */
router.post("/save_organization", (req, res) => {
  const qry = `update organization 
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

  const contactQry = `update organization_alternate_contacts 
                        set name = ?,
                        email = ?,
                        phone = ?,
                        updt_ts = current_timestamp
                      where id = ? and organization_id = ?`;

  const {
    id,
    name,
    panNumber,
    gst,
    cin,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    state,
    pin,
    mainContactPersonName,
    mainContactPersonEmail,
    mainContactPersonPhone,
    alternateContactInfo
  } = req.body;

  let allPromises = [];
  const qryParams = [
    name,
    panNumber,
    gst,
    cin,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    state,
    pin,
    mainContactPersonName,
    mainContactPersonEmail,
    mainContactPersonPhone,
    id
  ];
  // update organization table first
  const qryPromise = queryDatabaseWithPromise(conn, qry, qryParams);
  allPromises.push(qryPromise);

  // update organization_alternate_contacts table
  alternateContactInfo.forEach(contact => {
    const params = [contact.name, contact.email, contact.phone, contact.id, id];
    allPromises.push(queryDatabaseWithPromise(conn, contactQry, params));
  });

  Promise.all(allPromises)
    .then(results => {
      res.status(200).json({ success: true });
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ error: err });
    });
});

module.exports = router;
