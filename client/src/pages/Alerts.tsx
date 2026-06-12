import React, { useState, useEffect } from 'react';
import '../styles/Alerts.css';
import { API_BASE } from "../services/api";

interface Alert {
  _id: string;
  crop: string;
  type: string;
  severity: string;
  message: string;
  action: string;
  date: string;
  status: string; 
  location: string;
}

const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'active' | 'completed'>('active');
  const [loading, setLoading] = useState(true);

  // FETCH ALERTS FROM API
  useEffect(() => {
    fetch(`${API_BASE}/api/alerts`)
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching alerts:", err));
  }, []);

 
  const toggleStatus = async (id: string, currentStatus: string) => {
    // 1. Determine the new status
    const isCurrentlyActive = currentStatus.toLowerCase() === 'active';
    const newStatus = isCurrentlyActive ? 'completed' : 'active';

    try {
      
      const res = await fetch(`${API_BASE}/api/alerts/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // 3. If the database update was successful, update the React UI
        setAlerts(prev => prev.map(alert => 
          alert._id === id ? { ...alert, status: newStatus } : alert
        ));
      } else {
        console.error("Failed to update status in DB");
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  // Safe filtering for case sensitivity
  const filteredAlerts = alerts.filter(a => 
    a.status && a.status.toLowerCase() === filter.toLowerCase()
  );

  // Safe counting for the tabs
  const activeCount = alerts.filter(a => a.status && a.status.toLowerCase() === 'active').length;
  const historyCount = alerts.filter(a => a.status && a.status.toLowerCase() === 'completed').length;

  return (
    <div className="alerts-page">
      <header className="alerts-header">
        <h1>Risk Center</h1>
      </header>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`tab-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({activeCount})
        </button>
        <button 
          className={`tab-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          History ({historyCount})
        </button>
      </div>

      <div className="alerts-list">
        {loading ? (
           <p style={{textAlign: 'center', color: '#888'}}>Loading Alerts...</p>
        ) : filteredAlerts.length === 0 ? (
          <div className="empty-state">
            <p>No {filter} alerts found. 🌾</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert._id} className={`alert-item ${alert.severity} ${alert.status.toLowerCase()}`}>
              <div className="alert-icon-section">
                <span className="severity-dot"></span>
                <div className="alert-meta">
                  <h3>{alert.crop}</h3>
                  <span className="alert-time">{alert.date}</span>
                </div>
              </div>
              
              <p className="alert-message"><strong>{alert.type}:</strong> {alert.message}</p>
              
              {alert.status.toLowerCase() === 'active' && (
                <div className="alert-action-box">
                   <strong>Fix:</strong> {alert.action}
                </div>
              )}

              <div className="alert-footer">
                <button 
                  className="status-toggle-btn"
                  onClick={() => toggleStatus(alert._id, alert.status)}
                >
                  {alert.status.toLowerCase() === 'active' ? 'Mark as Resolved' : 'Re-open Alert'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPage;