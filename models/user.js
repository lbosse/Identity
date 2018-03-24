var mongoose  = require('mongoose');
var crypto    = require('crypto');
var config    = require('../server.config');

if(process.env.NODE_ENV === 'production') {
  mongoose.connect(config.mongo.prod.uri);
} else {
  mongoose.connect(config.mongo.dev.uri);
}

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
});

if (!userSchema.options.toObject) userSchema.options.toObject = {};
userSchema.options.toObject.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  delete ret._id;
  delete ret.__v;
  return ret;
}

var User = mongoose.model('User', userSchema);

module.exports = User;
