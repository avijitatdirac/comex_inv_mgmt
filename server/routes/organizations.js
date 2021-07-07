const express = require("express");
const router = express.Router();
const conn = require("../connection");
const { queryDatabaseWithPromise } = require("./utility");

/**
 * This route handle all operations with new DB table organizations
 * NOT TO BE CONFUSED with organization which is old existing one
 */

const ORG_DELETE_QRY = `delete from organizations where id = ?`;
const ORG_CONTACT_DELETE_QRY = `delete from organization_contacts where organization_id = ?`;

const ORG_QRY = `select id, 
                    org_type as orgType,
                    name,
                    cin,
                    pan,
                    gst,
                    is_gst_registered as gstRegistered,
                    addr_line_1 as addrLine1,
                    addr_line_2 as addrLine2,
                    addr_line_3 as addrLine3,
                    city,
                    state,
                    pin,
                    allow_movement_of_items as allowMovementOfItems,
                    is_sez as isSez,
                    ifnull(parent_id, -1) as parentCustomerId
                from organizations
                where id = ?`;

const ORG_CONTACT_QRY = `select id,
                            organization_id as organizationId, 
                            name,
                            phone,
                            email,
                            role,
                            is_main_contact as isMainContact,
                            is_active as isActive
                        from organization_contacts
                        where organization_id = ?`;

router.post("/get_all_organizations", (req, res) => {
  const { orgType } = req.body;
  const qry = `select id,
                    name,
                    pan,
                    gst,
                    cin,
                    city,
                    pin
                from organizations
                where org_type = ?`;
  if (
    !orgType ||
    (orgType !== "CE" && orgType !== "CUSTOMER" && orgType !== "VENDOR")
  ) {
    res.status(503).json({ error: "orgType is required" });
  }

  queryDatabaseWithPromise(conn, qry, [orgType])
    .then(data => {
      res.status(200).json({ data });
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ error: err });
    });
});

router.post("/get_all_parents", (req, res) => {
  const qry = `select id,
                        name,
                        pan,
                        cin,
                        gst
                from organizations
                where parent_id is null or parent_id = 0`;
  queryDatabaseWithPromise(conn, qry, [])
    .then(data => {
      res.status(200).json({ data });
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ error: err });
    });
});

router.post("/get_organization_details", (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(503).json({ error: "id is required" });
    return;
  }
  const allPromises = [];
  const p1 = queryDatabaseWithPromise(conn, ORG_QRY, [id]);
  const p2 = queryDatabaseWithPromise(conn, ORG_CONTACT_QRY, [id]);
  allPromises.push(p1);
  allPromises.push(p2);
  Promise.all(allPromises)
    .then(results => {
      if (results[0].length > 0) {
        const data = results[0][0];
        data.contacts = results[1];
        res.status(200).json({ data });
      } else {
        res.status(503).json({ error: "NOT FOUND" });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ error: err });
    });
});

router.post("/save_organizations", async (req, res) => {
  const {
    id,
    orgType,
    name,
    pan,
    gst,
    addrLine1,
    city,
    pin,
    contacts
  } = req.body;

  // check for valid orgType
  if (orgType !== "CE" && orgType !== "CUSTOMER" && orgType !== "VENDOR") {
    res
      .status(503)
      .json({ error: "Invalid orgType: " + orgType, success: false });
    return;
  }

  // check required fields
  if (!name || !pan || !gst || !addrLine1 || !city || !pin) {
    res.status(503).json({ error: "Missing required fields", success: false });
    return;
  }

  // check if contacts present
  if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
    res.status(503).json({ error: "Contacts missing", success: false });
  }

  try {
    if (id) {
      // update data
      await updateOrg(req);
      await insertUpdtOrgContact(contacts, id);
      res.status(200).json({ success: true, id });
    } else {
      // insert data
      const orgId = await insertOrg(req);
      await insertUpdtOrgContact(contacts, orgId);
      res.status(200).json({ success: true, id: orgId });
    }
  } catch (err) {
    console.error(err);
    res.status(503).json({ success: false, error: err });
  }
});

router.post("/get_child_count", async (req, res) => {
  const qry = `select count(*) as count from organizations where parent_id = ?`;
  const { id } = req.body;
  if (!id) {
    res.status(503).json({ error: "id is required" });
    return;
  }
  try {
    const result = await queryDatabaseWithPromise(conn, qry, [id]);
    res.status(200).json({ ...result[0] });
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: err });
  }
});

router.post("/delete_organization", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(503).json({ error: "id is required" });
    return;
  }
  try {
    await queryDatabaseWithPromise(conn, ORG_CONTACT_DELETE_QRY, [id]);
    await queryDatabaseWithPromise(conn, ORG_DELETE_QRY, [id]);
    res.status(503).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: err });
  }
});

// insert into organizations table
async function insertOrg(req) {
  const ORG_INS_QRY = `insert into organizations (
        org_type,
        name,
        cin,
        pan,
        gst,
        is_gst_registered,
        addr_line_1,
        addr_line_2,
        addr_line_3,
        city,
        state,
        pin,
        is_sez,
        allow_movement_of_items,
        parent_id)
        values(
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
        ?,
        ?)`;

  const {
    orgType,
    name,
    cin,
    pan,
    gst,
    gstRegistered,
    addrLine1,
    addrLine2,
    addrLine3,
    city,
    state,
    pin,
    isSEZ,
    allowMovementOfItems,
    parentCustomerId
  } = req.body;

  const params = [
    orgType,
    name,
    cin,
    pan,
    gst,
    gstRegistered ? 1 : 0,
    addrLine1,
    addrLine2,
    addrLine3,
    city,
    state,
    pin,
    isSEZ ? 1 : 0,
    allowMovementOfItems ? 1 : 0,
    parentCustomerId > 0 ? parentCustomerId : null
  ];
  const result = await queryDatabaseWithPromise(conn, ORG_INS_QRY, params);
  const orgId = result.insertId;
  return orgId;
}

// update organizations table
async function updateOrg(req) {
  const ORG_UPDT_QRY = `update organizations 
                        set name = ?,
                        cin = ?,
                        pan = ?,
                        gst = ?,
                        is_gst_registered = ?,
                        addr_line_1 = ?,
                        addr_line_2 = ?,
                        addr_line_3 = ?,
                        city = ?,
                        state = ?,
                        pin = ?,
                        is_sez = ?,
                        allow_movement_of_items = ?
                    where id = ?`;

  const {
    id,
    name,
    cin,
    pan,
    gst,
    gstRegistered,
    addrLine1,
    addrLine2,
    addrLine3,
    city,
    state,
    pin,
    isSEZ,
    allowMovementOfItems
  } = req.body;

  const params = [
    name,
    cin,
    pan,
    gst,
    gstRegistered ? 1 : 0,
    addrLine1,
    addrLine2,
    addrLine3,
    city,
    state,
    pin,
    isSEZ ? 1 : 0,
    allowMovementOfItems ? 1 : 0,
    id
  ];
  await queryDatabaseWithPromise(conn, ORG_UPDT_QRY, params);
  return id;
}

// insert into organization_contacts table
async function insertUpdtOrgContact(contacts, orgId) {
  const ORG_CONTACT_INS_QRY = `insert into organization_contacts (
        organization_id, 
        name, 
        phone, 
        email, 
        role, 
        is_main_contact, 
        is_active
    ) values (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?)`;

  const ORG_CONTACT_UPDT_QRY = `update organization_contacts 
        set name = ?,
        phone = ?,
        email = ?,
        role = ?,
        is_main_contact = ?,
        is_active = ?
    where id = ? and organization_id = ?`;

  const allPromises = [];
  for (const contact of contacts) {
    if (contact.id > 0) {
      console.log("updating - " + contact.id);
      const params = [
        contact.name,
        contact.phone,
        contact.email,
        contact.role,
        contact.isMainContact,
        contact.isActive,
        contact.id,
        orgId
      ];
      const p = queryDatabaseWithPromise(conn, ORG_CONTACT_UPDT_QRY, params);
      allPromises.push(p);
    } else {
      console.log("inserting - " + contact.id);
      const params = [
        orgId,
        contact.name,
        contact.phone,
        contact.email,
        contact.role,
        contact.isMainContact,
        contact.isActive
      ];
      const p = queryDatabaseWithPromise(conn, ORG_CONTACT_INS_QRY, params);
      allPromises.push(p);
    }
  }
  await Promise.all(allPromises);
  return true;
}

module.exports = router;
