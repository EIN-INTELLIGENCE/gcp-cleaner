require('dotenv').config()

const express = require('express');
const compute = require('./compute');
const app = express();
const PORT = 8080;

var simpleGetResHandler = function (path, callback) {
  app.get(path, callback)
};

simpleGetResHandler('/', (req, res) => res.send('gcp-cleaner is running...'));
simpleGetResHandler('/start', (req, res) => res.send('start'));
simpleGetResHandler('/stop', (req, res) => res.send('stop'));
simpleGetResHandler('/status', (req, res) => compute.listVMs({}, list => res.send(JSON.stringify(list))));

app.listen(PORT, function () {
  console.log('gcp-cleaner is listening on port ' + PORT);
});
