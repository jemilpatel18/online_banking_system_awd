const express = require('express');
const router = express.Router();
const bankingController = require('../controllers/bankingController');
const auth = require('../middleware/auth');

router.post('/deposit', auth, bankingController.deposit);
router.post('/transfer', auth, bankingController.transfer);
router.get('/transactions', auth, bankingController.getTransactions);

module.exports = router;
