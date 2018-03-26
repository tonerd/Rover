const bodyParser = require('body-parser');
const cluster = require('cluster');
const config = require('./config.js');
const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const import_csv = require('./server/utils/import_csv');
const mysql = require('mysql');
const os = require('os');
const path = require('path');

let environment = 'development';

if(process.env.NODE_ENV) {
  environment = process.env.NODE_ENV;
}

const pool = mysql.createPool(config.database[environment]);
const port = process.env.PORT || 3000;

if(environment !== 'production' || cluster.isMaster) {
    if(process.argv[2] === 'import') {
      import_csv.import(pool, './reviews.csv');
    }
}

if (environment === 'production' && cluster.isMaster) {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }

  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    cluster.fork();
  });
}
else {
  const app = express();

  /*** Security Headers ***/
  app.use(helmet());
  app.use(helmet.contentSecurityPolicy({ directives: config.contentSecurityPolicy }));

  app.use(express.static(__dirname + '/public'));
  app.use(bodyParser.json());

  /*** Index route ***/
  app.get('/', (req, res) => res.render('index'));

  /*** Controllers ***/
  const controllersDirectory = path.join(__dirname, 'server', 'controllers');
  fs.readdirSync(controllersDirectory).forEach(fileName => {
    let controller = require(path.join(controllersDirectory, fileName));
    controller(app, pool);
  });

  app.listen(port);
}
