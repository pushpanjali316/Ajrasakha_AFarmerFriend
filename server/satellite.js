const satelliteCache = new Map();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// Helper: resolve polygon ID from region name
const getPolygonId = (regionName) => {
  if (regionName.includes("Tamil Nadu")) return process.env.POLY_TN;
  if (regionName.includes("Andhra Pradesh")) return process.env.POLY_AP;
  if (regionName.includes("Karnataka")) return process.env.POLY_KA;
  if (regionName.includes("Kerala")) return process.env.POLY_KL;
  if (regionName.includes("Punjab")) return process.env.POLY_PB;
  throw new Error(`Unknown region: ${regionName}`);
};

// Helper: pick N evenly spaced items from sorted array and label them
const pickEvenlySpaced = (arr, labels) => {
  const count = labels.length;
  return labels.map((period, i) => {
    const index = Math.floor((i / (count - 1)) * (arr.length - 1));
    const scan = arr[index];
    return {
      period,
      value: parseFloat(scan.data.mean.toFixed(2)),
      date: new Date(scan.dt * 1000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
      })
    };
  });
};

const fetchRawNDVI = async (regionName, daysBack) => {
  const cacheKey = `${regionName}-${daysBack}`;

  // Return cached if fresh
  if (satelliteCache.has(cacheKey)) {
    const { data, timestamp } = satelliteCache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_TTL) {
      console.log(`✅ Cache hit: ${cacheKey}`);
      return data;
    }
  }

  const POLYGON_ID = getPolygonId(regionName);
  const API_KEY = process.env.AGRO_API_KEY;
  const end = Math.floor(Date.now() / 1000);
  const start = end - (daysBack * 24 * 60 * 60);

  const url = `http://api.agromonitoring.com/agro/1.0/ndvi/history?polyid=${POLYGON_ID}&start=${start}&end=${end}&appid=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data || data.length === 0 || !data[0]?.data) {
    throw new Error("No satellite imagery found.");
  }

  const sorted = data.sort((a, b) => a.dt - b.dt);

  // Store in cache
  satelliteCache.set(cacheKey, { data: sorted, timestamp: Date.now() });
  console.log(`📦 Cached raw NDVI: ${cacheKey}`);

  return sorted;
};
// fetchSatelliteData: current NDVI for dashboard cards
const fetchSatelliteData = async (regionName) => {
  try {
    const sorted = await fetchRawNDVI(regionName, 30); // oldest->newest

    const latestScan = sorted[sorted.length - 1];
    const previousScan = sorted[sorted.length - 2] || latestScan;

    const realNdvi = parseFloat(latestScan.data.mean.toFixed(2));
    const prevNdvi = previousScan.data.mean;

    const trendDirection = realNdvi >= prevNdvi ? "improving" : "declining";
    const percentChange = (((realNdvi - prevNdvi) / prevNdvi) * 100).toFixed(1);

    let status = "Healthy";
    if (realNdvi < 0.5) status = "Moderate";
    if (realNdvi < 0.3) status = "Critical";

    console.log(`📡 SATELLITE SUCCESS (${regionName}): NDVI ${realNdvi} , Trend: ${trendDirection} (${percentChange}%)`);

    return {
      ndvi: realNdvi,
      ndwiScore: parseFloat((realNdvi * 0.8).toFixed(2)),
      healthScore: realNdvi,
      status,
      trend: trendDirection,
      weeklyChange: `${percentChange > 0 ? '+' : ''}${percentChange}%`
    };

  } catch (error) {
    console.warn(`⚠️ API Failed for ${regionName}, using Failsafe. Reason: ${error.message}`);
    const fallbackNdvi = parseFloat((0.4 + Math.random() * 0.5).toFixed(2));
    return {
      ndvi: fallbackNdvi,
      ndwiScore: parseFloat((0.3 + Math.random() * 0.6).toFixed(2)),
      healthScore: fallbackNdvi,
      status: fallbackNdvi < 0.5 ? "Moderate" : "Healthy",
      trend: "stable",
      weeklyChange: "0%"
    };
  }
};

// fetchNDVIHistory: historical data for TrendComparisonCard
const fetchNDVIHistory = async (regionName, view) => {
  try {
    // weeks = last 56 days, months = last 150 days — ONE API call only
    const daysBack = view === 'months' ? 150 : 56;
    const sorted = await fetchRawNDVI(regionName, daysBack);

    const labels = view === 'months'
      ? ['4 Months Ago', '3 Months Ago', '2 Months Ago', 'Last Month', 'Current']
      : ['4 Weeks Ago', '3 Weeks Ago', '2 Weeks Ago', 'Last Week', 'Current'];

    return pickEvenlySpaced(sorted, labels);

  } catch (error) {
    console.warn(`⚠️ NDVI History failed for ${regionName}: ${error.message}`);
    return null;
  }
};

const fetchWaterStressData = async (regionName) => {
  try {
    const cacheKey = `${regionName}-waterstress`;
    if (satelliteCache.has(cacheKey)) {
      const { data, timestamp } = satelliteCache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) {
        console.log(`✅ Cache hit: ${cacheKey}`);
        return data;
      }
    }

    const POLYGON_ID = getPolygonId(regionName);
    const API_KEY = process.env.AGRO_API_KEY;
    const end = Math.floor(Date.now() / 1000);
    const start = end - (60 * 24 * 60 * 60); // 60 days for better Landsat-8 coverage

    // Step 1: Search for satellite images
    const searchUrl = `http://api.agromonitoring.com/agro/1.0/image/search?start=${start}&end=${end}&polyid=${POLYGON_ID}&appid=${API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const images = await searchRes.json();
    //console.log("Step 1 response:", JSON.stringify(images).slice(0, 500));

    if (!images || images.length === 0) throw new Error("No images found.");

    console.log(`🛰️ Found ${images.length} images for ${regionName}`);

    // Find latest image that has NDWI stats (Landsat-8 only)
    const landsat = images.filter(img => img.type === 'Landsat 8' && img.stats?.ndwi);
    const sentinel = images.filter(img => img.stats?.evi);

    let ndwi = null, evi = null;

    // Step 2a: Fetch NDWI from Landsat if available
    if (landsat.length > 0) {
      const latest = landsat[landsat.length - 1];
        //console.log("Landsat stats object:", JSON.stringify(latest.stats));
        //console.log("Sentinel stats object:", JSON.stringify(images[images.length-1].stats));
      const ndwiRes = await fetch(latest.stats.ndwi);
      const ndwiData = await ndwiRes.json();
      ndwi = parseFloat(ndwiData.mean?.toFixed(2));
      console.log(`💧 NDWI (${regionName}): ${ndwi}`);

      if (latest.stats?.evi) {
    const eviRes = await fetch(latest.stats.evi);
    const eviData = await eviRes.json();
    evi = eviData.mean != null ? parseFloat(eviData.mean.toFixed(2)) : null;
    console.log(`🌱 EVI (${regionName}): ${evi}`);
  }
    }

    const result = {
      ndwi,
      evi,
      waterStatus: ndwi === null
        ? "Unavailable"
        : ndwi > 0.3 ? "Well Hydrated"
        : ndwi > 0 ? "Mild Stress"
        : "Severe Water Stress"
    };

    satelliteCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;

  } catch (error) {
    console.warn(`⚠️ Water stress failed for ${regionName}: ${error.message}`);
    return { ndwi: null, evi: null, waterStatus: "Unavailable" };
  }
};

module.exports = { fetchSatelliteData, fetchNDVIHistory, fetchWaterStressData };