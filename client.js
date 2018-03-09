const Eureca = require('eureca.io');
let client = new Eureca.Client({ uri: process.argv[2] });

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
    
    let desc = {
      uuid: "creates a uuid"
    };

    switch(args[0]) {
      case 'uuid':
        serverProxy.uuid();
        break;
      case 'help':
        console.log('list of commands');
        console.log('-- help');
        console.log('---- prints out this prompt');
        for(k in serverProxy)
          console.log('--',k);
          console.log('----',desc[k]);
        break;
      default:
        console.log('that is not a command!');
    }

  });

});

client.onConnect(function (connection) {
    console.log('Incomming connection from server', connection.socket.url.host);
});

// all message middleware, good for debugging
/*client.onMessage(function (data) {
    console.log('Received data', data);
});*/

client.onError(function (e) {
    console.log('error', e);
});

client.onConnectionLost(function () {
    console.log('connection lost ... will try to reconnect');
});

client.onConnectionRetry(function (socket) {
    console.log('retrying ...');

});

client.onDisconnect(function (socket) {
    console.log('Client disconnected ', connection.id);

});
