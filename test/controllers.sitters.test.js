const assert = require('chai').assert;
const config = require('../config.js');
const import_csv = require('../server/utils/import_csv');
const mysql = require('mysql');
const pool = mysql.createPool(config.database.test);
const request = require('request');
const sqlUtils = require('./utils/sql');
const sqlHelper = new sqlUtils(pool);

describe('controllers.sitters', () => {
  before((done) => {
    sqlHelper.executeProcedure('clean()', [], (error) => {
      if(error) {
        return done(error);
      }
      setTimeout(done, 1000);
    });
  });
  
  describe('/api/sitters', () => {
    it('should retrieve empty array if no records exist', done => {
      getSittersList(0, 10, 1, (error, response, result) => {
        if (error) {
          return done(error);
        }

        assert.equal(result.list.length, 0);
        assert.equal(result.total, 0);
        done();
      });
    });

    it('should return an error for invalid start', (done) => {
      getSittersList("bad", 10, 1, (error, response, result) => {
        if (error) {
          return done(error);
        }

        assert(result.error);
        done();
      });
    });

    it('should return an error for invalid size', (done) => {
      getSittersList(4, "bad", 1, (error, response, result) => {
        if (error) {
          return done(error);
        }

        assert(result.error);
        done();
      });
    });

    it('should return an error for invalid minRank', (done) => {
      getSittersList(0, 10, "bad", (error, response, result) => {
        if (error) {
          return done(error);
        }

        assert(result.error);
        done();
      });
    });

    it('should return empty list if minRank exceeds max rating', (done) => {
      getSittersList(0, 10, 5, (error, response, result) => {
        if (error) {
          return done(error);
        }

        assert.equal(result.list.length, 0);
        done();
      });
    });

    it('should retrieve list as specified', (done) => {
      import_csv.import(pool, './test/csv/reviews.csv');
      setTimeout(() => {
        getSittersList(0, 10, 1, (error, response, result) => {
          if (error) {
            return done(error);
          }
          assert.equal(result.list.length, 10);
          assert.equal(result.total, 62);
          done();
        });
      }, 10000);
    }).timeout(20000);

    it('should retrieve subsequent pages correctly', (done) => {
      getSittersList(0, 10, 1, (error, response, result) => {
        if (error) {
          return done(error);
        }

        assert.equal(result.list.length, 10);

        getSittersList(10, 10, 1, (error, response, result2) => {
          if (error) {
            return done(error);
          }

          assert.equal(result2.list.length, 10);

          let table = {};
          for(let i = 0; i < result.list.length; i++) {
            table[result.list[i].name] = true;
          }

          for(let i = 0; i < result2.list.length; i++) {
            assert(table[result2.list[i].name] === undefined);
          }
          done();
        });
      });
    });

    it('should retrieve empty list if start is greater than total', (done) => {
      getSittersList(100, 10, 1, (error, response, result) => {
        if (error) {
          return done(error);
        }

        assert.equal(result.list.length, 0);
        done();
      });
    });

    it('should retrieve number of items specified', (done) => {
      getSittersList(0, 7, 1, (error, response, result) => {
        if (error) {
          return done(error);
        }

        assert.equal(result.list.length, 7);
        done();
      });
    });
  });
});

function getSittersList(start, size, minRating, callback) {
  request.post({ url: 'http://localhost:3000/api/sitters',
    json: { start: start, size: size, minRating: minRating }
  }, (error, response, result) => {
    callback(error, response, result);
  });
}
