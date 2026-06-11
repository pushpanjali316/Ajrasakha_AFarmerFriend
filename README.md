<div align="center">

# 🌾 Ajrasakha
### *A Friend Who Never Fades*

**A full-stack smart agriculture platform that uses satellite imagery and AI to monitor crop health, detect stress early, and deliver actionable insights to farmers - before it's too late.**

[![TypeScript](https://img.shields.io/badge/TypeScript-61.5%25-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## 🔍 What is Ajrasakha?

India loses billions in crop yield every year due to delayed detection of crop stress, water deficiency, and disease spread. Farmers often discover problems only when visible damage has already occurred.

**Ajrasakha bridges that gap.** It continuously monitors crop health using satellite-derived indices (NDVI, NDWI), detects anomalies automatically, and uses Google Gemini AI to generate plain-language advisories - delivered directly to farmers via email alerts before damage becomes irreversible.

> Built as part of the **IIT Ropar Research Internship** under Prof. Sudarshan Iyengar, working on real-world crop monitoring systems for Indian agricultural regions.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🛰️ **Satellite Data Monitoring** | Ingests and processes NDVI/EVI indices from satellite imagery per crop region |
| 🤖 **AI-Powered Advisories** | Google Gemini analyzes index trends and generates actionable crop health recommendations |
| 📧 **Automated Email Alerts** | Nodemailer triggers alerts when health indices drop below critical thresholds |
| ⏱️ **Scheduled Health Checks** | node-cron runs periodic analysis jobs without manual intervention |
| 🗺️ **Interactive Map View** | Region-wise crop health visualization with markers, state panels, and zone drill-down |
| 📊 **Heatmap & Trend Analysis** | Visual heatmaps of crop stress + trend comparison across time periods |
| 💧 **Water Stress Detection** | Dedicated water stress card surfacing irrigation risk per field |
| 👥 **Admin + Moderator Roles** | Role-based access for platform admins, moderators, and field operators |
| 🧑‍🌾 **Farmer Management** | Add, view, and manage registered farmers and their assigned regions |
| 🔐 **JWT Authentication** | Secure token-based auth with protected routes across the platform |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (React + TS)                 │
│  Login → Dashboard → Map → Heatmap → Insights → Alerts  │
│         Farmers → Operations → Moderator Panel          │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────────────────┐
│                   SERVER (Node + Express)               │
│   Auth Routes │ Field Routes │ Satellite Routes         │
│   Alert Routes │ Analysis Routes                        │
└──┬─────────────────────┬──────────────────┬─────────────┘
   │                     │                  │
   ▼                     ▼                  ▼
MongoDB             Google Gemini      Nodemailer
(Mongoose)           AI API            (SMTP Alerts)
User, Region,       Crop Advisory      Email to farmers
CropData, Alert,    Generation         on anomaly
Insight, Moderator
```

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + TypeScript (Vite)
- React Router v6 with protected routes
- Custom CSS - responsive, mobile-friendly
- Leaflet.js (interactive map with region markers)

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose ODM
- JWT-based authentication + role middleware
- node-cron for scheduled satellite analysis jobs

**AI & Integrations**
- Google Gemini AI (`@google/generative-ai`) — crop health advisory generation
- Nodemailer - automated SMTP email alert delivery
- Satellite data ingestion pipeline (`satellite.js`)

---

## 📁 Project Structure

```
Ajrasakha/
├── client/                         # React + TypeScript frontend
│   └── src/
│       ├── components/
│       │   ├── cards/              # HealthSummaryCard, TrendComparisonCard, WaterStressCard
│       │   ├── MapController.tsx   # Interactive map logic
│       │   ├── RegionMarkers.tsx   # Crop zone markers on map
│       │   └── SwipeableCards.tsx  # Mobile-friendly card swiper
│       ├── pages/
│       │   ├── Dashboard.tsx       # Main farmer overview
│       │   ├── MapPage.tsx         # Region-wise map visualization
│       │   ├── Heatmap.tsx         # Satellite index heatmap
│       │   ├── Insights.tsx        # AI advisory display
│       │   ├── Alerts.tsx          # Alert management
│       │   ├── FarmersPage.tsx     # Registered farmer list
│       │   ├── AdminDashboard.tsx  # Admin control panel
│       │   └── Operations.tsx      # Operational overview
│       └── services/api.ts         # Axios API service layer
│
└── server/                         # Node.js + Express backend
    ├── models/
    │   ├── User.js                 # Farmer/admin user schema
    │   ├── Moderator.js            # Moderator role schema
    │   ├── Region.js               # Crop region schema
    │   ├── CropData.js             # Satellite index records
    │   ├── Alert.js                # Alert schema
    │   ├── Insight.js              # AI advisory records
    │   └── sendEmail.js            # Nodemailer email service
    ├── routes/sendAlerts.js        # Alert trigger endpoints
    ├── satellite.js                # Satellite data ingestion
    ├── seed.js                     # DB seed script
    └── index.js                    # Express server entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API key
- SMTP credentials (Gmail or other)

### Installation

```bash
# Clone the repository
git clone https://github.com/pushpanjali316/Ajrasakha_AFarmerFriend.git
cd Ajrasakha_AFarmerFriend

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Setup

Create `/.env` from the provided example:

```bash
cp /.env.example /.env
```

Fill in:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=api_key
AGRO_API_KEY=api_key
POLY_TN=id1
POLY_AP=id2
POLY_KA=id3
POLY_KL=id4
POLY_PB=id5
EMAIL_USER=your_mail
EMAIL_PASS=app_password
PORT=5000
```

### Run the Application

### Seed Sample Data (optional)
```bash
cd server
node seed.js
```

```bash
# Terminal 1 - Start backend
cd server
npm install
node index.js

# Terminal 2 - Start frontend
cd client
npm install
npm run dev
```

Visit `http://localhost:5173`


---

## 💡 Why This Project Matters

- 🌍 **Real-world impact** - Built to address actual crop loss faced by Indian farmers due to delayed detection
- 🛰️ **Data-driven agriculture** - Moves farming decisions from intuition to satellite-backed evidence
- 🤖 **Practical AI** - Gemini AI doesn't just analyze; it explains the issue in farmer-friendly language
- 📬 **Proactive alerts** - Shifts the model from reactive damage control to preventive intervention
- 🧱 **Production-ready patterns** - Role-based auth, scheduled jobs, modular architecture, clean separation of concerns

---

## 👩‍💻 Author

**Pushpanjali Vandavasi**
