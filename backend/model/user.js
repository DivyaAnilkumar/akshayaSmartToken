const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('user', UserSchema);