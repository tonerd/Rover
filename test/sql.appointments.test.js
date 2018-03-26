const assert = require('chai').assert;
const config = require('../config.js');
const mysql = require('mysql');
const pool = mysql.createPool(config.database.test);
const appointmentsSql = require('../server/sql/appointments');
const appointmentsSqlApi = new appointmentsSql(pool);
const sqlUtils = require('./utils/sql');
const sqlHelper = new sqlUtils(pool);
const usersSql = require('../server/sql/users');
const usersSqlApi = new usersSql(pool);

const sitter = 'testa@test.com';
const owner = 'testb@test.com';

let ownerId = null;
let sitterId = null;
let start = new Date();
let end = new Date();
let dogName = 'fido';
end.setDate(end.getDate() + 1);

describe('sql.appointments', () => {
  before((done) => {
    sqlHelper.executeProcedure('clean()', [], (error) => {
      if(error) {
        return done(error);
      }
      setTimeout(() => {
        usersSqlApi.addUser('test a', sitter, '123456789', 'http://test', 1, 2, (error) => {
          if(error) {
            return done(error);
          }

          usersSqlApi.addUser('test b', owner, '123456789', 'http://test', 0, null, (error) => {
            if(error) {
              return done(error);
            }

            sqlHelper.executeQuery('SELECT id FROM users WHERE email IN(\'' + sitter + '\', \'' + owner + '\') ORDER BY email', (error, result) => {
              if(error) {
                return done(error);
              }
              sitterId = result[0].id;
              ownerId = result[1].id;
              done();
            });
          });
        })
      }, 1000);
    });
  });

  it('should allow adding an appointment', (done) => {
    appointmentsSqlApi.addAppointmentByEmailAddresses(sitter, owner, start, end, dogName, (error) => {
      if(error) {
        return done(error);
      }

      sqlHelper.executeQuery('SELECT * FROM appointments', (error, result) => {
        if(error) {
          return done(error);
        }

        assert.equal(result.length, 1);
        assert.equal(result[0].owner_id, ownerId);
        assert.equal(result[0].sitter_id, sitterId);
        assert.equal(result[0].start_date.toDateString(), start.toDateString());
        assert.equal(result[0].end_date.toDateString(), end.toDateString());
        assert.equal(result[0].dogs, dogName);
        done();
      });
    });
  });

  it('should throw error for long dog names', (done) => {
    let name = 'abcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefabcdefgabcdefgabcde';

    appointmentsSqlApi.addAppointmentByEmailAddresses(sitter, owner, start, end, name, (error) => {
      if(error) {
        assert(true);
        return done();
      }

      assert(false);
      done();
    });
  });

  it('should not allow invalid sitter id', (done) => {
    appointmentsSqlApi.addAppointmentByEmailAddresses(52, owner, start, end, dogName, (error) => {
      if(error) {
        assert(true);
        return done();
      }

      assert(false);
      done();
    });
  });

  it('should not allow invalid owner id', (done) => {
    appointmentsSqlApi.addAppointmentByEmailAddresses(sitter, 52, start, end, dogName, (error) => {
      if(error) {
        assert(true);
        return done();
      }

      assert(false);
      done();
    });
  });

  it('should not allow invalid start date', (done) => {
    appointmentsSqlApi.addAppointmentByEmailAddresses(sitter, owner, 1, end, dogName, (error) => {
      if(error) {
        assert(true);
        return done();
      }

      assert(false);
      done();
    });
  });

  it('should not allow invalid end date', (done) => {
    appointmentsSqlApi.addAppointmentByEmailAddresses(sitter, owner, start, 1, dogName, (error) => {
      if(error) {
        assert(true);
        return done();
      }

      assert(false);
      done();
    });
  });

  it('should not allow start date greater than end date', (done) => {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() + 10);
    appointmentsSqlApi.addAppointmentByEmailAddresses(sitter, owner, startDate, end, dogName, (error) => {
      if(error) {
        return done(error);
      }

      sqlHelper.executeQuery('SELECT * FROM appointments', (error, result) => {
        if(error) {
          return done(error);
        }

        assert.equal(result.length, 1);
        done();
      });
    });
  });
});
