const { exec } = require('child_process');
var fs = require('fs');

let id = parseInt(process.argv[2]);

exec("ip a| grep -Eo 'inet (addr:)?([0-9]*\\.){3}[0-9]*' | grep -Eo '([0-9]*\\.){3}[0-9]*' | grep -v '127.0.0.1'", (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return console.log(err);
  }

  if(stdout) {
      
      let ip = stdout.substring(0, stdout.length-1);

      let rsAdd = {_id: id, host: `${ip}:27017`, priority: 0, votes: 0 };

      fs.writeFile(`/rs/rsAdd${ip}.js`, `rs.add(${JSON.stringify(rsAdd)})`, function(err) {
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

