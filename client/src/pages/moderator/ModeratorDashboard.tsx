import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ModeratorProfile.css";
import { API_BASE } from "../../services/api";

interface Farmer {
  name: string;
  email: string;
  location: string;
}

interface Alert {
  message: string;
  date: string;
  severity: string;
}

const ModeratorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [moderatorName, setModeratorName] = useState("");
  const [moderatorEmail, setModeratorEmail] = useState("");
  const [moderatorRegion, setModeratorRegion] = useState("");
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Check login
  useEffect(() => {
    const token = localStorage.getItem("moderatorToken");
    const name = localStorage.getItem("moderatorName");
    const email = localStorage.getItem("moderatorEmail");
    const region = localStorage.getItem("moderatorRegion");

    if (!token) navigate("/moderator-login");

    if (name) setModeratorName(name);
    if (email) setModeratorEmail(email);
    if (region) setModeratorRegion(region);
  }, [navigate]);

  // Fetch farmers in this region
  useEffect(() => {
    const fetchFarmers = async () => {
      if (!moderatorRegion) return;
      try {
        const res = await fetch(
          `${API_BASE}/api/farmers?region=${encodeURIComponent(
            moderatorRegion
          )}`
        );
        const data = await res.json();
        if (res.ok) setFarmers(data.farmers);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFarmers();
  }, [moderatorRegion]);

  // Fetch alerts for this region
  useEffect(() => {
    const fetchAlerts = async () => {
      if (!moderatorRegion) return;
      try {
        const res = await fetch(
          `${API_BASE}/api/alerts?region=${encodeURIComponent(
            moderatorRegion
          )}`
        );
        const data = await res.json();
        if (res.ok) setAlerts(data.alerts);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAlerts();
  }, [moderatorRegion]);

  return (
    <div className="moderator-container">
      <h2>Moderator Dashboard 🌾</h2>

      <div className="moderator-profile">
        <h3>Profile Info</h3>
        <p>
          <strong>Name:</strong> {moderatorName}
        </p>
        <p>
          <strong>Email:</strong> {moderatorEmail}
        </p>
        <p>
          <strong>Region:</strong> {moderatorRegion}
        </p>
      </div>

      <div className="farmers-section">
        <h3>Farmers in your region</h3>
        {farmers.length === 0 ? (
          <p>No farmers found.</p>
        ) : (
          farmers.map((farmer) => (
            <div key={farmer.email} className="farmer-card">
              <p>
                <strong>{farmer.name}</strong> - {farmer.location}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="alerts-section">
        <h3>Alerts from Admin</h3>
        {alerts.length === 0 ? (
          <p>No alerts for your region.</p>
        ) : (
          alerts.map((alert, index) => (
            <div key={index} className="alert-card">
              <p>
                <strong>Message:</strong> {alert.message}
              </p>
              <p>
                <strong>Severity:</strong> {alert.severity}
              </p>
              <p>
                <strong>Date:</strong> {new Date(alert.date).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ModeratorDashboard;