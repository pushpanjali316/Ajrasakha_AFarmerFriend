// const mongoose = require('mongoose');

// const RegionSchema = new mongoose.Schema({
//   name: String,
//   coordinates: {
//     lat: Number,
//     lng: Number
//   },
//   cropType: String // Rice, Wheat, Cotton, etc.
// });

// module.exports = mongoose.model('Region', RegionSchema);

const mongoose = require('mongoose');

const RegionSchema = new mongoose.Schema({
  name: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  cropType: String,
  // 👇 Add these so Mongoose stops deleting your satellite data!
  status: { type: String, default: 'Unknown' },
  latestNDVI: { type: Number, default: 0 },
  trend: String 
});

module.exports = mongoose.model('Region', RegionSchema);