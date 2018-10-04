const express = require("express");
const router = express.Router();
const conn = require("../connection");
const { queryDatabaseWithPromise } = require("./utility");

router.post("/get_user_list", getUserList);
router.post("/get_user_location", getUserLocation);
router.post("/get_user_details", getUserDetails);
router.post("/get_user_privileges", getUserPrivileges);
router.post("/insert_user_details", insertUserDetails);
router.post("/update_user_details", updateUserDetails);
router.post("/check_allow_movement_of_items", checkAllowMovement);

/**
 *
 * fetches the list of users
 */
async function getUserList(req, res) {
  const qry = `select 
                  first_name,
                  last_name,
                  email_address,
                  role_id, 
                  branch_id,
                  user_status,
                  reason_for_deactivation
                from users`;

  try {
    const result = await queryDatabaseWithPromise(conn, qry, []);
    res.status(200).json({ userList: result });
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: err });
  }
}

/**
 * fetches the user's location of logged in user
 */
async function getUserLocation(req, res) {
  const qry = `select branch_id from users where email_address = ?`;
  const email = req.session.email_address;

  if (!email) {
    res.status(503).json({ error: "User email not found" });
    return;
  }

  try {
    const result = await queryDatabaseWithPromise(conn, qry, [email]);
    const branch_id = result && result.length > 0 ? result[0].branch_id : 0;
    res.status(200).json({ branch_id });
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: err });
  }
}

/**
 * fetches user details
 */
async function getUserDetails(req, res) {
  const qry = `SELECT 
                  u.username,
                  u.first_name,
                  u.last_name,
                  u.email_address,
                  u.role_id,
                  IFNULL(r.role_name, '') AS role_name,
                  u.branch_id,
                  IFNULL(b.name, '') AS branch_name,
                  u.user_status,
                  u.reason_for_deactivation
                FROM
                  users u
                      LEFT JOIN
                  user_roles r ON u.role_id = r.role_id
                      LEFT JOIN
                  branch b ON u.branch_id = b.id
                WHERE
                  u.email_address = ?`;
  const email = req.body.email_address;

  if (!email) {
    res.status(503).json({ error: "User email not found" });
    return;
  }
  try {
    const result = await queryDatabaseWithPromise(conn, qry, [email]);
    if (result && result.length > 0) {
      res.status(200).json({ userDetails: result[0] });
    } else {
      res.status(200).json({ userDetails: {} });
    }
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: err });
  }
}

/**
 * fetches the user's privileges based on the role
 */
async function getUserPrivileges(req, res) {
  const email = req.session.email_address;
  const qry = `SELECT
                u.email_address,
                u.role_id,
                r.role_name,
                m.privilege_id,
                p.privilege_name
              FROM
                user_role_privilege_mapping m
                    JOIN
                user_roles r ON m.role_id = r.role_id
                    JOIN
                users u ON m.role_id = u.role_id
                    JOIN
                user_privileges p ON m.privilege_id = p.id
              WHERE
                u.email_address = ?`;

  if (!email) {
    res.status(503).json({ error: "User email not found" });
    return;
  }

  try {
    const result = await queryDatabaseWithPromise(conn, qry, [email]);
    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: err });
  }
}

/**
 * inserts a new user into the users table
 */
async function insertUserDetails(req, res) {
  const qry = `insert ignore into users(
        username,
        password,
        first_name,
        last_name,
        email_address,
        role_id,
        branch_id,
        user_status
    ) values (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        1
      ) `;
  const {
    first_name,
    last_name,
    email_address,
    password,
    role_id,
    branch_id
  } = req.body;

  // sanity check data
  if (!email_address || !password) {
    res.status(503).json({ error: "Mandatory fields missing" });
    return;
  }

  const params = [
    email_address,
    password,
    first_name,
    last_name,
    email_address,
    role_id,
    branch_id
  ];

  try {
    await queryDatabaseWithPromise(conn, qry, params);
    res.status(200).json({ success: true, insertId });
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: err });
  }
}

/**
 * update existing user details
 */
async function updateUserDetails(req, res) {
  const qry = `update users 
                  set first_name = ?,
                  last_name = ?,
                  role_id = ?,
                  branch_id = ?,
                  user_status = ?,
                  reason_for_deactivation = ?
                where email_address = ?`;

  const {
    first_name,
    last_name,
    role_id,
    branch_id,
    user_status,
    reason_for_deactivation,
    email_address
  } = req.body;

  if (!email_address) {
    res.status(503).json({ error: "email is missing" });
    return;
  }

  const params = [
    first_name,
    last_name,
    role_id,
    branch_id,
    user_status,
    reason_for_deactivation,
    email_address
  ];

  try {
    await queryDatabaseWithPromise(conn, qry, params);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: err });
  }
}

/**
 * fetches the allow_movement_of_items flag from branch table
 * for the logged in user
 */
async function checkAllowMovement(req, res) {
  const email = req.session.email_address;
  if (!email) return;
  const qry = `select 
                  b.allow_movement_of_items 
                from branch b 
                join users u on b.id = u.branch_id
                where u.email_address = ?`;
  const params = [email];
  try {
    const result = await queryDatabaseWithPromise(conn, qry, params);
    res
      .status(200)
      .json({ allow_movement_of_items: result[0].allow_movement_of_items });
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: err });
  }
}

module.exports = router;
