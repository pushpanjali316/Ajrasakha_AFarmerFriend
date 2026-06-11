//import React from 'react';
import '../../styles/Cards.css';

const HealthSummaryCard = ({ data }: any) => {
  const getStatusColor = (score: number) => {
    if (score > 0.7) return '#4CAF50'; // Green
    if (score > 0.5) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };

  return (
    <div className="card health-card">
      <h3>🌱 Crop Health (NDVI)</h3>
      <div className="visual-indicator">
        <div className="circular-progress" style={{ 
          background: `conic-gradient(${getStatusColor(data.ndvi)} ${data.ndvi * 360}deg, #e0e0e0 0deg)` 
        }}>
          <div className="inner-circle">
            <span className="score">{data.ndvi}</span>
            <span className="label">NDVI Index</span>
          </div>
        </div>
      </div>
      <div className="card-info">
        <p>Status: <strong style={{color: getStatusColor(data.ndvi)}}>{data.status}</strong></p>
        <p>Trend: <strong>{data.trend}</strong> ({data.weeklyChange})</p>
      </div>
      <div className="recommendation">
        <strong>Action:</strong> {data.ndvi < 0.5 ? "Urgent: Apply Nitrogen fertilizer." : "Continue current maintenance."}
      </div>
    </div>
  );
};

export default HealthSummaryCard;