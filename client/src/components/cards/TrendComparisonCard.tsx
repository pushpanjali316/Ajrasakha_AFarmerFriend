import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import '../../styles/Cards.css';
import { API_BASE } from '../../services/api';
import { CROP_REGION_MAP } from '../../constants/cropRegions';

interface NDVIPoint {
  period: string;
  value: number;
}

const TrendComparisonCard = ({ cropName }: { cropName: string }) => {
  const [view, setView] = useState<'weeks' | 'months'>('weeks');
  const [data, setData] = useState<NDVIPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Auto-resolve region from crop name
  const region = CROP_REGION_MAP[cropName] || 'Andhra Pradesh';

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/ndvi-history?region=${encodeURIComponent(region)}&view=${view}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [view, cropName]); // re-fetch when crop changes

  const latest = data[data.length - 1]?.value || 0;
  const previous = data[data.length - 2]?.value || 0;
  const diffNum = previous > 0 ? ((latest - previous) / previous * 100) : 0;
  const diff = diffNum.toFixed(1);
  const isUp = latest >= previous;

  const healthLabel =
    latest > 0.6 ? '🌿 Healthy crop' :
    latest > 0.4 ? '⚠️ Moderate stress' :
    '🚨 High stress';

  return (
    <div className="card trend-card">

      {/* Header + Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div>
          <h3>📈 {cropName} Growth Trend</h3>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: '2px 0 0' }}>
            📍 {region}
          </p>
        </div>
        <div className="toggle-group">
          <button onClick={() => setView('weeks')}
            style={{
              background: view === 'weeks' ? '#2e7d32' : 'rgba(255,255,255,0.15)',
              color: '#fff',
            }}
          >Weeks
          </button>
          <button onClick={() => setView('months')}
            style={{
              background: view === 'months' ? '#2e7d32' : 'rgba(255,255,255,0.15)',
              color: '#fff',
            }}
          >Months
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        {loading ? (
          <p style={{ textAlign: 'center', paddingTop: '70px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
            Fetching {region} NDVI data...
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} barCategoryGap="30%">
              <XAxis
                dataKey="period"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
              />
              <YAxis hide domain={[0, 1]} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                formatter={(value: number | undefined) => [value != null ? value.toFixed(2) : 'N/A', 'NDVI']}
                contentStyle={{
                  background: 'rgba(20,20,20,0.85)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.82rem'
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === data.length - 1 ? '#2e7d32' : 'rgba(130,202,157,0.6)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Insight Box */}
      {!loading && data.length > 1 && (
        <div className="card-info">
          <p>
            {isUp ? '📈' : '📉'} NDVI is{' '}
            <strong>{Math.abs(Number(diff))}% {isUp ? 'higher' : 'lower'}</strong>{' '}
            than last {view === 'weeks' ? 'week' : 'month'}.
          </p>
          <p>
            Current NDVI: <strong>{latest.toFixed(2)}</strong> — {healthLabel}
          </p>
        </div>
      )}

    </div>
  );
};

export default TrendComparisonCard;