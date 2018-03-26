const sqlUtils = require('../utils/sql');

module.exports = function(pool) {
  const sqlHelper = new sqlUtils(pool);
  return {
    addUser: (name, email, phone, image, isSitter, score, callback) => {
      let procedure = 'add_user(?, ?, ?, ?, ?, ?)';
      sqlHelper.executeProcedure(procedure, [name, email.toLowerCase(), phone, image, isSitter, score], callback);
    }
  }
}
