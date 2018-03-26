const assert = require('chai').assert;
const config = require('../config.js');
const mysql = require('mysql');
const pool = mysql.createPool(config.database.test);
const rankingsSql = require('../server/sql/rankings');
const rankingsSqlApi = new rankingsSql(pool);
const reviewsSql = require('../server/sql/reviews');
const reviewsSqlApi = new reviewsSql(pool);
const sqlUtils = require('./utils/sql');
const sqlHelper = new sqlUtils(pool);
const usersSql = require('../server/sql/users');
const usersSqlApi = new usersSql(pool);

const sitter = 'testa@test.com';
const owner = 'testb@test.com';

let ownerId = null;
let sitterId = null;

describe('sql.rankings', () => {
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
  
  it('should not update with invalid sitter', (done) => {
    sqlHelper.executeQuery('SELECT * FROM rankings', (error, result) => {
      if(error) {
        return done(error);
      }

      assert.equal(result.length, 1);

      rankingsSqlApi.updateRankingByEmailAddress('invalid', (error) => {
        if(error) {
          return done(error);
        }

        sqlHelper.executeQuery('SELECT * FROM rankings', (error, result2) => {
          if(error) {
            return done(error);
          }

          assert.equal(result2.length, 1);
          assert.equal(result[0].sitter_id, result2[0].sitter_id)
          assert.equal(result[0].score, result2[0].score)
          assert.equal(result[0].rating, result2[0].rating)
          assert.equal(result[0].rank, result2[0].rank)
          done();
        });
      });
    });
  });

  it('should update ranking accordingly', (done) => {
    reviewsSqlApi.addReviewByEmailAddresses(sitter, owner, 4, 'so great', (error) => {
      if(error) {
        return done(error);
      }

      rankingsSqlApi.updateRankingByEmailAddress(sitter, (error) => {
        if(error) {
          return done(error);
        }

        sqlHelper.executeQuery('SELECT * FROM rankings', (error, result) => {
          if(error) {
            return done(error);
          }

          assert.equal(result.length, 1);
          assert.equal(result[0].sitter_id, sitterId);
          assert.equal(result[0].rating, 4);
          assert.equal(result[0].rank, 2.2);
          done();
        });
      });
    });
  });

  it('should average review scores when a review is added', (done) => {
    reviewsSqlApi.addReviewByEmailAddresses(sitter, owner, 2, 'so great', (error) => {
      if(error) {
        return done(error);
      }

      rankingsSqlApi.updateRankingByEmailAddress(sitter, (error) => {
        if(error) {
          return done(error);
        }

        sqlHelper.executeQuery('SELECT * FROM rankings', (error, result) => {
          if(error) {
            return done(error);
          }

          assert.equal(result.length, 1);
          assert.equal(result[0].sitter_id, sitterId);
          assert.equal(result[0].rating, 3);
          assert.equal(result[0].rank, 2.2);
          done();
        });
      });
    });
  });
});
