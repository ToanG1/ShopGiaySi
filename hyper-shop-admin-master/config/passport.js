const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

const authServices = require("../models/services/authService");
const userServices = require("../models/services/userService");

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    email = email.toLowerCase();
    const user = await authServices.getUserLean({ email });
    if (!user) return done(null, false, { message: "Email not exists" });
    if (!user.isAdmin)
      return done(null, false, { message: "Email not exists" });
    try {
      if (await bcrypt.compare(password, user.password)) {
        const hashPassword = await bcrypt.hash(password, 10);
        done(null, user);
      } else return done(null, false, { message: "Wrong password" });
    } catch (e) {
      return done(e);
    }
  };
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (_id, done) => {
    const user = await userServices.getUser({ _id });
    done(null, user);
  });
}

module.exports = initialize;
