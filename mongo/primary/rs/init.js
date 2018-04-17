const { exec } = require('child_process');
var fs = require('fs');

exec("ip a| grep -Eo 'inet (addr:)?([0-9]*\\.){3}[0-9]*' | grep -Eo '([0-9]*\\.){3}[0-9]*' | grep -v '127.0.0.1'", (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return console.log(err);
  }

  if(stdout) {
    
      let ip = stdout.substring(0, stdout.length-1);

      let rsInit = {
        _id: "rs0",
        members: [{_id: 0, host: `${ip}:27017` }]
      };

      fs.writeFile('/rs/rsInit.js', `rs.initiate(${JSON.stringify(rsInit)})`, function(err) {
        if(err) {
          return console.log(err);
        }
        console.log('file was saved.');
      });

  }

  if(stderr != 0) {
    console.log(`stderr: ${stderr}`);
  }

});

