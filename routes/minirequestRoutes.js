const { Router } = require("express");

const minirequestController = require('../controllers/minirequestController');

const router = Router();

router.get('/all-states&parks', minirequestController.allstates)

router.post('/all-parks', minirequestController.allparks)

router.post('/all-trips', minirequestController.alltrips)





module.exports = router;