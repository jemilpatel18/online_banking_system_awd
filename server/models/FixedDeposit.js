const mongoose = require('mongoose');

const fixedDepositSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 1000 },
  interestRate: { type: Number, required: true, min: 0 },
  duration: { type: Number, required: true, min: 1, validate: Number.isInteger },
  interest: { type: Number, required: true, min: 0 },
  maturityAmount: { type: Number, required: true, min: 1000 },
  maturityDate: { type: Date, required: true },
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FixedDeposit', fixedDepositSchema);
