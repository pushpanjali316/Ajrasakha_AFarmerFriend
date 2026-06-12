import { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // On mobile: auto-open panel when a region is selected
  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    if (isMobile) setShowPanel(true);
  };

  return (
    <div style={isMobile ? styles.pageMobile : styles.page}>

      {/* ── MAP ── */}
      <div style={isMobile ? styles.mapWrapperMobile : styles.mapWrapper}>
        <div style={isMobile ? styles.mapGlassMobile : styles.mapGlass}>
          <MapContainer
            center={[22.5, 78.9]}
            zoom={isMobile ? 4 : 5}
            style={styles.map}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <MapController selectedState={selectedState} />
            <RegionMarkers onSelect={handleRegionSelect} />
          </MapContainer>
        </div>
      </div>

      {/* ── MOBILE: floating toggle button ── */}
      {isMobile && (
        <button
          style={styles.floatingBtn}
          onClick={() => setShowPanel(v => !v)}
        >
          {showPanel ? "🗺 Map" : "📋 Panel"}
        </button>
      )}

      {/* ── SIDE PANEL ── */}
      {/* Desktop: always visible | Mobile: shown as overlay when toggled */}
      <div style={
        isMobile
          ? { ...styles.sidePanelMobile, ...(showPanel ? styles.sidePanelMobileVisible : styles.sidePanelMobileHidden) }
          : styles.sidePanel
      }>

        {/* STATE NAVIGATOR */}
        <div style={isMobile ? styles.topPanelMobile : styles.topPanel}>
          <div style={styles.panelTitle}>State Navigator</div>
          <div style={styles.scrollArea}>
            <StatePanel
              states={INDIA_STATES}
              onSelect={(state) => {
                setSelectedState(state);
                if (isMobile) setShowPanel(false); // go back to map after selecting
              }}
            />
          </div>
        </div>

        {/* REGION DETAILS */}
        <div style={isMobile ? styles.bottomPanelMobile : styles.bottomPanel}>
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

/* ── SHARED TOKENS ── */
const glassCard: React.CSSProperties = {
  background: "rgba(20, 60, 30, 0.55)", // dark green instead of white
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.25)",
  borderRadius: "24px",
};

const styles: { [key: string]: React.CSSProperties } = {

  /* ── DESKTOP ── */
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

  /* ── MOBILE ── */
  pageMobile: {
    position: "relative",
    width: "100%",
    height: "calc(100vh - 60px)", // shorter navbar on mobile
    background: "transparent",
    overflow: "hidden",
  },
  mapWrapperMobile: {
    position: "absolute",
    inset: 0,
  },
  mapGlassMobile: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  // panel slides up from bottom on mobile
  sidePanelMobile: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70vh",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "12px",
    boxSizing: "border-box",
    transition: "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
    zIndex: 1000,
  },
  sidePanelMobileVisible: {
    transform: "translateY(0%)",
  },
  sidePanelMobileHidden: {
    transform: "translateY(110%)",
  },
  topPanelMobile: {
    ...glassCard,
    height: "45%",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  bottomPanelMobile: {
    ...glassCard,
    flex: 1,
    padding: "16px",
    color: "white",
    overflowY: "auto",
  },
  floatingBtn: {
    position: "absolute",
    bottom: "24px",
    right: "16px",
    zIndex: 1100,
    background: "rgba(47, 111, 62, 0.92)",
    backdropFilter: "blur(12px)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "20px",
    padding: "10px 20px",
    fontWeight: 700,
    fontSize: "0.9rem",
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
  },

  /* ── SHARED ── */
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