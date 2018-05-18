require('dotenv').config()

const express = require('express');
const compute = require('./compute');
const app = express();
const PORT = 8080;

var simpleGetResHandler = (path, message) => {
  app.get(path, (req, res) => res.send(message))
};

simpleGetResHandler('/', 'gcp-cleaner is running...');

app.get('/stop/:name', (req, res) => {
  compute.deleteVM(req.params.name, 'us-central1-c')
    .then(() => res.send('VM is successfully deleted.'))
    .catch(err => {
      console.error(err)
      res.code(400).send(JSON.stringify(err))
    })
});

app.get('/start', (req, res) => {
  var timestamp = Math.floor(Date.now() / 1000);
  compute.createVM('ein-gcp-cleaner' + timestamp, 'us-central1-c', { os: 'ubuntu' })
    .then(() => res.send('VM is successfully created.'))
    .catch(err => {
      console.error(err)
      res.code(400).send(JSON.stringify(err))
    })
});

app.get('/status', (req, res) => {
  compute.listVMs({}, list => {
    res.send(JSON.stringify(list))
  })
});

app.listen(PORT, function () {
  console.log('gcp-cleaner is listening on port ' + PORT);
});
