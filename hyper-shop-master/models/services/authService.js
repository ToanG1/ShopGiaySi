const bcrypt = require("bcrypt"); //để băm pass
//từ nay mọi thao tác đến db mình sẽ làm trong folder Service, code cũ sẽ refactor sau
const User = require("../user");

exports.signup = async (newUser) => {
  //them nguoi dung
  const saltRounds = 10; //tham số để truyền vào hàm hash, 10 rất thông dụng
  const hashedPassword = await bcrypt.hash(newUser.password, saltRounds); //hash password được gửi đến server từ form
  newUser.password = hashedPassword;
  newUser.isLock = true;
  return User.create(newUser); //luu vao db
};

exports.save = async (newUser) => {
  return newUser.save(); //luu vao db
};

// trả về plain data giúp tăng performance khi chỉ cần truy vấn sự tồn tại của một user
exports.getUserLean =  (filter) => {
  return User.findOne(filter).lean();
};

exports.getUser = (filter) => {
  return User.findOne(filter);
};

//Dùng dể cập nhật password
exports.updatePassword = async (newUser) => {
  //hash password bang bcrypt
  const saltRounds = 10; //tham số để truyền vào hàm hash, 10 rất thông dụng
  const hashedPassword = await bcrypt.hash(newUser.password, saltRounds); //hash password được gửi đến server từ form
  newUser.password = hashedPassword;
  return newUser.save(); //luu vao db
};
