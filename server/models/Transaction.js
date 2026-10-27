const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sender: { type: String },
  receiver: { type: String },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  status: { type: String, default: 'Success' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
