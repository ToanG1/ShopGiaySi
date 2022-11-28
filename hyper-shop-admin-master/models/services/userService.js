const User = require("../user");
const bcrypt = require("bcrypt");

exports.getUser = (filter) => {
  return User.findOne(filter);
};

exports.getUsers = (filter) => {
  return User.find(filter);
};
exports.countUsers = async () => {
  const users = await User.find({ isLock: false, isAdmin: false });
  console.log(users);
  let count = 0;
  for (let user of users) {
    count += 1;
  }
  return count;
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
