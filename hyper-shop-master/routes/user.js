const express = require("express");

const router = express.Router();
const userController = require("../controllers/user");

router.get("/profile", userController.getProfile);

router.post("/profile", userController.postProfile);

router.get("/checkPassword/", userController.getCheckPassword);

router.post("/checkPassword/", userController.createToken);

router.get("/updatepassword/:token", userController.getUpdatePassword);

router.post("/updatepassword/:token", userController.postUpdatePassword);

module.exports = router;
