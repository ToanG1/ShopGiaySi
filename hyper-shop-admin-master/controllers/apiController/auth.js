const passport = require("passport");
exports.postLoginApi = async (req, res, next) => {
  let isSuccess = false;
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send({ isSuccess, info });
    }

    // req / res held in closure
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      isSuccess = true;
      return res.send({ isSuccess, info });
    });
  })(req, res, next);
};
