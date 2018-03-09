const mongoose        = require('mongoose');
const User            = require('../models/user');
const crypto          = require('crypto');
const config          = require('../server.config.js');
var uuidv4            = require('uuid/v4');

exports.getUserByEmail = function (email) {
  return User.findOne({email: email}).exec();
};

exports.createUser = function (client, uobj) {
  uobj.uuid = uuidv4();
  uobj = exports.hashPass(uobj);
  var newUser = new User(uobj);
  newUser.save(newUser).then((err, uobj) => {
    err ? console.log(err) : client.createdUser(uobj);
  });
};

exports.setNick = function (socket, args, resp) {
  let user = socket.request.session.user;

  User.findOneAndUpdate(
    {email: user.email},
    { $set: {nick: args[1]}}
  )
  .then((item, err) => {
    socket.request.session.user.nick = args[1];
    socket.emit('cmd', {args: args, res: resp, success: err ? false : true, user: socket.request.session.user});
  });
};

exports.hashPass = function (uobj) {
  var hash = crypto.createHmac('sha512', 'rn59x@4es7q!');
  hash.update(uobj.password);
  uobj.password = hash.digest('hex');
  return uobj;
};

exports.validPw = function (uobj) {
  var regex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
  return regex.test(uobj.password);
};
