// // const seedDB = async () => {
// //   // 1. CLEAR OLD DATA
// //   await Region.deleteMany({});
// //   await CropData.deleteMany({});
// //   await Alert.deleteMany({}); // Clear alerts too

// //   // 2. CREATE REGIONS (Map Dots)
// //   // We added Corn (Karnataka) and Soybean (Madhya Pradesh)
// //   const regions = await Region.insertMany([
// //     { name: "Punjab Sector A",    coordinates: { lat: 30.9, lng: 75.8 }, cropType: "Rice" },
// //     { name: "Vidarbha Zone 1",    coordinates: { lat: 21.1, lng: 79.0 }, cropType: "Cotton" },
// //     { name: "Haryana Belt",       coordinates: { lat: 29.0, lng: 76.0 }, cropType: "Wheat" },
// //     { name: "Karnataka Fields",   coordinates: { lat: 15.3, lng: 75.7 }, cropType: "Corn" },
// //     { name: "MP Soybean Belt",    coordinates: { lat: 23.2, lng: 77.4 }, cropType: "Soybean" }
// //   ]);

// //   console.log("📍 Created 5 Regions");

// //   // 3. CREATE INITIAL DATA FOR EACH REGION
// //   for (const region of regions) {
// //     const fakeData = fetchSatelliteData(region.cropType);
// //     await CropData.create({
// //       regionId: region._id,
// //       metrics: fakeData
// //     });
// //   }
// //   console.log("📊 Satellite Data Generated");

// //   // 4. CREATE ALERTS
// //   await Alert.insertMany([
// //     { crop: "Cotton", type: "Health", severity: "high", message: "NDVI dropped by 15%. Pest risk.", action: "Apply organic pesticide.", date: "2h ago", status: "active" },
// //     { crop: "Rice", type: "Moisture", severity: "medium", message: "Soil moisture low.", action: "Initiate irrigation.", date: "5h ago", status: "active" },
// //     { crop: "Corn", type: "Health", severity: "low", message: "Minor yellowing observed.", action: "Check nitrogen levels.", date: "1d ago", status: "active" }
// //   ]);
// //   console.log("🚨 Alerts Seeded!");

// //   console.log("✅ Database Fully Seeded!");
// //   process.exit();
// // };

// // seedDB();


// // server/seed.js
// const mongoose = require('mongoose');
// const Region = require('./models/Region'); // Ensure this points to your actual model file

// // Replace with your actual local MongoDB connection string if it is different!
// const MONGO_URI = "mongodb://localhost:27017/Hackathon_db";

// const seedRegions = [
//   {
//     name: "Thanjavur Rice Belt (Tamil Nadu)",
//     coordinates: { lat: 11.1271, lng: 78.6569 },
//     cropType: "Rice"
//   },
//   {
//     name: "Godavari Basin (Andhra Pradesh)",
//     coordinates: { lat: 15.9129, lng: 79.7400 },
//     cropType: "Rice"
//   },
//   {
//     name: "Dharwad Farms (Karnataka)",
//     coordinates: { lat: 15.3173, lng: 75.7139 },
//     cropType: "Cotton"
//   },
//   {
//     name: "Palakkad Gap (Kerala)",
//     coordinates: { lat: 10.8505, lng: 76.2711 },
//     cropType: "Rice"
//   },
//   {
//     name: "Ludhiana Fields (Punjab)",
//     coordinates: { lat: 31.1471, lng: 75.3412 },
//     cropType: "Wheat"
//   }
// ];

// mongoose.connect(MONGO_URI)
//   .then(async () => {
//     console.log("📦 Connected to MongoDB.");

//     // 1. Wipe the slate clean (deletes Haryana and old ghost data)
//     await Region.deleteMany({});
//     console.log("🧹 Cleared out old, mismatched regions.");

//     // 2. Insert the perfectly aligned markers
//     await Region.insertMany(seedRegions);
//     console.log("✅ Successfully seeded 5 new state-aligned regions!");

//     // Exit the script successfully
//     mongoose.connection.close();
//     process.exit(0);
//   })
//   .catch(err => {
//     console.error("❌ Database connection error:", err);
//     process.exit(1);
//   });

// server/seed.js
const mongoose = require('mongoose');
const Region = require('./models/Region'); 
const Alert = require('./models/Alert'); // Make sure you have this model!

// Replace with your actual local MongoDB connection string if different
const MONGO_URI = "mongodb://localhost:27017/Hackathon_db";

const seedRegions = [
  {
    name: "Thanjavur Rice Belt (Tamil Nadu)",
    coordinates: { lat: 11.1271, lng: 78.6569 },
    cropType: "Rice",
    status: "Healthy",
    latestNDVI: 0.72,
    trend: "improving"
  },
  {
    name: "Godavari Basin (Andhra Pradesh)",
    coordinates: { lat: 15.9129, lng: 79.7400 },
    cropType: "Rice",
    status: "Moderate",
    latestNDVI: 0.45,
    trend: "declining"
  },
  {
    name: "Dharwad Farms (Karnataka)",
    coordinates: { lat: 15.3173, lng: 75.7139 },
    cropType: "Cotton",
    status: "Critical",
    latestNDVI: 0.25,
    trend: "declining"
  },
  {
    name: "Palakkad Gap (Kerala)",
    coordinates: { lat: 10.8505, lng: 76.2711 },
    cropType: "Rice",
    status: "Healthy",
    latestNDVI: 0.68,
    trend: "stable"
  },
  {
    name: "Ludhiana Fields (Punjab)",
    coordinates: { lat: 31.1471, lng: 75.3412 },
    cropType: "Wheat",
    status: "Healthy",
    latestNDVI: 0.81,
    trend: "improving"
  }
];

const seedAlerts = [
  { 
    crop: "Cotton", 
    type: "Health", 
    severity: "high", 
    message: "NDVI dropped critically in Dharwad. Pest risk high.", 
    action: "Dispatch drone survey immediately.", 
    date: "Just now", 
    status: "active" 
  },
  { 
    crop: "Rice", 
    type: "Moisture", 
    severity: "medium", 
    message: "Moderate moisture stress in Godavari Basin.", 
    action: "Increase irrigation cycle by 15%.", 
    date: "2h ago", 
    status: "active" 
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("📦 Connected to MongoDB.");

    // 1. WIPE OLD DATA
    await Region.deleteMany({});
    await Alert.deleteMany({});
    // await CropData.deleteMany({}); // Uncomment if you have a CropData model
    console.log("🧹 Cleared out old database collections.");

    // 2. SEED NEW REGIONS
    await Region.insertMany(seedRegions);
    console.log("📍 Created 5 Regions with Status & NDVI fields.");

    // 3. SEED ALERTS
    await Alert.insertMany(seedAlerts);
    console.log("🚨 Seeded initial Alerts.");

    console.log("✅ Database Fully Seeded & Ready for the Judges!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });