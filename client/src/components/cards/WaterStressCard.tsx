import { useState, useEffect } from 'react';
import '../../styles/Cards.css';
import { API_BASE } from '../../services/api';
import { CROP_REGION_MAP } from '../../constants/cropRegions';

interface WaterData {
  ndwi: number | null;
  evi: number | null;
  waterStatus: string;
}

const WaterStressCard = ({ cropName }: { cropName: string }) => {
  const [waterData, setWaterData] = useState<WaterData | null>(null);
  const [loading, setLoading] = useState(true);

  const region = CROP_REGION_MAP[cropName] || 'Andhra Pradesh';

  useEffect(() => {
    console.log("WaterStressCard cropName:", cropName, "region:", region);
    setLoading(true);
    fetch(`${API_BASE}/api/water-stress?region=${encodeURIComponent(region)}`)
      .then(res => res.json())
      .then(d => { setWaterData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [cropName]);

  const getWaterColor = (ndwi: number | null) => {
    if (ndwi === null) return '#cfd8dc';
    if (ndwi > 0.3) return '#0288d1';
    if (ndwi > 0) return '#4fc3f7';
    return '#cfd8dc';
  };

  const getAdvice = (ndwi: number | null, evi: number | null) => {
    if (ndwi === null) {
      if (evi !== null && evi < 0.2) return "Low vegetation vigor detected. Check irrigation schedule.";
      if (evi !== null && evi > 0.4) return "Vegetation vigor looks good. Monitor soil moisture.";
      return "Water index data unavailable for this region (Sentinel-2 only). Monitor manually.";
    }
    if (ndwi < 0) return "🚨 Severe water stress: Irrigate immediately.";
    if (ndwi < 0.3) return "⚠️ Mild water stress: Schedule irrigation within 24 hours.";
    return "✅ Soil moisture levels are stable. Continue current schedule.";
  };

  const ndwi = waterData?.ndwi ?? null;
  const evi = waterData?.evi ?? null;
  //const fillHeight = ndwi !== null ? Math.max(10, Math.min(100, (ndwi + 1) / 2 * 100)) : 30;

  return (
    <div className="card water-card">
      <h3>💧 Water Stress (NDWI)</h3>

      <div className="visual-indicator">
        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', paddingTop: '30px' }}>
            Fetching water data...
          </p>
        ) : (
          <div
            className="droplet-container"
            style={{ backgroundColor: getWaterColor(ndwi) }}
          >
            <span className="ndwi-val">
              {ndwi !== null ? ndwi : 'N/A'}
            </span>
          </div>
        )}
      </div>

      {!loading && (
        <div className="recommendation">
          <p style={{ margin: '0 0 6px' }}>
            NDWI:{' '}
            <strong style={{ color: getWaterColor(ndwi) }}>
              {ndwi !== null ? ndwi : 'Unavailable'}
            </strong>
            {ndwi === null && ' (Landsat-8 required)'}
          </p>
          {evi !== null && (
            <p style={{ margin: '0 0 8px' }}>
              EVI: <strong>{evi}</strong>
              {' '}{evi > 0.4 ? '🌿 Good vigor' : evi > 0.2 ? '⚠️ Moderate' : '🚨 Low vigor'}
            </p>
          )}
          <p style={{ margin: 0, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '8px' }}>
            <strong>Advice:</strong> {getAdvice(ndwi, evi)}
          </p>
        </div>
      )}
    </div>
  );
};

export default WaterStressCard;