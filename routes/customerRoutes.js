const { Router } = require("express");

const customerController = require('../controllers/customerController');

const router = Router();

router.post('/order-busride', customerController.order_busride)

module.exports = router;