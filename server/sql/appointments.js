const sqlUtils = require('../utils/sql');

module.exports = function(pool) {
  const sqlHelper = new sqlUtils(pool);
  return {
    addAppointmentByEmailAddresses: (sitterEmail, ownerEmail, startDate, endDate, dogs, callback) => {
      let procedure = 'add_appointment_by_email_addresses(?, ?, ?, ?, ?)';
      sqlHelper.executeProcedure(procedure, [sitterEmail, ownerEmail, startDate, endDate, dogs], callback);
    }
  }
}
