
const assert = require('chai').assert;
const config = require('../config.js');
const mysql = require('mysql');
const pool = mysql.createPool(config.database.test);
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
let comment = 'so great';
let longComment = 'abcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefabcdefgabcdefgabcdeabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefabcdefgabcdefgabcdeabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefabcdefgabcdefgabcdeabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefabcdefgabcdefgabcdeabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefabcdefgabcdefgabcdeabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefabcdefgabcdefgabcdeabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefabcdefgabcdefgabcdeabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefabcdefgabcdefgabcdeabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefabcdefgabcdefgabcdeabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefabcdefgabcdefgabcdeabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefabcdefgabcdefgabcdeabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefabcdefgabcdefgabcdeabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcdefgabcbcdefgabbcdefabcdefgabcdefgabcdeabcdefgabcdefgabcdefgabcdefgaba';

describe('sql.reviews', () => {
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
  
  it('should allow adding a review', (done) => {
    reviewsSqlApi.addReviewByEmailAddresses(sitter, owner, 4, comment, (error) => {
      if(error) {
        return done(error);
      }

      sqlHelper.executeQuery('SELECT * FROM reviews', (error, result) => {
        if(error) {
          return done(error);
        }

        assert.equal(result.length, 1);
        assert.equal(result[0].owner_id, ownerId);
        assert.equal(result[0].sitter_id, sitterId);
        assert.equal(result[0].rating, 4);
        assert.equal(result[0].comment, comment);
        done();
      });
    });
  });

  it('should throw error for long comments', (done) => {
    reviewsSqlApi.addReviewByEmailAddresses(sitter, owner, 4, longComment, (error) => {
      if(error) {
        assert(true);
        return done();
      }

      assert(false);
      done();
    });
  });

  it('should not allow invalid sitter', (done) => {
    reviewsSqlApi.addReviewByEmailAddresses('invalid', owner, 4, comment, (error) => {
      if(error) {
        assert(true);
        return done();
      }

      assert(false);
      done();
    });
  });

  it('should not allow invalid owner', (done) => {
    reviewsSqlApi.addReviewByEmailAddresses(sitter, 'invalid', 4, comment, (error) => {
      if(error) {
        assert(true);
        return done();
      }

      assert(false);
      done();
    });
  });

  it('should not allow invalid rating', (done) => {
    reviewsSqlApi.addReviewByEmailAddresses(sitter, 'invalid', 10, comment, (error) => {
      if(error) {
        assert(true);
        return done();
      }

      assert(false);
      done();
    });
  });
});
