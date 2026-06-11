const mongoose = require('mongoose');

const CropDataSchema = new mongoose.Schema({
  regionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Region' },
  timestamp: { type: Date, default: Date.now },
  
  // These fields match your Frontend Dashboard EXACTLY
  metrics: {
    ndvi: Number,        // 0.0 - 1.0
    ndwiScore: Number,   // 0.0 - 1.0
    healthScore: Number, // 0.0 - 1.0
    status: String,      // "Healthy", "Critical"
    trend: String,       // "improving", "stable"
    weeklyChange: String // "+5%"
  }
});

module.exports = mongoose.model('CropData', CropDataSchema);