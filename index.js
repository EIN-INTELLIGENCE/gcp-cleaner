async = require('async');

const express = require('express');
const app = express();
const PORT = 8080;

var simpleGetResHandler = function (path, message) {
  app.get(path, function (req, res) {
    res.send(path + ' ' + message);
  })
};

simpleGetResHandler('/', 'gcp-cleaner is running...');
simpleGetResHandler('/start', 'running...');
simpleGetResHandler('/stop', 'running...');
simpleGetResHandler('/status', 'running...');

app.listen(PORT, function () {
  console.log('gcp-cleaner is listening on port ' + PORT);
});
