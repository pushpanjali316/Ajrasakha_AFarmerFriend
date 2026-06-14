const path = require('path');
// __dirname is the absolute path to the folder containing this index.js file
require('dotenv').config({ path: path.join(__dirname, '../.env') }); 

//console.log("MY API KEY IS:", process.env.GEMINI_API_KEY);
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const Region = require('./models/Region');  
const CropData = require('./models/CropData');
const { fetchSatelliteData, fetchNDVIHistory ,fetchWaterStressData} = require('./satellite');
const Alert = require('./models/Alert');
const Insight = require('./models/Insight');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 
const cron = require('node-cron');
const alertsRoute = require('./routes/sendAlerts');
//to save user on login 
const User = require('./models/User');
const Moderator = require('./models/Moderator'); // New Moderator model
const bcrypt = require('bcrypt');


const JWT_SECRET = process.env.JWT_SECRET

const app = express();
app.use(cors()); 
app.use(express.json());
app.use('/api/alerts', alertsRoute);  


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error(err));

const REGION_POLY_MAP = {
  'Tamil Nadu': process.env.POLY_TN,
  'Andhra Pradesh': process.env.POLY_AP,
  'Karnataka': process.env.POLY_KA,
  'Kerala': process.env.POLY_KL,
  'Punjab': process.env.POLY_PB,
};

app.get('/api/regions', async (req, res) => {
  try {
    const regions = await Region.find();
    
    // This uses "Promise.all" to do it fast
    const regionsWithStatus = await Promise.all(regions.map(async (region) => {
      const latestData = await CropData.findOne({ regionId: region._id })
                                       .sort({ timestamp: -1 });
      
      return {
        _id: region._id,
        name: region.name,
        coordinates: region.coordinates,
        latestNDVI:region.latestNDVI,
        cropType: region.cropType,
        status: region.status,
        trend: region.trend || "stable",
        weeklyChange: region.weeklyChange || "0%",
      };
    }));

    res.json(regionsWithStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', (req, res) => {
  const {username, password} = req.body;

  if(username === 'admin' && password === 'admin123') {
    const token = jwt.sign({role: 'admin'}, JWT_SECRET, {expiresIn: '2h'});
    res.json({ token });
  } else {
    res.status(401).json({error: 'Invalid credentials'});
  }
});

const verifyAdmin = (req, res, next) =>{
  const authHeader = req.headers.authorization;
  if(!authHeader){ return res.status(403).json({error: "Access Denied: No Token Provided!" });}

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if(err) return res.status(401).json({ error: "Invalid or Expired Token!" });
    next();
  });
};

app.post('/api/alerts', verifyAdmin , async (req,res) => {
  try {
    const newAlert = await Alert.create({
      ...req.body,
      date: "Just now",
      status: "active"
    });
    res.json(newAlert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Returns the specific crop health stats for a dot
app.get('/api/regions/:id/data', async (req, res) => {
  const data = await CropData.findOne({ regionId: req.params.id })
                             .sort({ timestamp: -1 }); 
  res.json(data);
});


// The "Big Red Button" - Updates all regions with new satellite data
app.post('/api/run-pipeline', async (req, res) => {
  const start = Date.now();

  const regions = await Region.find();

  for (const region of regions) {

    // fetch real satellite data
    const newData = await fetchSatelliteData(region.name);

    // save history
    await CropData.create({
      regionId: region._id,
      metrics: newData
    });

    // update latest values in Region
    await Region.findByIdAndUpdate(region._id, {
      latestNDVI: newData.ndvi,
      status: newData.status,
      trend: newData.trend,          
      weeklyChange: newData.weeklyChange 
    });
  }

  res.json({
    status: "Success",
    message: `Updated ${regions.length} regions via Satellite Link.`,
    time: `${Date.now() - start}ms`
  });
});
app.get('/api/regions/:id/health', async (req, res) => {
  try {
    // 1. Get the Region Name
    const region = await Region.findById(req.params.id);
    if (!region) return res.status(404).json({ error: "Region not found" });

    
    const allData = await CropData.find({ regionId: req.params.id })
                                  .sort({ timestamp: -1 }); 

    if (!allData.length) return res.json({ regionName: region.name, latestNDVI: 0, status: "No Data", history: [] });

    
    const response = {
      regionName: region.name,
      latestNDVI: region.latestNDVI || 0, 
      status: region.status || "No Data",
      trend: region.trend || "stable",           
      weeklyChange: region.weeklyChange || "0%",
      // Convert DB history to simple array (will be empty array if no CropData exists yet)
      history: allData.map(d => ({
        date: d.timestamp, 
        ndvi: d.metrics?.ndvi || 0
      }))
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/insights', async (req, res) => {
  try {
    const insights = await Insight.find().sort({ date: -1 });
    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CREATE INSIGHT (Protected Admin Route)
app.post('/api/insights', verifyAdmin, async (req, res) => {
  try {
    const newInsight = await Insight.create(req.body);
    res.json(newInsight);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Helper: retry with exponential backoff + model fallback
async function generateWithRetry(prompt, retries = 3, delay = 2000) {
  const models = ["gemini-2.5-flash", "gemini-1.5-flash"];

  for (const modelName of models) {
    let currentDelay = delay;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        console.log(`✅ AI responded via ${modelName} (attempt ${attempt})`);
        return result.response.text();
      } catch (err) {
        if (err.status === 503) {
          if (attempt < retries) {
            console.log(`⏳ ${modelName} overloaded, retrying in ${currentDelay / 1000}s...`);
            await new Promise(res => setTimeout(res, currentDelay));
            currentDelay *= 2; // 2s → 4s → 8s
          } else {
            console.log(`⚠️ ${modelName} exhausted retries, trying fallback...`);
          }
        } else {
          throw err; // 401/400/etc → fail immediately, no point retrying
        }
      }
    }
  }
  return null; // both models failed
}

function getFallbackAdvice(cause = "") {
  const c = cause.toLowerCase();
  if (c.includes("drought") || c.includes("moisture"))
    return "1. Activate drip irrigation immediately.\n2. Apply mulch to retain soil moisture.\n3. Monitor soil humidity every 48 hours.";
  if (c.includes("pest") || c.includes("blight"))
    return "1. Apply approved pesticide spray within 24 hours.\n2. Isolate affected rows to prevent spread.\n3. Report to local agricultural officer for assistance.";
  return "1. Conduct immediate field inspection to assess damage extent.\n2. Consult local Krishi Vigyan Kendra for soil/crop testing.\n3. File crop stress report with district agriculture office.";
}

// --- THE REAL "DEEP ANALYSIS" AI ROUTE ---
app.post('/api/analyze', async (req, res) => {
  const { title, cause, prediction } = req.body;

  const prompt = `
    You are an expert agricultural scientist and government policy advisor in India. 
    Analyze the following crop issue reported by a satellite monitoring system:
    - Alert Title: ${title}
    - Detected Cause: ${cause}
    - Risk/Prediction: ${prediction}
    
    Provide a highly professional, concise, 3-step actionable intervention plan to mitigate this issue. 
    Format your response as a simple list. Do not use markdown formatting like **bolding** or # headers. Keep it strictly under 5 sentences.
  `;

  try {
    const aiText = await generateWithRetry(prompt);

    if (aiText) {
      res.json({ analysis: aiText });
    } else {
      console.warn("⚠️ All AI models failed. Using rule-based fallback.");
      res.json({ analysis: getFallbackAdvice(cause), fallback: true });
    }
  } catch (err) {
    console.error("AI Generation Error:", err);
    res.status(500).json({ error: "AI Engine Failed to respond." });
  }
});


app.put('/api/alerts/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // We will send 'active' or 'completed' from React
    
    // Find the alert by ID and update its status
    const updatedAlert = await Alert.findByIdAndUpdate(
      id, 
      { status: status.toLowerCase() }, 
      { new: true } // Returns the updated document
    );
    
    res.json(updatedAlert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


cron.schedule('0 0 * * *', async () => {
  console.log('⏰ CRON JOB STARTED: Fetching daily satellite data...');
  
  try {
    const regions = await Region.find();
    let count = 0;

    for (const region of regions) {
      
      const satelliteData = await fetchSatelliteData(region.name);  
      
      
      await CropData.create({
        regionId: region._id,
        metrics: satelliteData
      });
      count++;
    }
    console.log(`✅ CRON JOB FINISHED: Updated ${count} regions.`);
  } catch (err) {
    console.error('❌ CRON JOB FAILED:', err);
  }
});


app.get('/api/alerts', async (req, res) => {
  const alerts = await Alert.find();
  res.json(alerts);
});

app.post("/api/add-farmer", async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, location } = req.body;

    if (!name || !email || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //checking if email is valid and only allows gmail
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      return res.status(400).json({ message: "Only Gmail addresses are allowed (@gmail.com)" });
    }

    // Check if farmer already exists
    const existingFarmer = await User.findOne({ email });

    if (existingFarmer) {
      return res.status(400).json({ message: "Farmer with this email already exists" });
    }

    // If not exist → create new farmer
    const newUser = new User({
      name,
      email,
      location
    });

    await newUser.save();

    res.status(201).json({
      message: "Farmer added successfully",
      user: newUser
    });

  } catch (err) {
    console.error("Add Farmer Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/farmers", async (req, res) => {
  try {
    const farmers = await User.find();   // use User model
    res.json(farmers);
  } catch (err) {
    console.error("Fetch Farmers Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// REGISTER / SIGN-UP

app.post('/api/moderator/register', async (req, res) => {
  try {
    const { name, email, password, region } = req.body;

    if (!name || !email || !password || !region)
      return res.status(400).json({ message: "All fields are required" });

    // Check if moderator already exists
    const existing = await Moderator.findOne({ email });
    if (existing) return res.status(400).json({ message: "Moderator already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newModerator = new Moderator({
      name,
      email,
      password: hashedPassword,
      region
    });

    await newModerator.save();

    res.status(201).json({ message: "Moderator registered successfully" });
  } catch (err) {
    console.error("Register Moderator Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN

app.post('/api/moderator/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const moderator = await Moderator.findOne({ email });
    if (!moderator) return res.status(401).json({ message: "Invalid credentials" });

    // Compare password
    const match = await bcrypt.compare(password, moderator.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // Sign JWT
    const token = jwt.sign(
      { id: moderator._id, email: moderator.email, region: moderator.region },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      name: moderator.name,
      email: moderator.email,
      region: moderator.region
    });

  } catch (err) {
    console.error("Moderator Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// This endpoint returns the last 4 weeks of NDVI data 
// for a given region (or default region if not specified)

app.get('/api/ndvi-history', async (req, res) => {
  try {
    const { region, view } = req.query;

    if (!region || !view) {
      return res.status(400).json({ error: 'region and view are required' });
    }

    const results = await fetchNDVIHistory(region, view);

    if (!results) {
      return res.status(503).json({ error: 'Satellite data unavailable.' });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// for water stress data in swipeable cards->dashboard
app.get('/api/water-stress', async (req, res) => {
  try {
    const { region } = req.query;
    if (!region) return res.status(400).json({ error: 'region is required' });

    const data = await fetchWaterStressData(region);
    res.json(data);
  } catch (err) {
    console.error(err); //logs the actual error to your server console
    res.status(500).json({ error: err.message });
  }
});


// GOOGLE AUTH REDIRECT

app.get('/api/auth/google', (req, res) => {
  // This is just a placeholder for now
  // You can integrate passport-google-oauth2 or Google OAuth SDK
  res.send("Redirect to Google OAuth page here");
});
app.listen(process.env.PORT || 5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});