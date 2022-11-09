const mongoose = require("mongoose");
const validator = require("validator");

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
    validate: [validator.isEmail, new Error("invalid email")],
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  verifyToken: String,
  verifyTokenExpiration: Date,
  avatar: String,
  address: {
    type: String,
    //required: true, tạm thời comment vì form đăng kí k có địa chỉ
  },
  phone: {
    type: String,
    minlength: 10,
    maxlength: 10,
  },
  isLock: {
    type: Boolean,
    default: 1,
  },
  isAdmin: {
    type: Boolean,
    default: 0,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
