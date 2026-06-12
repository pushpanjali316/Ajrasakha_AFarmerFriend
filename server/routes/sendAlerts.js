const express = require("express");
const router = express.Router();

const Alert = require("../models/Alert");
const User = require("../models/User");
const sendEmail = require("../models/sendEmail");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: Generate AI insight for the alert
const generateAIInsight = async (alert) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      You are an expert agricultural advisor AI.
      A crop alert has been triggered with the following details:
      - Crop: ${alert.crop}
      - Alert Type: ${alert.type}
      - Severity: ${alert.severity}
      - Issue: ${alert.message}
      - Recommended Fix: ${alert.action}

      Give a short, practical AI insight (3-4 sentences max) that a farmer can understand.
      Focus on: why this happens, what to do immediately, and how to prevent it next time.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.warn("⚠️ AI insight failed:", err.message);
    return "AI insight unavailable at this time.";
  }
};

// GET alerts
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE alert + send email to ALL users
router.post("/", async (req, res) => {
  try {
    // Save alert
    const alert = new Alert(req.body);
    await alert.save();

    // Generate AI insight once (reused for all users)
    const aiInsight = await generateAIInsight(alert);

    // Get all users
    const users = await User.find({ location: alert.location });
    if (users.length === 0) {
      console.log(`⚠️ No users found for location: ${alert.location}`);
      return res.json({ ...alert.toObject(), aiInsight, emailsSent: 0 });
    }

    // Prepare message
    const message = `
    🚨 ALERT: ${alert.type}
       Crop: ${alert.crop}
    📍 Location: ${alert.location}
    ⚠️ Severity: ${alert.severity}
    📋 Issue: ${alert.message}

    ✅ Fix: ${alert.action}
    🤖 AI Insight:
      ${aiInsight}

      ---
      Stay ahead of crop stress. - Ajrasakha 🌾
  `;

    // Send email to all users
    for (const user of users) {
      await sendEmail(user.email, "🚨 New Crop Alert - Ajrasakha ", message);
    }

    console.log(`📩 Sent alert to ${users.length} users of location ${users[0].location}`);
    res.json({ ...alert.toObject(), aiInsight });
  } catch (err) {
    console.error("❌ Alert error:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE status
router.put("/:id/status", async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    alert.status = req.body.status;
    await alert.save();
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
