const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  avatar: String,
  address: {
    type: String,
  },
  phone: {
    type: String,
    minlength: 10,
    maxlength: 10,
  },
  isLock: {
    type: Boolean,
    default: 0,
  },
  isAdmin: {
    type: Boolean,
    default: 0,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
