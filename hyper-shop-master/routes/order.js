const express = require('express');

const router = express.Router();
const orderController = require('../controllers/order');

router.get('/', orderController.getOrder);
router.post('/', orderController.postOrder);

module.exports = router;
