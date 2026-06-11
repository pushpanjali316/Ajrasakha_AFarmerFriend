import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Region, RegionHealth } from "../types";

interface Props {
  region: Region | null;
}

export default function RegionPanel({ region }: Props) {
  const [health, setHealth] = useState<RegionHealth | null>(null);

  useEffect(() => {
    if (!region) return;

    api.get(`/regions/${region._id}/health`)
      .then(res => setHealth(res.data));
  }, [region]);

  if (!region) return <div>Select a region</div>;
  if (!health) return <div>Loading health data...</div>;

  return (
    <div>
      <h3>{health.regionName}</h3>
      <p>Latest NDVI: {health.latestNDVI}</p>
      <p>Status: {health.status}</p>
    </div>
  );
}
