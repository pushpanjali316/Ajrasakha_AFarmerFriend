import React, { useState, useEffect } from 'react';
import '../styles/Insights.css';

interface Insight {
  _id: string;
  title: string;
  cause: string;
  prediction: string;
  tags: string[];
  difficulty: string;
}

const InsightsPage: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  
  // AI States
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [aiResponses, setAiResponses] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('http://localhost:5000/api/insights')
      .then(res => res.json())
      .then(data => {
        setInsights(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const handleDeepAnalysis = async (insight: Insight) => {
    setAnalyzingId(insight._id);
    try {
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: insight.title,
          cause: insight.cause,
          prediction: insight.prediction
        })
      });
      
      const data = await res.json();
      setAiResponses(prev => ({ ...prev, [insight._id]: data.analysis }));
    } catch (err) {
      alert("AI Analysis failed.");
    }
    setAnalyzingId(null);
  };

  return (
    <div className="insights-page">
      <header className="insights-header">
        <h1>Smart Insights</h1>
        <p>Expert analysis of your field data</p>
      </header>

      <div className="insights-grid">
        {loading ? <p>Loading field intelligence...</p> : insights.map(item => (
          <div key={item._id} className="insight-card">
            <div className="insight-tags">
              {item.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              <span className="difficulty">{item.difficulty}</span>
            </div>
            
            <h2>{item.title}</h2>
            
            <section className="insight-section">
              <h3>🔍 CAUSE</h3>
              <p>{item.cause}</p>
            </section>

            <section className="insight-section next-steps">
              <h3>🔮 WHAT HAPPENS NEXT?</h3>
              <p>{item.prediction}</p>
            </section>

            {/* AI RESPONSE AREA */}
            {aiResponses[item._id] ? (
              <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '8px', marginTop: '15px', borderLeft: '4px solid #22c55e' }}>
                <h3 style={{ color: '#166534', marginTop: 0, fontSize: '0.9rem' }}>✨ AI DEEP ANALYSIS</h3>
                <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap', color: '#15803d' }}>{aiResponses[item._id]}</p>
              </div>
            ) : (
              <button 
                className="learn-more-btn" 
                onClick={() => handleDeepAnalysis(item)}
                disabled={analyzingId === item._id}
                style={{ opacity: analyzingId === item._id ? 0.7 : 1, cursor: analyzingId === item._id ? 'wait' : 'pointer' }}
              >
                {analyzingId === item._id ? '🤖 Analyzing Data...' : 'Read Deep Analysis'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPage;





























// import React from 'react';
// import '../styles/Insights.css';

// const InsightsPage: React.FC = () => {
//   const insights = [
//     {
//       id: 1,
//       title: "Why is my Rice turning yellow?",
//       cause: "Low NDVI detected in sector B. This is likely due to nitrogen leaching after the heavy rains last Tuesday.",
//       prediction: "If untreated, yield could drop by 12%. However, applying urea now will recover 90% of growth within 7 days.",
//       tags: ["Nutrients", "Recovery"],
//       difficulty: "Easy Fix"
//     },
//     {
//       id: 2,
//       title: "Weather Outlook: Heatwave Warning",
//       cause: "Satellite thermal bands show soil temperature rising 4°C above average while NDWI (moisture) is dropping.",
//       prediction: "Expect high transpiration rates. Your Wheat will need 20% more water over the next 3 days to avoid wilting.",
//       tags: ["Weather", "Irrigation"],
//       difficulty: "Preventative"
//     }
//   ];

//   return (
//     <div className="insights-page">
//       <header className="insights-header">
//         <h1>Smart Insights</h1>
//         <p>Expert analysis of your field data</p>
//       </header>

//       <div className="insights-grid">
//         {insights.map(item => (
//           <div key={item.id} className="insight-card">
//             <div className="insight-tags">
//               {item.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
//               <span className="difficulty">{item.difficulty}</span>
//             </div>
            
//             <h2>{item.title}</h2>
            
//             <section className="insight-section">
//               <h3>🔍 Cause</h3>
//               <p>{item.cause}</p>
//             </section>

//             <section className="insight-section next-steps">
//               <h3>🔮 What Happens Next?</h3>
//               <p>{item.prediction}</p>
//             </section>

//             <button className="learn-more-btn">Read Deep Analysis</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default InsightsPage;