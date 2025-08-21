const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  username: { type: String },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minlength: 6 
  },
  image: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  isAdmin: {  // Check this field for admin users
    type: Boolean,
    default: false,  // By default, users are not admins
  },
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
