const express = require("express");

const router = express.Router();
const userController = require("../controllers/user");

router.get("/profile", userController.getProfile);

router.post("/profile", userController.postProfile);

router.get("/updatepassword", userController.getUpdatePassword);

router.post("/updatepassword", userController.postUpdatePassword);

module.exports = router;
