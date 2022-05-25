const { Router } = require("express");

const minirequestController = require('../controllers/minirequestController');

const router = Router();

router.get('/all-states', minirequestController.allstates)

router.post('/all-parks', minirequestController.allparks)



module.exports = router;