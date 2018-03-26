const assert = require('chai').assert;
const scoreUtil = require('../server/utils/score');

describe('utils.score', () => {
  it('should calculate score for name', () => {
    let score = scoreUtil.calculateScore('Fred');
    assert.equal(score, 4 / 26 * 5);
  });

  it('should calculate score for name with same upper/lower case letters', () => {
    let score = scoreUtil.calculateScore('Fred f.');
    assert.equal(score, 4 / 26 * 5);
  });

  it('should calculate score for empty string', () => {
    let score = scoreUtil.calculateScore('');
    assert.equal(score, 0);
  });

  it('should calculate score for null', () => {
    let score = scoreUtil.calculateScore(null);
    assert.equal(score, 0);
  });

  it('should calculate score for string without alpha characters', () => {
    let score = scoreUtil.calculateScore('1234');
    assert.equal(score, 0);
  });

  it('should calculate score for string with every alpha character', () => {
    let score = scoreUtil.calculateScore('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    assert.equal(score, 5);
  });
});
