const chalk         = require('chalk');
const fs            = require('fs');
const uuidv4        = require('uuid/v4');
const intercept     = require('intercept-stdout');
const userCont      = require('./controllers/user');
const stickyCluster = require('sticky-cluster')(function(callback) {


  //intercept stdout and add worker tags
  intercept(function(txt) {
    let str = chalk.magenta('[WORKER '+ process.env.stickycluster_worker_index + '] ') +txt;
    return txt.includes('Primus') ? '' : str;
    //return str;
  });

  //create express app
  const express       = require('express');
  const app           = express();

  //create options and include keys for web server
  const options       = {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.crt'),
    ca: fs.readFileSync('./ssl/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
  };

  //bind express app to https server
  const server        = require('https').createServer(options, app);

  //force the use of https on the web server
  const forceSSL      = require('./ssl/forceSSL');
  app.use(forceSSL);

  //configure eureca RPC server
  const Eureca        = require('eureca.io');
  const eurecaOptions = {
    allow:[
      'user', 
      'createdUser', 
      'lookup',
      'reverseLookup', 
      'remove',
      'modify', 
      'get',
      'err',
      'shutdown'
    ],
    transport: 'faye' 
  };
  const eurecaServer  = new Eureca.Server(eurecaOptions);
  eurecaServer.attach(server);

  //functions under "exports" namespace will be exposed to client side
  
  //A UUID generator test function
  eurecaServer.exports.uuid = function () {
    let client = this.clientProxy; 
    let connection = this.connection;
    console.log(
      chalk.green(`[${connection.id}]`), 
      'requested uuid, generating...'
    );
    client.user({uuid: uuidv4()});

  };

  //Create a user
  eurecaServer.exports.createUser = function (user) {
    let client = this.clientProxy; 
    let connection = this.connection;
    console.log(
      chalk.green(`[${connection.id}]`),
      'requested user creation...'
    );
    userCont.createUser(this, user);
  }

  //Lookup a user
  eurecaServer.exports.lookup = function(loginName) {
    let client = this.clientProxy;
    let connection = this.connection;
    console.log(
      chalk.green(`[${connection.id}]`),
      'looking up user ' + loginName + '...'
    );
    userCont.lookup(this, loginName);
  }

  //reverse lookup a user by UUID
  eurecaServer.exports.reverseLookup = function(uuid) {
    let client = this.clientProxy;
    let connection = this.connection;
    console.log(
      chalk.green(`[${connection.id}]`),
      'looking up user ' + uuid + '...'
    );
    userCont.reverseLookup(this, uuid);
  }

  //delete a user
  eurecaServer.exports.delete = function(loginName, password) {
    let client = this.clientProxy;
    let connection = this.connection;
    console.log(
      chalk.green(`[${connection.id}]`),
      'attempting to delete user ' + loginName + '...'
    );
    userCont.delete(this, loginName, password);
  }

  //modify a user
  eurecaServer.exports.modify = function(oldLoginName, newLoginName, password) {
    let client = this.clientProxy;
    let connection = this.connection;
    console.log(
      chalk.green(`[${connection.id}]`),
      'attempting to modify user ' + loginName + '...'
    );
    userCont.modify(this, oldLoginName, newLoginName, password);
  }

  //get existing user list
  eurecaServer.exports.get = function(arg) {
    let client = this.clientProxy;
    let connection = this.connection;
    console.log(
      chalk.green(`[${connection.id}]`),
      'retrieving information...'
    );
    userCont.get(this, arg);
  }

  //Server side event handlers
  eurecaServer.onConnect(function (connection) {
    let client = connection.clientProxy;
    console.log(chalk.green(`[${connection.id}]`), 'client connected');
  });

  //all messages middleware, good for debugging
  /*eurecaServer.onMessage(function (msg) {
      console.log('RECV', msg);
  });*/

  eurecaServer.onDisconnect(function (connection) {
    console.log(chalk.green(`[${connection.id}]`), 'client disconnected');
  });

  eurecaServer.onError(function (e) {
    console.log('an error occured', e);
  });

  process.on('SIGINT', function() {
    let connections = eurecaServer.ioServer.primus.connections;
    for(k in connections) {
      console.log(
        chalk.red('closing connection for'),
        chalk.green(`[${k}].`)
      );
      eurecaServer.getClient(k).shutdown();
    }
    process.exit(0);
  });

  process.on('exit', function() {
    console.log(chalk.red('shutting down server...'));
  });

  //start the server listening with sticky sessions (by IP)
  callback(server);

},
{
  concurrency: 4,
  port: 8443,
  debug: false,
  env: function (index) { return { stickycluster_worker_index: index }; }
});
  
process.on('SIGINT', function() {
  process.exit(0);
});

/*process.on('exit', function() {
  console.log(chalk.red('\nshutting down parent server...')); 
});*/

