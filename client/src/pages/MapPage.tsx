// client/src/pages/MapPage.tsx
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { INDIA_STATES, type StateInfo } from "../data/indiaStates";
import StatePanel from "../components/StatePanel";
import MapController from "../components/MapController";
import RegionMarkers from "../components/RegionMarkers";
import RegionPanel from "../components/RegionPanel";
import type { Region } from "../types";

export default function MapPage() {
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  return (
    <div style={styles.page}>
      {/* LEFT: MAP */}
      <div style={styles.mapWrapper}>
        <div style={styles.mapGlass}>
          <MapContainer
            center={[22.5, 78.9]}
            zoom={5}
            style={styles.map}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <MapController selectedState={selectedState} />
            <RegionMarkers onSelect={setSelectedRegion} />
          </MapContainer>
        </div>
      </div>

      {/* RIGHT: SIDE PANEL */}
      <div style={styles.sidePanel}>
        {/* TOP: STATE SELECTOR */}
        <div style={styles.topPanel}>
          <div style={styles.panelTitle}>State Navigator</div>
          <div style={styles.scrollArea}>
            <StatePanel
              states={INDIA_STATES}
              onSelect={setSelectedState}
            />
          </div>
        </div>

        {/* BOTTOM: REGION DETAILS */}
        <div style={styles.bottomPanel}>
          <h3 style={styles.regionTitle}>Region Details</h3>

          {selectedRegion ? (
            <RegionPanel region={selectedRegion} />
          ) : (
            <p style={styles.regionText}>
              Click a marker on the map to see live crop health.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const glassCard: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.14)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255, 255, 255, 0.22)",
  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.16)",
  borderRadius: "24px",
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    gap: "18px",
    padding: "20px",
    height: "calc(100vh - 84px)",
    width: "100%",
    background: "transparent",
    boxSizing: "border-box",
  },

  mapWrapper: {
    flex: 1,
    minWidth: 0,
    height: "100%",
  },

  mapGlass: {
    ...glassCard,
    height: "100%",
    overflow: "hidden",
  },

  map: {
    height: "100%",
    width: "100%",
  },

  sidePanel: {
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    height: "100%",
  },

  topPanel: {
    ...glassCard,
    height: "50%",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  bottomPanel: {
    ...glassCard,
    flex: 1,
    padding: "20px",
    color: "white",
    overflowY: "auto",
  },

  panelTitle: {
    color: "white",
    fontSize: "1rem",
    fontWeight: 800,
    marginBottom: "12px",
  },

  scrollArea: {
    flex: 1,
    overflowY: "auto",
  },

  regionTitle: {
    margin: "0 0 14px 0",
    color: "white",
    fontSize: "1.5rem",
    fontWeight: 800,
  },

  regionText: {
    margin: 0,
    color: "rgba(255,255,255,0.88)",
    lineHeight: 1.6,
    fontSize: "1rem",
  },
};