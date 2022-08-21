const { Router } = require("express");

const customerController = require('../controllers/customerController');

const router = Router();

router.get('/order-busride/:ref', customerController.order_busride)

module.exports = router;