const express = require("express");
const router = express.Router();
const conn = require("../connection");
const { queryDatabaseWithPromise } = require("./utility");

/**
 * API endpoint to populate the branch dropdown
 */
router.post("/get_branch_names", (req, res) => {
  const qry = `select id, name
                  from branch
                  where is_active = 1`;
  queryDatabaseWithPromise(conn, qry, [])
    .then(branchNames => {
      res.status(200).json({ branchNames });
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ error: err });
    });
});

/**
 * fetches the list of branches
 */
router.post("/get_branches", (req, res) => {
  const qry = `select id, 
                      name, 
                      is_active 
                from branch 
                where is_active = 1`;

  queryDatabaseWithPromise(conn, qry, [])
    .then(branches => {
      res.status(200).json({ branches });
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ error: err });
    });
});

/**
 * insert new branch
 */
router.post("/insert_branch", (req, res) => {
  const qry = `insert into branch (
                          name,
                          is_active,
                          update_timestamp
                      ) values (
                          ?,
                          1,
                          current_timestamp)`;
  const selectQry = `select id, 
                          name, 
                          is_active 
                    from branch 
                    where is_active = 1`;
  const name = req.body.name;
  queryDatabaseWithPromise(conn, qry, [name])
    .then(r => {
      if (r.insertId) {
        queryDatabaseWithPromise(conn, selectQry, []).then(result => {
          res.status(200).json({ branches: result });
        });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ error: err });
    });
});

/**
 * update branch name
 */
router.post("/update_branch", (req, res) => {
  const qry = `update branch 
                  set name = ?
                where id = ?`;

  const { id, name } = req.body;
  queryDatabaseWithPromise(conn, qry, [name, id])
    .then(result => {
      res.status(200).json({ success: true });
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ error: err, success: false });
    });
});

/**
 * delete branch
 */
router.post("/delete_branch", (req, res) => {
  const qry = `update branch 
                  set is_active = 0
                where id = ?`;

  const { id } = req.body;
  queryDatabaseWithPromise(conn, qry, [id])
    .then(result => {
      res.status(200).json({ success: true });
    })
    .catch(err => {
      console.error(err);
      res.status(503).json({ error: err, success: false });
    });
});

module.exports = router;
