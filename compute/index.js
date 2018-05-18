const Compute = require('@google-cloud/compute');
const compute = new Compute();

exports.listVMs = function (options, callback) {
  compute.getVMs(options, (err, vms) => {
    console.log(JSON.stringify(options), JSON.stringify(err), JSON.stringify(vms));
    if (err) {
      return callback(err);
    }
    console.log(vms);
    callback(vms);
  });
}

