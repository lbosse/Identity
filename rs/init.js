const { exec } = require('child_process');
var fs = require('fs');

exec('docker ps --format "{{.Names}}" --filter label=p3', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }
  if(stdout) {
    let names = stdout.split(/\n/);
    names.pop();


    let nameStr ="";
    for(name in names) {
      nameStr += `${names[name]} `;
    }

    exec(`docker inspect ${nameStr}`, (err, stdout, stderr) => {
      let containers = JSON.parse(stdout);
      let rsInit = {
        _id: "rs0",
        members: []
      };
      for(let i = 0; i < containers.length; i++) {
        let curr = containers[i];
        let ip = curr.NetworkSettings.Networks.bridge.IPAddress;
        rsInit.members.push({_id: parseInt(i), host: `${ip}:27017`});
      }
      fs.writeFile('./rsInit.js', `rs.initiate(${JSON.stringify(rsInit)})`, function(err) {
        if(err) {
          return console.log(err);
        }
        console.log('file was saved.');
      });
      console.log(rsInit);

    });

  } else {
    console.log('No containers running!');
  }
  if(stderr != 0) {
    console.log(`stderr: ${stderr}`);
  }
});

