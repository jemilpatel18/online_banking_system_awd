const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const auth = require('../middleware/auth');

router.get('/', settingsController.getFDRate);
router.put('/', auth, settingsController.updateFDRate);

module.exports = router;
