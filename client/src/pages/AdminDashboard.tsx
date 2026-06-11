import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminDashboard.css";

interface Farmer {
  name: string;
  email: string;
  location: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [alertForm, setAlertForm] = useState({
    crop: "Rice",
    type: "Health",
    severity: "high",
    message: "",
    action: "",
    location: "Godavari Basin (Andhra Pradesh)",
  });

  const [insightForm, setInsightForm] = useState({
    title: "",
    cause: "",
    prediction: "",
    tags: "",
    difficulty: "Easy Fix",
  });

  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [showFarmers, setShowFarmers] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleCreateInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    const formattedData = {
      ...insightForm,
      tags: insightForm.tags.split(",").map((tag) => tag.trim()),
    };

    try {
      const res = await fetch("http://localhost:5000/api/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (res.ok) {
        alert("✨ Insight Published!");
        setInsightForm({
          title: "",
          cause: "",
          prediction: "",
          tags: "",
          difficulty: "Easy Fix",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRaiseAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch("http://localhost:5000/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...alertForm,
          date: new Date().toLocaleString(),
          status: "active",
        }),
      });

      if (res.ok) {
        alert("🚨 Alert Broadcasted!");
        setAlertForm({ ...alertForm, message: "", action: "" });
      } else {
        alert("Authorization failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const fetchFarmers = async () => {
    if (showFarmers) {
      setShowFarmers(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/farmers");
      const data = await res.json();
      setFarmers(data);
      setShowFarmers(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <div className="admin-header">
        <h1>Control Center: Alert Broadcasting</h1>
        <button onClick={logout} className="logout-btn">
          Log Out
        </button>
      </div>

      {/* ALERT PANEL */}
      <div className="admin-panel">
        <h2>Create New Regional Alert</h2>

        <form onSubmit={handleRaiseAlert} className="admin-form">
          <div className="form-row" style={{ flexWrap: "wrap" }}>
            <div className="form-group">
              <label>Target Crop</label>
              <select
                value={alertForm.crop}
                onChange={(e) =>
                  setAlertForm({ ...alertForm, crop: e.target.value })
                }
              >
                <option>Rice</option>
                <option>Wheat</option>
                <option>Cotton</option>
              </select>
            </div>

            <div className="form-group">
              <label>Severity Level</label>
              <select
                value={alertForm.severity}
                onChange={(e) =>
                  setAlertForm({ ...alertForm, severity: e.target.value })
                }
              >
                <option value="high">High (Red)</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <select
                value={alertForm.location}
                onChange={(e) =>
                  setAlertForm({ ...alertForm, location: e.target.value })
                }
              >
                <option>Ludhiana Fields (Punjab)</option>
                <option>Godavari Basin (Andhra Pradesh)</option>
                <option>Dharwad Farms (Karnataka)</option>
                <option>Palakkad Gap (Kerala)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Alert Message</label>
            <input
              required
              value={alertForm.message}
              onChange={(e) =>
                setAlertForm({ ...alertForm, message: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Recommended Action</label>
            <input
              required
              value={alertForm.action}
              onChange={(e) =>
                setAlertForm({ ...alertForm, action: e.target.value })
              }
            />
          </div>

          <button type="submit" className="alert-btn">
            BROADCAST ALERT
          </button>
        </form>
      </div>

      {/* INSIGHT PANEL */}
      <div className="insight-panel">
        <h2>🧠 Create Smart Insight</h2>

        <form onSubmit={handleCreateInsight} className="admin-form">
          <input
            required
            placeholder="Title"
            value={insightForm.title}
            onChange={(e) =>
              setInsightForm({ ...insightForm, title: e.target.value })
            }
          />

          <textarea
            required
            placeholder="Cause..."
            value={insightForm.cause}
            onChange={(e) =>
              setInsightForm({ ...insightForm, cause: e.target.value })
            }
          />

          <textarea
            required
            placeholder="Prediction..."
            value={insightForm.prediction}
            onChange={(e) =>
              setInsightForm({ ...insightForm, prediction: e.target.value })
            }
          />

          <div className="form-row">
            <input
              required
              placeholder="Tags"
              value={insightForm.tags}
              onChange={(e) =>
                setInsightForm({ ...insightForm, tags: e.target.value })
              }
            />

            <select
              value={insightForm.difficulty}
              onChange={(e) =>
                setInsightForm({
                  ...insightForm,
                  difficulty: e.target.value,
                })
              }
            >
              <option>Easy Fix</option>
              <option>Moderate</option>
              <option>Critical</option>
            </select>
          </div>

          <button type="submit" className="publish-btn">
            Publish Insight
          </button>
        </form>
      </div>

      {/* FARMERS */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={fetchFarmers} className="show-farmers-btn">
          {showFarmers ? "Hide Farmers" : "🌾 Show Farmers"}
        </button>
      </div>

      {showFarmers && (
        <div className="farmers-panel">
          <h2>Registered Farmers</h2>

          <div className="farmers-table-wrapper">
            <table className="farmers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Region</th>
                </tr>
              </thead>

              <tbody>
                {farmers.length === 0 ? (
                  <tr>
                    <td colSpan={3}>No farmers</td>
                  </tr>
                ) : (
                  farmers.map((f, i) => (
                    <tr key={i}>
                      <td>{f.name}</td>
                      <td>{f.email}</td>
                      <td>{f.location}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}