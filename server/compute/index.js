const Compute = require('@google-cloud/compute');
const compute = new Compute();


var nameResolver = {
  zone: (name) => name || process.env.GCLOUD_ZONE,
  disk: (name, zone) => 'projects/' + process.env.GCLOUD_PROJECT + '/zones/' + zone + '/disks/' + name,
  snapshot: (name) => 'projects/' + process.env.GCLOUD_PROJECT + '/global/snapshots/' + name,
  diskType: (type, zone) => 'projects/' + process.env.GCLOUD_PROJECT + '/zones/' + zone + '/diskTypes/' + (type || 'pd-ssd')
}

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
  var zone = compute.zone(nameResolver.zone(zone));
  var name = name || 'gce-vm';
  var { os, machineType, disk } = options;
  var diskSource = nameResolver.disk(disk, zone.name);
  var config = {
    machineType: machineType || 'n1-standard-4',
    disks: [
      {
        type: 'PERSISTENT',
        boot: true,
        mode: 'READ_WRITE',
        autoDelete: true,
        deviceName: name,
        source: diskSource
      }
    ],
  };
  console.log('Creating VM ' + name + ' config : ' + JSON.stringify(config));
  return zone.createVM(name, config)
    .then(data => {
      const vm = data[0];
      const operation = data[1];
      return operation.promise();
    });
};

exports.deleteVM = (name, zone) => {
  var zone = compute.zone(nameResolver.zone(zone));
  var vm = zone.vm(name);
  return vm.delete()
    .then(data => {
      console.log('Deleting ' + name + '...');
      const operation = data[0];
      return operation.promise();
    });
};

exports.createDisk = (name, zone, snapshot, size, type) => {
  var zone = compute.zone(nameResolver.zone(zone));
  var config = {
    sourceSnapshot: nameResolver.snapshot(snapshot),
    sizeGb: size,
    type: nameResolver.diskType(type, zone.name),
  };
  return zone.createDisk(name, config)
    .then(data => {
      console.log('Creating disk ' + name + '...');
      const vm = data[0];
      const operation = data[1];
      return operation.promise();
    });
};
