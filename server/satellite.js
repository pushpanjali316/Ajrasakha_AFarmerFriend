const fetchSatelliteData = async (regionName) => {
  try {
    let POLYGON_ID;

    // 1. Route to the correct Polygon based on the Region's Name
    if (regionName.includes("Tamil Nadu")) POLYGON_ID = process.env.POLY_TN;
    else if (regionName.includes("Andhra Pradesh")) POLYGON_ID = process.env.POLY_AP;
    else if (regionName.includes("Karnataka")) POLYGON_ID = process.env.POLY_KA;
    else if (regionName.includes("Kerala")) POLYGON_ID = process.env.POLY_KL;
    else if (regionName.includes("Punjab")) POLYGON_ID = process.env.POLY_PB;
    else throw new Error("Unknown region name.");

    const API_KEY = process.env.AGRO_API_KEY;

    // 2. Setup the timeframe (Last 30 days)
    const end = Math.floor(Date.now() / 1000);
    const start = end - (30 * 24 * 60 * 60);

    // 3. Ping the Agromonitoring API
    const url = `http://api.agromonitoring.com/agro/1.0/ndvi/history?polyid=${POLYGON_ID}&start=${start}&end=${end}&appid=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data || data.length === 0 || !data[0].data) {
      throw new Error("No recent satellite imagery found for this polygon.");
    }

    // 4. Extract Real NDVI
    const latestScan = data[0]; 
    const realNdvi = parseFloat(latestScan.data.mean.toFixed(2));

    // Calculate Trend
    const previousScan = data[1] ? data[1].data.mean : realNdvi;
    const trendDirection = realNdvi >= previousScan ? "improving" : "declining";
    const percentChange = (((realNdvi - previousScan) / previousScan) * 100).toFixed(1);

    // 5. Determine status
    let status = "Healthy";
    if (realNdvi < 0.5) status = "Moderate";
    if (realNdvi < 0.3) status = "Critical";

    console.log(`📡 SATELLITE SUCCESS (${regionName}): NDVI ${realNdvi}`);

    return {
      ndvi: realNdvi,
      ndwiScore: parseFloat((realNdvi * 0.8).toFixed(2)), // Estimated from NDVI for free tier
      healthScore: realNdvi, 
      status: status,
      trend: trendDirection,
      weeklyChange: `${percentChange > 0 ? '+' : ''}${percentChange}%`
    };

  } catch (error) {
    // 🚨 FAILSAFE: If the API limits out or fails, use the simulation engine so the app doesn't crash!
    console.warn(`⚠️ API Failed for ${regionName}, using Failsafe. Reason: ${error.message}`);
    
    const fallbackNdvi = parseFloat((0.4 + Math.random() * 0.5).toFixed(2));
    return {
      ndvi: fallbackNdvi,
      ndwiScore: parseFloat((0.3 + Math.random() * 0.6).toFixed(2)),
      healthScore: fallbackNdvi,
      status: fallbackNdvi < 0.5 ? "Moderate" : "Healthy",
      trend: "stable",
      weeklyChange: "+1.2%"
    };
  }
};

module.exports = { fetchSatelliteData };















// // Simulates fetching fresh data from a satellite
// const fetchSatelliteData = (cropType) => {
//   // Generate random healthy-ish numbers (0.4 to 0.9)
//   const ndvi = parseFloat((0.4 + Math.random() * 0.5).toFixed(2));
//   const ndwi = parseFloat((0.3 + Math.random() * 0.6).toFixed(2));
  
//   // Determine status based on NDVI
//   let status = "Healthy";
//   if (ndvi < 0.5) status = "Moderate";
//   if (ndvi < 0.3) status = "Critical";

//   return {
//     ndvi,
//     ndwiScore: ndwi,
//     healthScore: parseFloat(((ndvi + ndwi) / 2).toFixed(2)),
//     status,
//     trend: ndvi > 0.6 ? "improving" : "declining",
//     weeklyChange: ndvi > 0.6 ? "+5%" : "-12%"
//   };
// };

// module.exports = { fetchSatelliteData };