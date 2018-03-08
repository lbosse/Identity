const express       = require('express');
const app           = express();
const server        = require('http').createServer(app);
const Eureca        = require('eureca.io');
const uuidv4        = require('uuid/v4');
 
const eurecaServer  = new Eureca.Server({allow:['user']});
 
eurecaServer.attach(server);
 
//functions under "exports" namespace will be exposed to client side
eurecaServer.exports.user = function () {
  var client = this.clientProxy; 
  client.user({uuid: uuidv4()});
}
 
server.listen(8000);
