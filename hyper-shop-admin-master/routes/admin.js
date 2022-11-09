const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");

router.get("/", adminController.getAdminList);

// router.get("/", adminController.getAdmins);
router.get("/profile", adminController.getProfile);
router.post("/profile", adminController.postProfile);

router.get("/updatepassword", adminController.getUpdatePassword);
router.post("/updatepassword", adminController.postUpdatePassword);

router.get("/add", adminController.getAddAdmin);
router.post("/add", adminController.addAdmin);
router.get("/:id([0-9a-fA-F]{24})", adminController.getAdmin);

router.get("/revenue", adminController.getRevenue);
router.post("/get-revenue-dates", adminController.getRevenueDates);
router.post("/get-revenue-month", adminController.getRevenueDates);
router.post("/get-revenue-year", adminController.getRevenueMonth);

module.exports = router;
