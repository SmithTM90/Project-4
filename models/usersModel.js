var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

userSchema.methods.authenticated = function(password, callback) {
  var user = this;
  var isAuthenticated = bcrypt.compareSync(password, user.password);
  console.log(isAuthenticated);

  callback(null, isAuthenticated ? user : false)
};

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    next();
  } else {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
  }
});

module.exports = mongoose.model('users', userSchema);