import React, { useState, useEffect } from 'react';
import CropSelector from '../components/CropSelector';
import SwipeableCards from '../components/SwipeableCards';
import '../styles/Dashboard.css';
import { API_BASE } from "../services/api";

// Define the shape of data we expect from the API
interface DashboardData {
  healthScore: number;
  ndvi: number;
  ndwiScore: number;
  status: string;
  trend: string;
  weeklyChange: string;
}

const Dashboard: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Rice');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [regionId, setRegionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch all regions
        const regionsRes = await fetch(`${API_BASE}/api/regions`);
        const regions = await regionsRes.json();
        
        // 2. Find the region ID that matches the selected crop
        const matchedRegion = regions.find((r: any) => 
          r.cropType.toLowerCase() === selectedCrop.toLowerCase()
        );
        // console.log(matchedRegion);
        if (matchedRegion) {
          // 3. ZERO-LATENCY MAPPING: 
          // We already have the data! Just shape it for the SwipeableCards.
          setRegionId(matchedRegion._id);
          const mappedData: DashboardData = {
            ndvi: matchedRegion.latestNDVI || 0,
            healthScore: matchedRegion.latestNDVI || 0, 
            // Calculate a mock NDWI (moisture) based on NDVI for the water card
            ndwiScore: matchedRegion.latestNDVI ? parseFloat((matchedRegion.latestNDVI * 0.8).toFixed(2)) : 0.45,
            status: matchedRegion.status || "Unknown",
            trend: matchedRegion.trend || "stable",
            // Generate a dynamic percentage string based on the trend
            weeklyChange: matchedRegion.weeklyChange || "0%",
          };
          // console.log(mappedData);
          setData(mappedData);
        } else {
          console.warn(`No region found for ${selectedCrop}`);
          setData(null);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedCrop]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>CropCare Advisor</h1>
        <p>Satellite-based health monitoring</p>
      </header>
      
      <CropSelector 
        selected={selectedCrop} 
        onSelect={(crop) => setSelectedCrop(crop)} 
      />
      {/*{console.log(data)}*/}
      {loading ? (
        <div style={{textAlign: 'center', padding: '20px', color: 'white'}}>
          Scanning Satellite Data... 📡
        </div>
      ) : data ? (
        <SwipeableCards data={data} cropName={selectedCrop} regionId={regionId}/>
      ) : (
        <div style={{textAlign: 'center', padding: '20px', color: '#ccc'}}>
          No sensor data available for {selectedCrop}.
        </div>
      )}
    </div>
  );
};

export default Dashboard;