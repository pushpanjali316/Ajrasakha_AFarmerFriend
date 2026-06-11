// client/src/components/RegionMarkers.tsx
import { Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet"; // Import Leaflet to make custom icons
import { api } from "../services/api";
import type { Region } from "../types";

// Extended interface to include the new 'status' field from backend
interface RegionWithStatus extends Region {
  status: string;
}

interface Props {
  onSelect: (region: Region) => void;
}

export default function RegionMarkers({ onSelect }: Props) {
  const [regions, setRegions] = useState<RegionWithStatus[]>([]);

  useEffect(() => {
    api.get<RegionWithStatus[]>("/regions").then(res => {
      setRegions(res.data);
    });
  }, []);

  // Helper function to pick the icon based on status
  const getIcon = (status: string) => {
    let color = "blue"; // default
    
    // Logic matching your backend "status" strings
    if (status === "Healthy") color = "green";
    if (status === "Moderate") color = "orange";
    if (status === "Critical") color = "red";

    // return new L.Icon({
    //   iconUrl: `/markers/marker-${color}.png`, // Points to public/markers/
    //   iconSize: [25, 41],
    //   iconAnchor: [12, 41],
    //   popupAnchor: [1, -34],
    //   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
    // });
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  return (
    <>
      {regions.map(region => (
        <Marker
          key={region._id}
          position={[
            region.coordinates.lat,
            region.coordinates.lng,
          ]}
          icon={getIcon(region.status)} // <--- Apply the custom icon here
          eventHandlers={{
            click: () => onSelect(region),
          }}
        >
          <Popup>
            <strong>{region.name}</strong><br/>
            Status: {region.status}
            {console.log(region)}
          </Popup>
        </Marker>
      ))}
    </>
  );
}