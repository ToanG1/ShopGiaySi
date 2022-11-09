const bcrypt = require("bcrypt");
//từ nay mọi thao tác đến db mình sẽ làm trong folder Service, code cũ sẽ refactor sau
const User = require("../user");

exports.newUser = (user) => {
  return new User(user);
};

exports.saveUser = (user) => {
  return user.save();
};

exports.getUser = (filter) => {
  return User.findOne(filter);
};

exports.updateProfile = async (newProfile) => {
  const user = await User.findById(newProfile._id);
  user.address = newProfile.address;
  user.name = newProfile.name;
  user.phone = newProfile.phone;
  return user.save();
};

exports.updatePassword = async (newProfile) => {
  const user = await User.findById(newProfile._id);
  user.password = await bcrypt.hash(newProfile.password, 10);
  return user.save();
};
