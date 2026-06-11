const express = require("express");
const router = express.Router();

const Alert = require("../models/Alert");
const User = require("../models/User");
const sendEmail = require("../models/sendEmail");

// GET alerts
router.get("/", async (req, res) => {
  const alerts = await Alert.find();
  res.json(alerts);
});

// CREATE alert + send email to ALL users
router.post("/", async (req, res) => {
  try {
    // Save alert
    const alert = new Alert(req.body);
    await alert.save();

    // Get all users
    const users = await User.find();

    // Prepare message
    const message = `
🚨 ALERT: ${alert.type}
Crop: ${alert.crop}

${alert.message}

Fix: ${alert.action}
    `;

    // Send email to all users
    for (const user of users) {
      await sendEmail(user.email, "🚨 New Crop Alert", message);
    }

    console.log(`📩 Sent alert to ${users.length} users`);

    res.json(alert);
  } catch (err) {
    console.error("❌ Alert error:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE status
router.put("/:id/status", async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    alert.status = req.body.status;
    await alert.save();

    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
