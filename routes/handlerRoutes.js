const { Router } = require("express");

const handlerController = require('../controllers/handlerController');

const router = Router();

router.post('/create-trip', handlerController.create_trip)

module.exports = router;