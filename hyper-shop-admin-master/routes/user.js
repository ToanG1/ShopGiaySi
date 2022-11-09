const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.get("/", userController.getUserList);

router.get("/:userId([0-9a-fA-F]{24})", userController.getUserDetail);

module.exports = router;
