const sittersSql = require('../sql/sitters');

module.exports = (app, pool) => {
  const sittersSqlApi = new sittersSql(pool);

  //Retrieve list of sitters by page, filtered by minimum rank
  //Returns list of sitters with image, name, and rating, and total records
  //Post body has parameters start (position to retrieve in total list),
  //size (number of items to retrieve), and minRating (minimum rating to filter on)
  app.post('/api/sitters', (req, res) => {
    if(req.body.start === undefined || req.body.size === undefined || req.body.minRating === undefined) {
      return res.status(400).send({ error: 'Invalid parameters' });
    }

    sittersSqlApi.getSittersByPageAndRating(req.body.start, req.body.size, req.body.minRating, (error, result) => {
      if(error || !result[0] || !result[1]) {
        return res.status(500).send({ error: 'Could not retrieve sitters' });
      }

      res.send({ list: result[0], total: result[1][0].total });
    })
  });
}
