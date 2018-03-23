// for unauthorized (self signed) certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const Eureca        = require('eureca.io');
const chalk         = require('chalk');
let readline        = require('readline');
var stringArgv      = require('string-argv');

let create          = require('./commands').create;
let lookup          = require('./commands').lookup;
let reverseLookup   = require('./commands').reverseLookup;
let remove          = require('./commands').remove;
let modify          = require('./commands').modify;
let get             = require('./commands').get;
let help            = require('./commands').help;
let exit            = require('./commands').exit;
let cmdFail         = require('./commands').cmdFail;

let query;
let rl;

//create new client and auto connect to the uri
let client = new Eureca.Client({
  uri: process.argv[2],
  transport: 'faye'
});

//one-off predefined command
if(process.argv.length >= 4) {
  query = process.argv.slice(3);
}

//otherwise, start the repl
else {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.setPrompt(chalk.cyan('$ '));
}

//values in exports namespace are available on serverside

//uuid print function for testing RPC
client.exports.user = function (user) {
  console.log(user);
  if(rl)
    rl.prompt();
  else
    exit(client);
};

client.exports.shutdown = function() {
  console.log(chalk.red('server is shutting down... disconnecting'));
  client.disconnect();
}

//create user response handler
client.exports.createdUser = function(uuid) {
  console.log(chalk.green('user created successfully!'));
  console.log('uuid: ' + uuid);
  if(rl)
    rl.prompt();
  else
    exit(client);
}

//lookup response handler
client.exports.lookup = function(user) {
  console.log(chalk.green(`found ${user.loginName}!`));
  console.log(user);
  if(rl)
    rl.prompt();
  else
    exit(client);
}

//reverse lookup response handler
client.exports.reverseLookup = function(user) {
  console.log(chalk.green(`found ${user.uuid}!`));
  console.log(user);
  if(rl)
    rl.prompt();
  else
    exit(client);
}

//delete response handler
client.exports.remove = function(user) {
  console.log(chalk.green(`user ${user.loginName} deleted!`));
  if(rl)
    rl.prompt();
  else
    exit(client);
}

//modify response handler
client.exports.modify = function(oldLoginName, user) {
  console.log(chalk.green(`user ${oldLoginName} successfully updated!`));
  console.log(user);
  if(rl)
    rl.prompt();
  else
    exit(client);
}

//get response handler
client.exports.get = function(results) {
  console.log(chalk.green('successfully retrieved requested information!'));
  console.log(results);
  if(rl)
    rl.prompt();
  else
    exit(client);
}

//error response handler
client.exports.err = function(err) {
  console.log(chalk.red(err));
  if(rl)
    rl.prompt();
  else
    exit(client);
}

//Configure client
client.ready(function (serverProxy) {
  
  if(query) {
    printTitle();
    console.log(chalk.green('client is ready, issuing query...'));
    let args = query;
    command(args, serverProxy);
  } else {
    printTitle();
    console.log(chalk.green('client is ready, please type a command or help for a list of commands.'));

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
    case '--lookup':
    case 'lookup':
      lookup(args, serverProxy, client, stop);
      break;
    case '--reverse-lookup':
    case 'reverseLookup':
      reverseLookup(args, serverProxy, client, stop);
      break;
    case '--delete':
    case 'delete':
      remove(args, serverProxy, client, stop);
      break;
    case '--modify':
    case 'modify':
      modify(args, serverProxy, client, stop);
      break;
    case '--get':
    case 'get':
      get(args, serverProxy, client, stop);
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
  console.log(
    'Incomming connection from server',
    connection.socket.url.host
  );
});

// all message middleware, good for debugging
/*client.onMessage(function (data) {
    console.log('Received data', data);
});*/

client.onError(function (e) {
  console.log(chalk.red('client error:'), e.message);
  exit(client);
});

client.onConnectionLost(function () {
  exit(client);
});

client.onConnectionRetry(function (socket) {
  console.log('retrying ...');

});

client.onDisconnect(function (socket) {
  console.log('Client disconnected.');
});

// Shutdown hook
process.on('SIGINT', function() {
  exit(client);
});

let printTitle = function() {
  console.log(
    chalk.green(`   ___    _            _   _ _\n`),
    chalk.green(` |_ _|__| | ___ _ __ | |_(_) |_ _   _\n`),
    chalk.green(`  | |/ _\` |/ _ \\ '_ \\| __| | __| | | |\n`),
    chalk.green(`  | | (_| |  __/ | | | |_| | |_| |_| |\n`),
    chalk.green(` |___\\__,_|\\___|_| |_|\\__|_|\\__|\\__, |\n`),
    chalk.green(`                                |___/`)
  );
  console.log(
    chalk.green(`    ____ _ _            _\n`),
    chalk.green(`  / ___| (_) ___ _ __ | |_\n`),
    chalk.green(` | |   | | |/ _ \\ '_ \\| __|\n`),
    chalk.green(` | |___| | |  __/ | | | |_\n`),
    chalk.green(`  \\____|_|_|\\___|_| |_|\\__|\n`)
  );
};
