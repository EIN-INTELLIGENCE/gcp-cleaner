const Compute = require('@google-cloud/compute');
const compute = new Compute();

exports.listVMs = (options, callback) => {
  compute.getVMs(options, (err, vms) => {
    console.log(JSON.stringify(options), JSON.stringify(err), JSON.stringify(vms));
    if (err) {
      return callback(err);
    }
    console.log(vms);
    callback(vms);
  });
};

exports.createVM = (name, zone, options) => {
  var zone = compute.zone(zone || process.env.GCLOUD_ZONE);
  var name = name || 'gce-vm';
  var { os } = options;
  return zone.createVM(name, { os: os || 'ubuntu' })
    .then(data => {
      const vm = data[0];
      const operation = data[1];
      return operation.promise();
    });
};

exports.deleteVM = (name, zone) => {
  var zone = compute.zone(zone);
  var vm = zone.vm(name);
  return vm.delete()
    .then(data => {
      console.log('Deleting ' + name + '...');
      const operation = data[0];
      return operation.promise();
    });
};

exports.createDisk = (name, zone, snapshot, size, type) => {
  var zone = compute.zone(zone || process.env.GCLOUD_ZONE);
  var config = {
    "sourceSnapshot": 'projects/' + process.env.GCLOUD_PROJECT + '/global/snapshots/' + snapshot,
    "sizeGb": size,
    "type": 'projects/' + process.env.GCLOUD_PROJECT + '/zones/' + zone.name + '/diskTypes/' + (type || 'pd-ssd'),
  };
  return zone.createDisk(name, config)
    .then(data => {
      console.log('Creating disk ' + name + '...');
      const vm = data[0];
      const operation = data[1];
      return operation.promise();
    });
};
