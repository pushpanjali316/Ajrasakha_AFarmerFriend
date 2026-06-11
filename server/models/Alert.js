const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  crop: String,      // "Cotton"
  type: String,      // "Health", "Moisture"
  severity: String,  // "high", "medium", "low"
  message: String,
  action: String,
  date: String,      // "2 hours ago" (Keeping it string for MVP simplicity)
  status: { type: String, default: 'active' } // "active" or "completed"
});

module.exports = mongoose.model('Alert', AlertSchema);