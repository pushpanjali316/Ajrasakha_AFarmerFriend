// server/models/Insight.js
const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  title: String,
  cause: String,
  prediction: String,
  tags: [String], // Array of strings like ["Nutrients", "Recovery"]
  difficulty: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Insight', insightSchema);