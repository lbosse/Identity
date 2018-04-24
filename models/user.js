var mongoose  = require('mongoose');
var crypto    = require('crypto');
var config    = require('../server.config');

mongoose.connect(config.mongo.uri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {});

var userSchema = mongoose.Schema({
  uuid: String,
  loginName: String,
  realName: {type: String, default: null},
  password: {type: String, default: null},
  ip: {type: String, default: null},
  createDate: {type: Date, default: Date.now},
  editDate: {type: Date, default: Date.now},
}, {safe: {w: 'majority', j: true, wtimeout:10000 }});

if (!userSchema.options.toObject) userSchema.options.toObject = {};
userSchema.options.toObject.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  delete ret._id;
  delete ret.__v;
  return ret;
}

var User = mongoose.model('User', userSchema);

module.exports = User;
