const Eureca    = require('eureca.io');
const chalk     = require('chalk');
let readline    = require('readline');
let create      = require('./commands').create;
let help        = require('./commands').help;
let exit        = require('./commands').exit;
let cmdFail     = require('./commands').cmdFail;
var stringArgv  = require('string-argv');

let client      = new Eureca.Client({
  uri: process.argv[2],
});
let query;
let rl;

if(process.argv.length >= 4) {

  query = process.argv.slice(3);

} else {

  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.setPrompt(chalk.blue('$ '));


}

client.exports.user = function (user) {
  console.log(user);
  if(rl)
    rl.prompt();
  else
    exit(client);
};

client.exports.createdUser = function(user) {
  console.log(chalk.green('user created successfully!'));
  console.log(user);
  if(rl)
    rl.prompt();
  else
    exit(client);
}

client.exports.err = function(err) {
  console.log(chalk.red(err));
  if(rl)
    rl.prompt();
  else
    exit(client);
}

client.ready(function (serverProxy) {

  
  if(query) {
    console.log(chalk.green('client is ready, issuing query...'));
    let args = query;
    command(args, serverProxy);
  } else {
    console.log(chalk.green('client is ready, please type a command...'));

    rl.prompt();

    rl.on('line', function(line){
      
      let args = stringArgv(line);
       
      command(args, serverProxy);

      rl.prompt();

    });
  }

});

let command = function(args, serverProxy) {
  let stop = rl ? false:true;
  switch(args[0]) {
    case 'uuid':
      serverProxy.uuid();
      break;
    case '--create':
    case 'createUser':
      create(args, serverProxy, client, stop);
      break;
    case 'help':
      help(args, serverProxy, client, stop);
      break;
    case 'exit':
      exit(client);
      break;
    default:
      cmdFail(stop, rl, client);
  }

};

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

/*client.onConnectionLost(function () {
  console.log('connection lost ... will try to reconnect');
});*/

/*
client.onConnectionRetry(function (socket) {
  console.log('retrying ...');

});
*/

client.onDisconnect(function (socket) {
  console.log('Client disconnected.');
});

