module.exports = {
  contentSecurityPolicy: {
    connectSrc: ["'self'"],
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'"],
    imgSrc: ["'self'", 'http://placekitten.com']
  },

  database: {
    development:  {
      connectionLimit : 10,
      host : 'localhost',
      user : 'rover',
      password : 'password',
      database : 'rover'
    },

    production: {
      connectionLimit : 10,
      host : 'localhost',
      user : 'rover',
      password : 'password',
      database : 'rover'
    },

    test:  {
      connectionLimit : 10,
      host : 'localhost',
      user : 'rover_test',
      password : 'password',
      database : 'rover_test'
    },
  }
}
