module.exports = function(pool) {
  return {
    executeProcedure: (procedure, parameters, callback) => {
      pool.getConnection((error, connection) => {
        if (error) {
          connection.release();
          return callback(error);
        }

        connection.query('CALL ' + procedure, parameters, (error, result) => {
          connection.release();
          if(error) {
            return callback(error);
          }

          callback(null, result);
        });
      });
    }
  }
}
