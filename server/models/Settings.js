const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  fdInterestRate: { type: Number, default: 15 }
});

module.exports = mongoose.model('Settings', settingsSchema);
