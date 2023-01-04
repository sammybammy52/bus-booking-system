const { Router } = require("express");
const { requireAuth } = require('../middleware/authMiddleware')

const customerController = require('../controllers/customerController');

const router = Router();

//logged in and guest access

router.get('/order-busride/:ref', customerController.order_busride)
router.get('/prev-trips', requireAuth, customerController.tripHistory);

module.exports = router;