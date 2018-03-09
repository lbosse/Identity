const Eureca  = require('eureca.io');
const chalk   = require('chalk');
const parse   = require('shell-quote').parse;
let client    = new Eureca.Client({ uri: process.argv[2] });


let readline = require('readline');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.setPrompt(chalk.blue('$ '));

client.exports.user = function (user) {
  console.log(user);
  rl.prompt();
};

client.exports.createdUser = function(user) {
  console.log(user);
  rl.prompt();
}

client.ready(function (serverProxy) {

  console.log(chalk.green('client is ready, please type a command...'));
  rl.prompt();

  rl.on('line', function(line){
    let args = line.split(/\s+/);

    let desc = {
      uuid: 'creates a uuid',
      createUser: 'creates a new user' 
    };

    switch(args[0]) {
      case 'uuid':
        serverProxy.uuid();
        break;
      case 'create':
        let user = {};
        let re = /"(.*?)"/;
        args = line.split(re).filter( (arg) => {
          return (arg != ' ' && arg != '');
        });
        let argLength = args.length;
        if(argLength == 4) {
         user.password = args[3];
        }
        if(argLength >= 3) {
         user.realName = args[2];
        }
        if(argLength >= 2) {
          user.loginName = args[1]
        }
        serverProxy.createUser(user);
        break;
      case 'help':
        console.log(chalk.blue('list of commands'));
        console.log(chalk.green('-- help'));
        console.log('---- prints out this prompt');
        console.log(chalk.green('-- exit'));
        console.log('---- shuts down the client gracefully');
        for(k in serverProxy) {
          console.log('--',chalk.green(k));
          console.log('----',desc[k]);
        }
        break;
      case 'exit':
        console.log(chalk.red('exiting client...'));
        process.exit(0);
        break;
      default:
        console.log(chalk.red('that is not a command!'));
    }

    rl.prompt();

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
