const stickyCluster = require('sticky-cluster')(function(callback) {
  
  const chalk         = require('chalk');
  const intercept     = require('intercept-stdout');
  intercept(function(txt) {
    let str = chalk.magenta('[WORKER '+ process.env.stickycluster_worker_index + '] ') +txt;
    return txt.includes('Primus') ? '' : str; 
  });

  const express       = require('express');
  const app           = express();
  const server        = require('http').createServer(app);
  const Eureca        = require('eureca.io');
  const uuidv4        = require('uuid/v4');
  const userCont      = require('./controllers/user');
    
  const eurecaServer  = new Eureca.Server({
    allow:['user', 'createdUser', 'lookup','reverseLookup', 
    'remove', 'modify', 'err'],
    iknowclusterwillbreakconnections: true,
  });
   
  eurecaServer.attach(server);
   
  //functions under "exports" namespace will be exposed to client side
  eurecaServer.exports.uuid = function () {
    
    let client = this.clientProxy; 
    let connection = this.connection;
    
    console.log(chalk.green(`[${connection.id}]`), 'requested uuid, generating...');

    client.user({uuid: uuidv4()});

  };

  eurecaServer.exports.createUser = function (user) {
    let client = this.clientProxy; 
    let connection = this.connection;
    console.log(chalk.green(`[${connection.id}]`), 'requested user creation...');
    userCont.createUser(this, user);
  }

  eurecaServer.exports.lookup = function(loginName) {
    let client = this.clientProxy;
    let connection = this.connection;
    console.log(chalk.green(`[${connection.id}]`), 'looking up user ' + loginName + '...');
    userCont.lookup(this, loginName);
  }

  eurecaServer.exports.reverseLookup = function(uuid) {
    let client = this.clientProxy;
    let connection = this.connection;
    console.log(chalk.green(`[${connection.id}]`), 'looking up user ' + uuid + '...');
    userCont.reverseLookup(this, uuid);
  }

  eurecaServer.exports.delete = function(loginName, password) {
    let client = this.clientProxy;
    let connection = this.connection;
    console.log(chalk.green(`[${connection.id}]`), 'attempting to delete user ' + loginName + '...');
    userCont.delete(this, loginName, password);
  }

  eurecaServer.exports.modify = function(oldLoginName, newLoginName, password) {
    let client = this.clientProxy;
    let connection = this.connection;
    userCont.modify(this, oldLoginName, newLoginName, password);
  }

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
  
  callback(server);

},
{
  concurrency: 4,
  port: 8000,
  debug: false,
  env: function (index) { return { stickycluster_worker_index: index }; }
});
//server.listen(8000);
