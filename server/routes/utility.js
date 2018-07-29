function queryDatabaseWithPromise(conn, qry, params) {
  return new Promise((resolve, reject) => {
    conn.query(qry, params, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = {
  queryDatabaseWithPromise
};
