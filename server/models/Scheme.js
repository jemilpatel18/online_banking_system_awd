const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['regular', 'festival'] },
  category: { type: String, required: true }, // e.g., 'FD', 'RD', 'Savings', etc.
  description: { type: String, required: true },
  benefits: { type: String, required: true },
  eligibility: { type: String, required: true },
  interestRate: { type: Number },
  tenure: { type: String }, // e.g., '1-5 years', '9 days', etc.
  minAmount: { type: Number, default: 0 },
  maxAmount: { type: Number },
  status: { type: String, required: true, enum: ['Active', 'Upcoming', 'Expired'], default: 'Active' },
  startDate: { type: Date },
  endDate: { type: Date },
  festivalYear: { type: Number }, // For festival schemes to track year
  icon: { type: String }, // Emoji or icon name
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scheme', schemeSchema);
