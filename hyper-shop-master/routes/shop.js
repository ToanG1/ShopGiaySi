const express = require('express');

const router = express.Router();
const shopController = require('../controllers/shop');
const { getUrl } = require('../config/auth');

router.get('/', getUrl, shopController.getIndex);

module.exports = router;
