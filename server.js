const express       = require('express');
const app           = express();
const server        = require('http').createServer(app);
const Eureca        = require('eureca.io');
const uuidv4        = require('uuid/v4');
 
const eurecaServer  = new Eureca.Server({allow:['user']});
 
eurecaServer.attach(server);
 
//functions under "exports" namespace will be exposed to client side
eurecaServer.exports.uuid = function () {
  
  var client = this.clientProxy; 
  var connection = this.connection;
  
  console.log(`[${connection.id}]`, 'requested uuid, generating...');

  client.user({uuid: uuidv4()});

};

eurecaServer.onConnect(function (connection) {

  var client = connection.clientProxy;

  console.log(`[${connection.id}]`, 'client connected');

});

//all messages middleware, good for debugging
/*eurecaServer.onMessage(function (msg) {
    console.log('RECV', msg);
});*/


eurecaServer.onDisconnect(function (connection) {
  console.log(`[${connection.id}]`, 'client disconnected');
});

eurecaServer.onError(function (e) {
    console.log('an error occured', e);
});
 
server.listen(8000);
