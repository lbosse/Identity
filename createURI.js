const { exec } = require('child_process');
var fs = require('fs');
exec('docker ps --format "{{.ID}}"', (err, stdout, stderr) => {
  if(stdout) {
    let uri = "module.exports = 'mongodb://";
    // Get ids of all replica set containers
    let values = stdout.split('\n');
    values.pop(values.length - 1);
    // Create string of ids to pass docker inspect
    let idStr ="";
    for(id in values) {
      idStr += `${values[id]} `;
    }
    exec(`docker inspect ${idStr}`, (err, stdout, stderr) => {
      let containers = JSON.parse(stdout);
      for(let i = 0; i < containers.length; i++) {
        let curr = containers[i];
        // Get container IP address and add to URI
        uri += (curr.NetworkSettings.Networks.bridge.IPAddress) + ',';
      }
      uri = uri.substring(0, uri.length - 1);
      uri += "/?replicaSet=rs0';";
      console.log('Replica set connection URI:');
      console.log(uri);
      // Write replica set connetion URI to file
      fs.writeFile('./connectURI.js', uri, function(err) {
        if(err) {
          return console.log(err);
        } else {
          console.log('file was saved.');
        }
      });
    });
  } else {
    console.log('No containers running!');
  }
  if(stderr != 0) {
    console.log(`stderr: ${stderr}`);
  }
});
