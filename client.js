// for unauthorized (self signed) certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const Eureca        = require('eureca.io');
const chalk         = require('chalk');
const validUrl      = require('valid-url');
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
let uris;
let currentUri = 0;
let exportables = {};

uris = process.argv[2].split(',');

if(!validUrl.isHttpsUri(uris[0])) {
  console.log('HTTPS REQUIRED TO CONNECT TO SERVER');
  printUsageAndExit();
}

//create new client and auto connect to the uri
let client = new Eureca.Client({
  uri: uris[0],
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
exportables.user = function (user) {
  console.log(user);
  if(rl)
    rl.prompt();
  else
    exit(client, 1);
};

exportables.shutdown = () => {
  
    let curr = client.settings.uri;
    let select = 0;

    for(let i = 0; i < uris.length; i++) {
      if(uris[i] == curr) {
        select = i;
        break;
      }
    }
    
    currentUri = 0;

    client.disconnect();

    let newClient = new Eureca.Client({
      uri: uris[select+1],
      transport: 'faye'
    });

    newClient.ready(onReady);
    newClient.exports = exportables;
    newClient.onError(onError);
    newClient.onConnectionLost(onConnectionLost);
    newClient.onConnectionRetry(onConnectionRetry);
    newClient.onDisconnect(onDisconnect);
    newClient.onConnect(onConnect);

    client = newClient;
    newClient = null;

}

//create user response handler
exportables.createdUser = function(uuid) {
  console.log(chalk.green('user created successfully!'));
  console.log('uuid: ' + uuid);
  if(rl)
    rl.prompt();
  else
    exit(client, 1);
}

//lookup response handler
exportables.lookup = function(user) {
  console.log(chalk.green(`found ${user.loginName}!`));
  console.log(user);
  if(rl)
    rl.prompt();
  else
    exit(client, 1);
}

//reverse lookup response handler
exportables.reverseLookup = function(user) {
  console.log(chalk.green(`found ${user.uuid}!`));
  console.log(user);
  if(rl)
    rl.prompt();
  else
    exit(client, 1);
}

//delete response handler
exportables.remove = function(user) {
  console.log(chalk.green(`user ${user.loginName} deleted!`));
  if(rl)
    rl.prompt();
  else
    exit(client, 1);
}

//modify response handler
exportables.modify = function(oldLoginName, user) {
  console.log(chalk.green(`user ${oldLoginName} successfully updated!`));
  console.log(user);
  if(rl)
    rl.prompt();
  else
    exit(client, 1);
}

//get response handler
exportables.get = function(results) {
  console.log(chalk.green('successfully retrieved requested information!'));
  console.log(results);
  if(rl)
    rl.prompt();
  else
    exit(client, 1);
}

//error response handler
exportables.err = function(err) {
  console.log(chalk.red(err));
  if(rl)
    rl.prompt();
  else
    exit(client, 1);
}

client.exports = exportables;

//Configure client
let onReady = function (serverProxy) {

  currentUri = -1;
  
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

};

client.ready(onReady);

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
      exit(client, 1);
      break;
    default:
      cmdFail(stop, rl, client);
  }
};

let onConnect = function (connection) {
  console.log(
    'Incomming connection from server',
    connection.socket.url.host
  );
};

client.onConnect(onConnect);

// all message middleware, good for debugging
/*client.onMessage(function (data) {
    console.log('Received data', data);
});*/

let onError = (e) => {

  if(currentUri < uris.length-1) {
    currentUri++;

    console.log(uris[currentUri]);

    client.disconnect();

    let newClient = new Eureca.Client({
      uri: uris[currentUri],
      transport: 'faye'
    });

    newClient.ready(onReady);
    newClient.exports = exportables;
    newClient.onError(onError);
    newClient.onConnectionLost(onConnectionLost);
    newClient.onConnectionRetry(onConnectionRetry);
    newClient.onDisconnect(onDisconnect);
    newClient.onConnect(onConnect);
    
    client = newClient;
    newClient = null;
    
  } else {
    console.log(chalk.red('client error:'), e.message);
    //exit(client);
  }
};

client.onError(onError);

let onConnectionLost = function () {
  //exit(client);
};
client.onConnectionLost(onConnectionLost);

let onConnectionRetry = function (socket) {
  console.log('retrying ...');

};
client.onConnectionRetry(onConnectionRetry);

let onDisconnect = function (socket) {
  console.log('Client disconnected.');
};
client.onDisconnect(onDisconnect);

// Shutdown hook
process.on('SIGINT', function() {
  exit(client);
});

function printUsageAndExit() {
  console.log('USAGE: node client.js <server-host-uri> [--<command> ...]');
  process.exit(0); 
}

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
