const sqlUtils = require('../utils/sql');

module.exports = function(pool) {
  const sqlHelper = new sqlUtils(pool);
  return {
    addReviewByEmailAddresses: (sitterEmail, ownerEmail, rating, comment, callback) => {
      let procedure = 'add_review_by_email_addresses(?, ?, ?, ?)';
      sqlHelper.executeProcedure(procedure, [sitterEmail, ownerEmail, rating, comment], callback);
    }
  }
}
