var mongoose = require('mongoose');
var localPlugin = require('passport-local-mongoose');

var userSchema = mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    username: String,
    password: String
});

userSchema.plugin(localPlugin);

module.exports = mongoose.model('User', userSchema);
