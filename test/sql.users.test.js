const assert = require('chai').assert;
const config = require('../config.js');
const mysql = require('mysql');
const pool = mysql.createPool(config.database.test);
const sqlUtils = require('./utils/sql');
const sqlHelper = new sqlUtils(pool);
const usersSql = require('../server/sql/users');
const usersSqlApi = new usersSql(pool);

const sitter = 'testa@test.com';
const owner = 'testb@test.com';

let ownerId = null;
let sitterId = null;

let invalidImage = 'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij12345abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij12345abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij12345abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij12345abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij12345abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij12345abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij12345abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij12345abcdefghijabcdefghijabcdefghijabcdefghij1234';

describe('sql.users', () => {
  before((done) => {
    sqlHelper.executeProcedure('clean()', [], (error) => {
      if(error) {
        return done(error);
      }
      setTimeout(done, 1000);
    });
  });

  it('should allow adding owner', (done) => {
    usersSqlApi.addUser('test a', owner, '123456789', 'http://test', 0, null, (error) => {
      if(error) {
        return done(error);
      }

      sqlHelper.executeQuery('SELECT * FROM users LEFT JOIN rankings ON users.id = rankings.sitter_id WHERE email = \'' + owner  + '\'', (error, result) => {
        if(error) {
          return done(error);
        }

        assert.equal(result.length, 1);
        assert.equal(result[0].name, 'test a');
        assert.equal(result[0].phone, '123456789');
        assert.equal(result[0].image, 'http://test');
        assert.equal(result[0].sitter, 0);
        assert.equal(result[0].score, null);
        done();
      });
    });
  });

  it('should allow adding sitter', (done) => {
    usersSqlApi.addUser('test b', sitter, '123456789', 'http://test', 1, 3.2, (error) => {
      if(error) {
        return done(error);
      }

      sqlHelper.executeQuery('SELECT * FROM users LEFT JOIN rankings ON users.id = rankings.sitter_id WHERE email = \'' + sitter  + '\'', (error, result) => {
        if(error) {
          return done(error);
        }

        assert.equal(result.length, 1);
        assert.equal(result[0].name, 'test b');
        assert.equal(result[0].phone, '123456789');
        assert.equal(result[0].image, 'http://test');
        assert.equal(result[0].sitter, 1);
        assert.equal(result[0].score, 3.2);
        done();
      });
    });
  });

  it('should throw error for invalid name', (done) => {
    usersSqlApi.addUser('abcdefghijabcdefghijabcdefghijabcdefghijabcdefghij1', 'testz@test.com', '123456789', 'http://test', 1, 3.2, (error) => {
      if(error) {
        assert(true);
        return done();
      }

      assert(false);
      done();
    });
  });

  it('should throw error for invalid email', (done) => {
    usersSqlApi.addUser('test a', 'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij12345', '123456789', 'http://test', 1, 3.2, (error) => {
      if(error) {
        assert(true);
        return done();
      }

      assert(false);
      done();
    });
  });

  it('should throw error for invalid phone', (done) => {
    usersSqlApi.addUser('test a', 'testx@test.com', '1234567890123456789012345678901', 'http://test', 1, 3.2, (error) => {
      if(error) {
        assert(true);
        return done();
      }

      assert(false);
      done();
    });
  });

  it('should throw error for invalid image', (done) => {
    usersSqlApi.addUser('test a', 'testv@test.com', '1234567890123', invalidImage, 1, 3.2, (error) => {
      if(error) {
        assert(true);
        return done();
      }

      assert(false);
      done();
    });
  });

  it('should throw error for invalid sitter flag', (done) => {
    usersSqlApi.addUser('test a', 'testu@test.com', '1234567890123', 'http://test', 128, 3.2, (error) => {
      if(error) {
        assert(true);
        return done();
      }

      assert(false);
      done();
    });
  });
});
