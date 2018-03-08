const Eureca = require('eureca.io');
let client = new Eureca.Client({ uri: 'http://localhost:8000/' });

client.exports.user = function (user) {
    console.log(user);
};

client.ready(function (serverProxy) {
 
  console.log('client is ready, please type a command...');
  let readline = require('readline');
  
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', function(line){

    let args = line.split(/\s+/);
    switch(args[0]) {
      case 'uuid':
        serverProxy.user();
        break;
      default:
        console.log('that is not a command!');
    }

  });

});
