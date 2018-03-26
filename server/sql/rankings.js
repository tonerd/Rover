const sqlUtils = require('../utils/sql');

module.exports = function(pool) {
  const sqlHelper = new sqlUtils(pool);
  return {
    updateRankingByEmailAddress: (email, callback) => {
      let procedure = 'update_ranking_by_email_address(?)';
      sqlHelper.executeProcedure(procedure, [email], callback);
    }
  }
}
