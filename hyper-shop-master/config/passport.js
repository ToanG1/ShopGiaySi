const LocalStrategy = require("passport-local"); //một trong những stragegy của passport, local là auth dùng username(mình sẽ đổi thành email) password
const bcrypt = require("bcrypt");

const authService = require("../models/services/authService");
const userService = require("../models/services/userService");

function initialize(passport) {
  const isValidPassword = (user, password) => {
    return bcrypt.compare(password, user.password);
  };

  //dùng trong sign in
  const authenticateUser = async (email, password, done) => {
    try {
      email = email.toLowerCase();
      const user = await authService.getUserLean({ email }); //lean() trả về plain data, mình chỉ cần xác định sự tồn tại của user

      if (!user) {
        return done(null, false, {
          message: "Email hoặc mật khẩu không chính xác",
        });
      }
      if (user.isAdmin)
        return done(null, false, {
          message: "Email hoặc mật khẩu không chính xác",
        });
      if (user.isLock) {
        return done(null, false, {
          message: "Tài khoản bị khóa hoặc chưa được xác thực",
        });
      }

      const matchPassword = await isValidPassword(user, password);

      if (!matchPassword) {
        return done(null, false, {
          message: "Email hoặc mật khẩu không chính xác",
        });
      }
      return done(null, user);
    } catch (e) {
      return done(e);
      //done(error,user,optional)
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (_id, done) => {
    const user = await userService.getUser({ _id }); //lấy user từ db băng id lưu trong session()
    done(null, user);
  });
}

module.exports = initialize;
