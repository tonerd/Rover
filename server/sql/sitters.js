const sqlUtils = require('../utils/sql');

module.exports = function(pool) {
  const sqlHelper = new sqlUtils(pool);
  return {
    getSittersByPageAndRating: (start, size, minRating, callback) => {
      let procedure = 'get_sitters_by_page_and_rank(?, ?, ?)';
      sqlHelper.executeProcedure(procedure, [start, size, minRating], callback);
    }
  }
}
