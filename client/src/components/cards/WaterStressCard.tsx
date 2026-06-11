//import React from 'react';
import '../../styles/Cards.css';

const WaterStressCard = ({ data }: any) => {
  // NDWI Colors: Deep Blue (Wet) to Light Cyan/Grey (Dry)
  const getWaterColor = (score: number) => {
    if (score > 0.6) return '#0288d1'; // Sufficient
    if (score > 0.3) return '#4fc3f7'; // Mild Stress
    return '#cfd8dc'; // Severe Stress
  };

  return (
    <div className="card water-card">
      <h3>💧 Water Stress (NDWI)</h3>
      <div className="visual-indicator">
        <div className="droplet-container" style={{ 
          backgroundColor: getWaterColor(data.ndwiScore),
          height: `${data.ndwiScore * 100}%` 
        }}>
          <span className="ndwi-val">{data.ndwiScore}</span>
        </div>
      </div>
      <div className="card-info">
        <p>Moisture Level: <strong>{data.ndwiScore > 0.5 ? 'Sufficient' : 'Low'}</strong></p>
        <p>Status: <strong>{data.ndwiScore < 0.3 ? 'Irrigation Required' : 'Optimal'}</strong></p>
      </div>
      <div className="recommendation water-rec">
        <strong>Advice:</strong> {data.ndwiScore < 0.4 
          ? "Schedule irrigation within the next 24 hours." 
          : "Soil moisture levels are stable."}
      </div>
    </div>
  );
};

export default WaterStressCard;