const express = require("express");
const passport = require("passport");

const router = express.Router();
const authController = require("../controllers/auth");
const { checkAuthenticated, checkNotAuthenticated } = require("../config/auth");

router.get("/signup", checkNotAuthenticated, authController.getSignup);
router.post("/signup", checkNotAuthenticated, authController.signup);
router.get("/signin", checkNotAuthenticated, authController.getSignin);

router.post(
  "/signin",
  checkNotAuthenticated,
  passport.authenticate("local", {
    failureRedirect: "/auth/signin",
    failureFlash: true,
  }),
  authController.signin
);
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/signin");
  });
});

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

router.get("/verify/:verifyToken", authController.emailVerify);

module.exports = router;
