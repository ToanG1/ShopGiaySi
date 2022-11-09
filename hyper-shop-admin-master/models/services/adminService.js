const bcrypt = require("bcrypt");
const User = require("../user");

exports.getAdmins = () => {
  return User.find({ isAdmin: true });
};

exports.getAdmin = async (filter) => {
  const admin = await User.findOne(filter);
  if (admin && admin.isAdmin) return admin;
  return undefined;
};

exports.addAdmin = async (newAdmin) => {
  //kiem tra email da ton tai?
  const user = await User.findOne({ email: newAdmin.email });
  if (user) {
    throw new Error("Email already registered");
  }
  //them nguoi dung
  const saltRounds = 10; //tham số để truyền vào hàm hash, 10 rất thông dụng
  const hashedPassword = await bcrypt.hash(newAdmin.password, saltRounds); //hash password được gửi đến server từ form
  newAdmin.password = hashedPassword;
  newAdmin.isAdmin = true;
  return User.create(newAdmin); //luu vao db
};

exports.updateProfile = async (newProfile) => {
  const user = await User.findById(newProfile._id);
  user.address = newProfile.address;
  user.name = newProfile.name;
  user.phone = newProfile.phone;
  return user.save();
};
