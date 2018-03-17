const mongoose        = require('mongoose');
const User            = require('../models/user');
const crypto          = require('crypto');
const config          = require('../server.config.js');
const chalk           = require('chalk');
var uuidv4            = require('uuid/v4');

exports.getUserByLoginName = function (client, loginName) {
  return User.findOne({loginName: loginName}).exec();
}

let hashPass = function (uobj) {
  var hash = crypto.createHmac('sha512', 'rn59x@4es7q!');
  hash.update(uobj.password);
  uobj.password = hash.digest('hex');
  return uobj;
};

let validPw = function (uobj) {
  var regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

  return regex.test(uobj.password);
};

exports.createUser = function (remote, uobj) {

  let client = remote.clientProxy;
  let connection = remote.connection;

  uobj.uuid = uuidv4();

  if(uobj.password) {

    if(validPw(uobj)) {

      uobj = hashPass(uobj);

    } else {

      let msg = 
        'invalid password. must be longer than 8 characters and include ' +
        'at least one upper, one lower, one number, and one special';
      console.log(chalk.green(`[${connection.id}]`), chalk.red(msg));
      client.err(msg);
      return;
    }
  }

  User.findOne({loginName: uobj.loginName}).exec(function(err, user) {
    if(err) {

      console.log(chalk.green(`[${connection.id}]`), chalk.red(err));
      client.err(err);

    } else if(!user) {

      User.create(uobj, function(err, user) { 
        if(err) {
          console.log(chalk.green(`[${connection.id}]`), chalk.red(err));
          client.err(err);
        } else {
          console.log(chalk.green(`[${connection.id}]`), chalk.green('user created successfully!'));
          client.createdUser(user);
        }
      });

    } else {

      let msg = `user ${uobj.loginName} already exists!`;
      console.log(chalk.green(`[${connection.id}]`), chalk.red(msg));
      client.err(msg);

    }
  });
};

exports.lookup = function (remote, loginName) {
  let client = remote.clientProxy;
  let connection = remote.connection;

  User.findOne({loginName: loginName}, 
    'uuid loginName realName ip createDate editDate', 
    (err, user) => {
      if(err) {
        console.log(chalk.green(`[${connection.id}]`), chalk.red(err));
        client.err(err);
      } else {
        if(user) {
          console.log(chalk.green(`[${connection.id}]`), chalk.green('found user!'));
          client.lookup(user);
        } else {
          let msg = `user ${loginName} does not exist!`;
          console.log(chalk.green(`[${connection.id}]`), chalk.red(msg));
          client.err(msg);
        }
      }
    });
};

exports.reverseLookup = function (remote, uuid) {
  let client = remote.clientProxy;
  let connection = remote.connection;

  User.findOne({uuid: uuid}, 
    'uuid loginName realName ip createDate editDate', 
    (err, user) => {
      if(err) {
        console.log(chalk.green(`[${connection.id}]`), chalk.red(err));
        client.err(err);
      } else {
        if(user) {
          console.log(chalk.green(`[${connection.id}]`), chalk.green('found user!'));
          client.reverseLookup(user);
        } else {
          let msg = `user ${uuid} does not exist!`;
          console.log(chalk.green(`[${connection.id}]`), chalk.red(msg));
          client.err(msg);
        }
      }
    });
};

exports.delete = function (remote, loginName, password) {
  let client = remote.clientProxy;
  let connection = remote.connection;
  let uobj = {loginName: loginName, password: password};
  uobj = hashPass(uobj);

  User.findOne({loginName: uobj.loginName}, 
    (err, user) => {
      if(err) {
        console.log(chalk.green(`[${connection.id}]`), chalk.red(err));
        client.err(err);
      } else {
        if(user) {
          if(uobj.password == user.password) {
            console.log(chalk.green(`[${connection.id}]`), chalk.green('deleting user '+ loginName + '...'));
            User.findOneAndRemove({loginName: uobj.loginName, password: uobj.password},
              (err, user) => {
                if(err) {
                  console.log(chalk.green(`[${connection.id}]`), chalk.red(err));
                  client.err(err);
                } else {
                  console.log(chalk.green(`[${connection.id}]`), chalk.green('deleted user '+ user.loginName + '...'));
                  client.remove(user);      
                }
              });
          } else {
            let msg = `incorrect password for user ${loginName}!`;
            console.log(chalk.green(`[${connection.id}]`), chalk.red(msg));
            client.err(msg);
          }
        } else {
          let msg = `user ${loginName} does not exist!`;
          console.log(chalk.green(`[${connection.id}]`), chalk.red(msg));
          client.err(msg);
        }
      }
    });
};
/*exports.setNick = function (socket, args, resp) {
  let user = socket.request.session.user;

  User.findOneAndUpdate(
    {email: user.email},
    { $set: {nick: args[1]}}
  )
  .then((item, err) => {
    socket.request.session.user.nick = args[1];
    socket.emit('cmd', {args: args, res: resp, success: err ? false : true, user: socket.request.session.user});
  });
};*/

