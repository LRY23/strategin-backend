const mongoose = require('mongoose');


const usersSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  token: String,
});

const User = mongoose.model('users', usersSchema);

module.exports = User;