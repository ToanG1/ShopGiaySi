const bcrypt = require("bcrypt");

exports.getLogin = (req, res, next) => {
  res.status(200).render("auth/login", {
    pageTitle: "Login",
    user: req.user,
  });
};
