import React from "react";
import type { StateInfo } from "../data/indiaStates";

interface StatePanelProps {
  states: StateInfo[];
  onSelect: (state: StateInfo) => void;
}

export default function StatePanel({ states, onSelect }: StatePanelProps) {
  return (
    <div style={styles.wrapper}>
      {states.map((state) => (
        <button
          key={state.name}
          style={styles.stateButton}
          onClick={() => onSelect(state)}
        >
          <div style={styles.stateName}>{state.name}</div>
          <div style={styles.stateMeta}>
            Lat: {state.center[0].toFixed(1)}, Lng: {state.center[1].toFixed(1)}
          </div>
        </button>
      ))}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    paddingRight: "6px",
  },

  stateButton: {
    width: "100%",
    textAlign: "left",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    background: "rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    color: "white",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 8px 20px rgba(0,0,0,0.10)",
  },

  stateName: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: "4px",
  },

  stateMeta: {
    fontSize: "0.82rem",
    color: "rgba(255,255,255,0.75)",
  },
};