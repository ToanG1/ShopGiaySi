const User = require("../user");

exports.getUserLean = (filter) => {
  return User.findOne(filter).lean();
};
