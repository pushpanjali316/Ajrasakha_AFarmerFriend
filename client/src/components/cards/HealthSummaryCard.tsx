//import React from 'react';
import '../../styles/Cards.css';

const HealthSummaryCard = ({ data }: any) => {
  const getStatusColor = (score: number) => {
    if (score > 0.7) return '#4CAF50'; // Green
    if (score > 0.5) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };
  const getTrendArrow = (trend: string) => {
    if (trend === 'improving') return '📈';
    if (trend === 'declining') return '📉';
    return '➡️';
  };

  const getAction = (ndvi: number, trend: string) => {
    if (ndvi < 0.3) return "Critical: Apply Nitrogen fertilizer immediately.";
    if (ndvi < 0.5 && trend === 'declining') return "Deteriorating: Increase irrigation and fertilizer.";
    if (ndvi < 0.5) return "Moderate stress: Monitor closely and apply nutrients.";
    if (trend === 'declining') return "Declining trend: Check soil moisture levels.";
    return "Continue current maintenance. Crop is healthy.";
  };

  return (
    <div className="card health-card">
      <h3>🌱 Crop Health (NDVI)</h3>
      <div className="visual-indicator">
        <div className="circular-progress" 
          style={{ 
            background: `conic-gradient(${getStatusColor(data.ndvi)} ${data.ndvi * 360}deg, #e0e0e0 0deg)` 
          }}
        >
          <div className="inner-circle">
            <span className="score">{data.ndvi}</span>
            <span className="score-label">NDVI Index</span>
          </div>
        </div>
      </div>
      <div className="recommendation">
        <p style={{ margin: '0 0 6px' }}></p>
        <p>Status: <strong style={{color: getStatusColor(data.ndvi)}}>{data.status}</strong></p>

        <p style={{ margin: '0 0 8px' }}>
          Trend:{' '}
          <strong>{getTrendArrow(data.trend)} {data.trend}</strong>{' '}
          ({data.weeklyChange})
        </p>

        <p style={{ margin: 0, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '8px' }}>
          <strong>Action:</strong> {getAction(data.ndvi, data.trend)}
        </p>

      </div>
    </div>
  );
};

export default HealthSummaryCard;