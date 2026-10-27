const mongoose = require('mongoose');

const schemeApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  applicationDate: { type: Date, default: Date.now },
  status: { type: String, required: true, enum: ['Pending', 'Approved', 'Rejected', 'Completed'], default: 'Pending' },
  amount: { type: Number },
  tenure: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create a compound index to prevent duplicate applications
schemeApplicationSchema.index({ user: 1, scheme: 1 }, { unique: true });

module.exports = mongoose.model('SchemeApplication', schemeApplicationSchema);
