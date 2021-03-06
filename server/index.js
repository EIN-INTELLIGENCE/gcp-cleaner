require('dotenv').config()

const express = require('express');
const compute = require('./compute');
const { logger } = require('./logger');
const app = express();
const PORT = 8080;

app.get('/', (req, res) => res.send('gcp-cleaner is running...'));

app.get('/status', (req, res) => {
  logger.info('[GET] /status');
  compute.listVMs({}, list => {
    res.send(JSON.stringify(list))
  })
});

app.get('/start', (req, res) => {
  var timestamp = Math.floor(Date.now() / 1000);
  var { name, zone, os, disk, machineType } = req.query;
  var options = {
    os: os || 'ubuntu',
    disk: disk || 'default-disk',
    machineType: machineType || 'n1-standard-4'
  };
  var name = name || 'ein-gcp-cleaner' + timestamp;
  compute.createVM(name, zone, options)
    .then(() => res.send('VM is successfully created.'))
    .catch(err => {
      logger.error(JSON.stringify(err));
      res.code(400).send(JSON.stringify(err));
    })
});

app.get('/stop', (req, res) => {
  var { name, zone } = req.query;
  logger.info(name, zone);
  compute.deleteVM(name, zone)
    .then(() => res.send('VM is successfully deleted.'))
    .catch(err => {
      logger.error(JSON.stringify(err));
      res.send(JSON.stringify(err));
    })
});

app.get('/create/disk', (req, res) => {
  var { name, snapshot, size, type, zone } = req.query;
  compute.createDisk(name, zone, snapshot, size, type)
    .then(() => res.send('Disk is successfully created.'))
    .catch(err => {
      logger.error(JSON.stringify(err));
      res.code(400).send(JSON.stringify(err));
    })
});

app.listen(PORT, function () {
  logger.info('gcp-cleaner is listening on port ' + PORT);
});
