exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/login");
};

exports.checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect("/");
  next();
};
