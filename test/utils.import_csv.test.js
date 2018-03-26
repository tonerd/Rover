const assert = require('chai').assert;
const config = require('../config.js');
const import_csv = require('../server/utils/import_csv');
const mysql = require('mysql');
const pool = mysql.createPool(config.database.test);
const rankingsSql = require('../server/sql/rankings');
const rankingsSqlApi = new rankingsSql(pool);
const sqlUtils = require('./utils/sql');
const sqlHelper = new sqlUtils(pool);
const usersSql = require('../server/sql/users');
const usersSqlApi = new usersSql(pool);
const utils = require('./utils/utils');

describe('utils.import_csv', () => {
  beforeEach((done) => {
    sqlHelper.executeProcedure('clean()', [], (error) => {
      if(error) {
        return done(error);
      }
      setTimeout(done, 1000);
    });
  });

  it('should import records', (done) => {
      import_csv.import(pool, './test/csv/shortened_reviews.csv');

      setTimeout(() => {
        //check users
        sqlHelper.executeQuery('SELECT * FROM users', (error, result) => {
          if(error) {
            return done(error);
          }

          assert.equal(result.length, 10);

          for(let i = 0; i < result.length; i++) {
              for(let j = 0; j < result[i].length; j++) {
                  switch(j) {
                    case 1:
                      assert(utils.isEmailValid(result[i][j]));
                      break;
                    case 4:
                      assert(result[i][j] === 0 || result[i][j] === 1);
                      break;
                    default:
                      assert(result[i][j].length > 0);
                      break;
                  }
              }
          }

          //check rankings
          sqlHelper.executeQuery('SELECT * FROM rankings ORDER BY rank DESC', (error, result) => {
            if(error) {
              return done(error);
            }

            assert.equal(result.length, 5);
            assert.equal(result[0].score, 1.34615)
            assert.equal(result[0].rating, 5)
            assert.equal(result[0].rank, 1.71154)
            assert.equal(result[1].score, 1.15385)
            assert.equal(result[1].rating, 5)
            assert.equal(result[1].rank, 1.53846)

            //check appointments
            sqlHelper.executeQuery('SELECT * FROM appointments ORDER BY start_date DESC', (error, result) => {
              if(error) {
                return done(error);
              }

              assert.equal(result.length, 5);
              assert.equal(result[0].start_date.toLocaleDateString(), '5/5/2013');
              assert.equal(result[0].end_date.toLocaleDateString(), '5/31/2013');
              assert.equal(result[0].dogs, 'Lego');

              //check reviews
              sqlHelper.executeQuery('SELECT * FROM reviews', (error, result) => {
                if(error) {
                  return done(error);
                }

                assert.equal(result.length, 5);
                for(let i = 0; i < result.length; i++) {
                  assert(result[i].rating > 0 && result[i].rating < 6);
                  assert(result[i].comment.length > 100);
                }

                done();
              });
            });
          });
        });
      }, 5000);
  }).timeout(20000);

  it('should return sitter score for ranking if no reviews', (done) => {
    usersSqlApi.addUser('Fake P.', 'fake@fake.com', '12312312345', 'http://someurl', 1, 1.23, (error) => {
        if(error) {
          return done(error);
        }

        rankingsSqlApi.updateRankingByEmailAddress('fake@fake.com', (error) => {
          if(error) {
            return done(error);
          }

          checkRanking('fake@fake.com', (error, result) => {
            if(error) {
              return done(error);
            }

            assert.equal(result[0].rank, 1.23);

            done();
          });
        });
    });
  });

  it('should calculate ranking properly', (done) => {
    importSingleReviewAndCheckRank((error, result) => {
      if(error) {
        return done(error);
      }

      assert.equal(result[0].rank, 2.75);

      importSingleReviewAndCheckRank((error, result) => {
        if(error) {
          return done(error);
        }

        assert.equal(result[0].rank, 3.00);

        importSingleReviewAndCheckRank((error, result) => {
          if(error) {
            return done(error);
          }

          assert.equal(result[0].rank, 3.25);

          importSingleReviewAndCheckRank((error, result) => {
            if(error) {
              return done(error);
            }

            assert.equal(result[0].rank, 3.50);

            importSingleReviewAndCheckRank((error, result) => {
              if(error) {
                return done(error);
              }

              assert.equal(result[0].rank, 3.75);

              importSingleReviewAndCheckRank((error, result) => {
                if(error) {
                  return done(error);
                }

                assert.equal(result[0].rank, 4.00);

                importSingleReviewAndCheckRank((error, result) => {
                  if(error) {
                    return done(error);
                  }

                  assert.equal(result[0].rank, 4.25);

                  importSingleReviewAndCheckRank((error, result) => {
                    if(error) {
                      return done(error);
                    }

                    assert.equal(result[0].rank, 4.50);

                    importSingleReviewAndCheckRank((error, result) => {
                      if(error) {
                        return done(error);
                      }

                      assert.equal(result[0].rank, 4.75);

                      importSingleReviewAndCheckRank((error, result) => {
                        if(error) {
                          return done(error);
                        }

                        assert.equal(result[0].rank, 5.00);

                        importSingleReviewAndCheckRank((error, result) => {
                          if(error) {
                            return done(error);
                          }

                          assert.equal(result[0].rank, 5.00);

                          importSingleReviewAndCheckRank((error, result) => {
                            if(error) {
                              return done(error);
                            }

                            assert.equal(result[0].rank, 5.00);
                            done();
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }).timeout(20000);

  it('should not add a user that exists', (done) => {
    import_csv.import(pool, './test/csv/duplicate_review.csv');

    setTimeout(() => {
      sqlHelper.executeQuery('SELECT * FROM users', (error, result) => {
        if(error) {
          return done(error);
        }

        assert.equal(result.length, 2);
        assert(result[0].email !== result[1].email);

        sqlHelper.executeQuery('SELECT * FROM rankings', (error, result) => {
          if(error) {
            return done(error);
          }

          assert.equal(result.length, 1);
          done();
        });
      });
    }, 500);
  });
});

function checkRanking(email, callback) {
  sqlHelper.executeQuery('SELECT * FROM rankings WHERE sitter_id = (SELECT id FROM users WHERE email = \'' + email + '\')', (error, result) => {
    callback(error, result);
  });
}

function importSingleReviewAndCheckRank(callback) {
  import_csv.import(pool, './test/csv/single_review.csv');

  setTimeout(() => {
    checkRanking('user4739@gmail.com', (error, result) => {
      callback(error, result);
    });
  }, 1000);
}
