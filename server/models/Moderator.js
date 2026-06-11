const mongoose = require('mongoose');

const ModeratorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  region: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Moderator', ModeratorSchema);