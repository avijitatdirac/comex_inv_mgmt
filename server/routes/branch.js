const express = require("express");
const router = express.Router();
const conn = require("../connection");
const { queryDatabaseWithPromise } = require("./utility");

/**
 * All routes
 */

router.post("/get_branch_names", getBranchNames);
router.post("/get_branches", getBranches);
router.post("/get_branch_details", getBranchDetails);
router.post("/insert_branch", insertBranch);
router.post("/update_branch", updateBranch);
router.post("/delete_branch", deleteBranch);

/**
 * fetches the list of branch names, needed to populate the dropdown
 */
async function getBranchNames(req, res) {
  const qry = `select id, name, allow_movement_of_items
                  from branch
                  where is_active = 1`;

  try {
    const branchNames = await queryDatabaseWithPromise(conn, qry, []);
    res.status(200).json({ branchNames });
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: err });
  }
}

/**
 * fetches the list of branches
 */
async function getBranches(req, res) {
  const qry = `select id, 
                    name, 
                    allow_movement_of_items,
                    addr_line_1,
                    addr_line_2,
                    addr_line_3,
                    city,
                    state,
                    pin,
                    main_contact_name,
                    main_contact_email,
                    main_contact_phone,
                    is_active 
                  from branch 
                  where is_active = 1`;

  try {
    const branches = await queryDatabaseWithPromise(conn, qry, []);
    res.status(200).json({ branches });
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: err });
  }
}

/**
 * fetches the details of a particular branch
 */
async function getBranchDetails(req, res) {
  const qry = `select id, 
                    name, 
                    allow_movement_of_items,
                    addr_line_1,
                    addr_line_2,
                    addr_line_3,
                    city,
                    state,
                    pin,
                    main_contact_name,
                    main_contact_email,
                    main_contact_phone,
                    is_active 
                  from branch 
                  where id = ?`;

  const contactQry = `select id,
                            name,
                            email,
                            phone,
                            is_active,
                            "UPDATE" as operation
                        from branch_alternate_contacts
                        where branch_id = ?`;

  const { id } = req.body;

  // return 503 if id is not passed in the request
  if (!id) {
    res.status(503).json({ error: "id is required" });
    return;
  }

  const params = [id];
  const promises = [];

  try {
    const promise1 = queryDatabaseWithPromise(conn, qry, params);
    promises.push(promise1);

    const promise2 = queryDatabaseWithPromise(conn, contactQry, params);
    promises.push(promise2);

    const results = await Promise.all(promises);
    const data = {
      ...results[0][0],
      alternateContactInfo: [...results[1]]
    };
    res.status(200).json({ ...data });
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: err });
  }
}

/**
 * insert a branch details into the branch table
 */
async function insertBranch(req, res) {
  const qry = `insert into branch (
                  name,
                  allow_movement_of_items,
                  addr_line_1,
                  addr_line_2,
                  addr_line_3,
                  city,
                  state,
                  pin,
                  main_contact_name,
                  main_contact_email,
                  main_contact_phone,
                  is_active,
                  create_timestamp,
                  update_timestamp
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
                  current_timestamp,
                  current_timestamp
                )`;

  const contactQry = `insert into branch_alternate_contacts(
                        branch_id,
                        name,
                        email,
                        phone,
                        is_active,
                        updt_ts 
                      ) values (
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        current_timestamp
                      )`;

  const {
    name,
    allow_movement_of_items,
    addr_line_1,
    addr_line_2,
    addr_line_3,
    city,
    state,
    pin,
    main_contact_name,
    main_contact_email,
    main_contact_phone
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
    allow_movement_of_items,
    addr_line_1,
    addr_line_2,
    addr_line_3,
    city,
    state,
    pin,
    main_contact_name,
    main_contact_email,
    main_contact_phone,
    1
  ];

  try {
    // insert into branch table first
    const result = await queryDatabaseWithPromise(conn, qry, qryParams);

    // get the last insert branch id
    const id = result.insertId;

    // if last insert id is not found then exit
    if (!id) {
      res.status(503).json({ error: "Error insert data" });
      return;
    }

    // insert into alternate contact table
    const promises = [];
    alternateContactInfo.forEach(contact => {
      const params = [id, contact.name, contact.email, contact.phone, 1];
      const p = queryDatabaseWithPromise(conn, contactQry, params);
      promises.push(p);
    });
    await Promise.all(promises);

    // return the response when all promises resolved
    res.status(200).json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: err });
  }
}

/**
 * update branch details
 */
async function updateBranch(req, res) {
  const qry = `update branch 
                  set name = ?,
                  allow_movement_of_items = ?,
                  addr_line_1 = ?,
                  addr_line_2 = ?,
                  addr_line_3 = ?,
                  city = ?,
                  state = ?,
                  pin = ?,
                  main_contact_name = ?,
                  main_contact_email = ?,
                  main_contact_phone = ?,
                  update_timestamp = current_timestamp
                where id = ?`;

  const contactInsQry = `insert into branch_alternate_contacts(
                  branch_id,
                  name,
                  email,
                  phone,
                  is_active,
                  updt_ts 
                ) values (
                  ?,
                  ?,
                  ?,
                  ?,
                  ?,
                  current_timestamp
                )`;

  const contactUpdtQry = `update branch_alternate_contacts
                              set name = ?,
                                  email = ?,
                                  phone = ?,
                                  is_active = ?,
                                  updt_ts = current_timestamp
                              where id = ? and branch_id = ?`;

  const {
    id,
    name,
    allow_movement_of_items,
    addr_line_1,
    addr_line_2,
    addr_line_3,
    city,
    state,
    pin,
    main_contact_name,
    main_contact_email,
    main_contact_phone
  } = req.body;

  // sanity check data
  if (!id) {
    res.status(503).json({ success: false, error: "id is required" });
    return;
  }

  // make sure alternateContactInfo is an array
  let { alternateContactInfo } = req.body;
  alternateContactInfo = Array.isArray(alternateContactInfo)
    ? alternateContactInfo
    : [];

  const qryParams = [
    name,
    allow_movement_of_items,
    addr_line_1,
    addr_line_2,
    addr_line_3,
    city,
    state,
    pin,
    main_contact_name,
    main_contact_email,
    main_contact_phone,
    id
  ];
  const promises = [];

  // for inserting new contact
  const insertContact = contact => {
    // exit when is_active = 0
    if (contact.is_active !== 1) {
      return;
    }
    // insert only if one of name, email, phone exists
    if (contact.name || contact.email || contact.phone) {
      const params = [id, contact.name, contact.email, contact.phone, 1];
      const promise = queryDatabaseWithPromise(conn, contactInsQry, params);
      promises.push(promise);
    }
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
    promises.push(promise);
  };

  try {
    await queryDatabaseWithPromise(conn, qry, qryParams);
    alternateContactInfo.forEach(contact => {
      if (contact.operation === "UPDATE" && contact.id && contact.id > 0) {
        updateContact(contact);
      } else {
        insertContact(contact);
      }
    });
    await Promise.all(promises);
    res.status(200).json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: err });
  }
}

/**
 * delete the branch
 */
async function deleteBranch(req, res) {
  const qry = `update branch 
                  set is_active = 0 
                where id = ?`;

  const contactQry = `update branch_alternate_contacts
                        set is_active = 0
                      where branch_id = ?`;
  const { id } = req.body;
  // sanity check data
  if (!id) {
    res.status(503).json({ error: "id is required" });
    return;
  }

  const params = [id];

  try {
    // first delete from the contact table
    await queryDatabaseWithPromise(conn, contactQry, params);
    // delete from the branch table
    await queryDatabaseWithPromise(conn, qry, params);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: err });
  }
}

module.exports = router;
