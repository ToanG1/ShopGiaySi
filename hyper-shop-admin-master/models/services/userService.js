const User = require("../user");
const bcrypt = require("bcrypt");

exports.getUser = (filter) => {
  return User.findOne(filter);
};

exports.getUsers = (filter) => {
  return User.find(filter);
};
exports.getUsersApi = (filter) => {
  return User.find(filter).select("email name _id isLock isAdmin");
};

exports.Block_Unblock = async (_id) => {
  const user = await User.findById(_id);
  user.isLock = user.isLock ? "false" : "true";
  return user.save();
};

exports.updatePassword = async (newProfile) => {
  const user = await User.findById(newProfile._id);
  user.password = await bcrypt.hash(newProfile.password, 10);
  return user.save();
};
