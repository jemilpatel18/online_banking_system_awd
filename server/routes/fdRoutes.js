const express = require('express');
const router = express.Router();
const fdController = require('../controllers/fdController');
const auth = require('../middleware/auth');

router.post('/', auth, fdController.createFD);
router.get('/', auth, fdController.getAllFDs);
router.delete('/:id', auth, fdController.deleteFD);

module.exports = router;
