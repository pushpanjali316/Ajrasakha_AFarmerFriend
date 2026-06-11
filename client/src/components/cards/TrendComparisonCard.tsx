import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import '../../styles/Cards.css';

const TrendComparisonCard = ({ cropName }: { cropName: string }) => {
  // Mock history data
  const data = [
    { period: 'Last Year', value: 0.65 },
    { period: 'Last Month', value: 0.72 },
    { period: 'Last Week', value: 0.78 },
    { period: 'Current', value: 0.82 },
  ];

  return (
    <div className="card trend-card">
      <h3>📈 {cropName} Growth Trend</h3>
      <div className="chart-container" style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="period" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis hide domain={[0, 1]} />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="value" radius={[5, 5, 0, 0]}>
              {/* CHANGE: Replaced 'entry' with '_' */}
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={index === 3 ? '#2e7d32' : '#82ca9d'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card-info">
        <p>Growth is <strong>8% higher</strong> than last month.</p>
        <p>Prediction: <strong>Peak harvest in 14 days.</strong></p>
      </div>
    </div>
  );
};

export default TrendComparisonCard;

// import { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";
// import "../../styles/Cards.css";

// const TrendComparisonCard = ({ regionId }: { regionId: string }) => {
//   const [data, setData] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchTrend = async () => {
//       const res = await fetch(
//         `http://localhost:5000/api/regions/${regionId}/health`,
//       );
//       const result = await res.json();

//       // const chartData = result.history.map((item: any, index: number) => ({
//       //   period: `Day ${index + 1}`,
//       //   value: item.ndvi
//       // }));
//       const chartData = result.history.map((item: any, index: number) => {
//         const date = new Date();
//         // Go back from today
//         date.setDate(date.getDate() - (result.history.length - 1 - index));
//         const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
//         return {
//           period: dayName, // Mon, Tue, Wed...
//           value: item.ndvi,
//         };
//       });

//       setData(chartData);
//     };

//     fetchTrend();
//   }, [regionId]);

//   return (
//     <div className="card trend-card">
//       <h3>📈 Crop Growth Trend</h3>

//       <div className="chart-container" style={{ width: "100%", height: 200 }}>
//         <ResponsiveContainer>
//           <BarChart data={data}>
//             <XAxis
//               dataKey="period"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//             />
//             <YAxis hide domain={[0, 1]} />
//             <Tooltip cursor={{ fill: "transparent" }} />

//             <Bar dataKey="value" radius={[5, 5, 0, 0]}>
//               {data.map((_, index) => (
//                 <Cell
//                   key={index}
//                   fill={index === data.length - 1 ? "#2e7d32" : "#82ca9d"}
//                 />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="card-info">
//         <p>Trend based on satellite NDVI history.</p>
//       </div>
//     </div>
//   );
// };

// export default TrendComparisonCard;
