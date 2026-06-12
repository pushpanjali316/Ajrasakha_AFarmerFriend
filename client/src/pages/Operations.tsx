// client/src/pages/Operations.tsx
import React, { useState } from "react";
import { API_BASE } from "../services/api";

const Operations: React.FC = () => {
  const [status, setStatus] = useState<"IDLE" | "RUNNING" | "SUCCESS" | "ERROR">("IDLE");
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<{
    status: string;
    time: string;
    message: string;
  } | null>(null);

  const runPipeline = async () => {
    setStatus("RUNNING");
    setLogs([
      "Initializing Satellite Link...",
      "Authenticating with Sentinel-2 API...",
      "Requesting imagery...",
    ]);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/run-pipeline`, {
        method: "POST",
      });   

      const data = await res.json();

      if (data.status === "Success") {
        setLogs((prev) => [
          ...prev,
          "Data Received.",
          "Processing NDVI...",
          "Updating Database...",
          "DONE.",
        ]);
        setStatus("SUCCESS");
        setResult(data);
      } else {
        throw new Error("Pipeline Failed");
      }
    } catch (err) {
      setStatus("ERROR");
      setLogs((prev) => [...prev, "❌ CONNECTION FAILED", "Retrying..."]);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.card}>
          <div style={styles.topBadge}>🛰 Operations Console</div>

          <h1 style={styles.header}>Satellite Operations Center</h1>
          <p style={styles.subText}>
            Manually trigger a satellite refresh cycle for all registered regions.
          </p>

          <button
            onClick={runPipeline}
            disabled={status === "RUNNING"}
            style={{
              ...styles.button,
              background:
                status === "RUNNING"
                  ? "linear-gradient(135deg, rgba(160,160,160,0.9), rgba(130,130,130,0.9))"
                  : "linear-gradient(135deg, #e53935, #c62828)",
              cursor: status === "RUNNING" ? "not-allowed" : "pointer",
              opacity: status === "RUNNING" ? 0.9 : 1,
            }}
          >
            {status === "RUNNING" ? "PIPELINE RUNNING..." : "RUN PIPELINE"}
          </button>

          <div style={styles.terminal}>
            <div style={styles.terminalHeader}>
              <span style={styles.dotRed}></span>
              <span style={styles.dotYellow}></span>
              <span style={styles.dotGreen}></span>
              <span style={styles.terminalTitle}>live system logs</span>
            </div>

            <p style={styles.systemLine}>$ system_status: ONLINE</p>

            {logs.map((log, i) => (
              <p key={i} style={styles.logLine}>
                {`> ${log}`}
              </p>
            ))}

            {status === "SUCCESS" && result && (
              <div style={styles.resultBox}>
                <p style={styles.resultLine}>
                  <strong>STATUS:</strong> {result.status}
                </p>
                <p style={styles.resultLine}>
                  <strong>TIME:</strong> {result.time}
                </p>
                <p style={styles.resultLine}>
                  <strong>DETAILS:</strong> {result.message}
                </p>
              </div>
            )}

            {status === "ERROR" && (
              <div style={styles.errorBox}>
                <p style={styles.errorText}>Pipeline execution failed. Please try again.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    width: "100%",
    minHeight: "100vh",
    padding: "32px 20px",
    background: "transparent",
  },

  overlay: {
    width: "100%",
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "transparent",
  },

  card: {
    width: "100%",
    maxWidth: "760px",
    padding: "38px",
    borderRadius: "28px",
    background: "rgba(255, 255, 255, 0.14)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255, 255, 255, 0.22)",
    boxShadow: "0 20px 45px rgba(0,0,0,0.18)",
    textAlign: "center",
    color: "#ffffff",
  },

  topBadge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    marginBottom: "18px",
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.18)",
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "rgba(255,255,255,0.9)",
  },

  header: {
    margin: "0 0 10px 0",
    fontSize: "2.3rem",
    fontWeight: 800,
    color: "#ffffff",
    letterSpacing: "-0.5px",
  },

  subText: {
    margin: "0 auto 28px auto",
    maxWidth: "620px",
    fontSize: "1rem",
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.86)",
  },

  button: {
    marginTop: "10px",
    padding: "18px 34px",
    fontSize: "1.08rem",
    fontWeight: 800,
    color: "white",
    border: "none",
    borderRadius: "16px",
    transition: "all 0.25s ease",
    boxShadow: "0 10px 24px rgba(183, 28, 28, 0.28)",
  },

  terminal: {
    marginTop: "34px",
    background: "rgba(17, 24, 39, 0.88)",
    color: "#00e676",
    padding: "22px",
    borderRadius: "18px",
    textAlign: "left",
    minHeight: "260px",
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: "0.95rem",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  },

  terminalHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "18px",
    paddingBottom: "12px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  dotRed: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#ff5f56",
    display: "inline-block",
  },

  dotYellow: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#ffbd2e",
    display: "inline-block",
  },

  dotGreen: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#27c93f",
    display: "inline-block",
  },

  terminalTitle: {
    marginLeft: "10px",
    color: "rgba(255,255,255,0.72)",
    fontSize: "0.88rem",
    fontFamily: "Inter, Segoe UI, sans-serif",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },

  systemLine: {
    color: "#4caf50",
    margin: "0 0 12px 0",
    fontWeight: 700,
  },

  logLine: {
    margin: "7px 0",
    color: "#d1fae5",
    lineHeight: 1.5,
  },

  resultBox: {
    marginTop: "22px",
    paddingTop: "14px",
    borderTop: "1px solid rgba(255,255,255,0.12)",
    color: "#ffffff",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "12px",
    padding: "16px",
  },

  resultLine: {
    margin: "8px 0",
    color: "#f8fafc",
  },

  errorBox: {
    marginTop: "20px",
    padding: "14px 16px",
    borderRadius: "12px",
    background: "rgba(229, 57, 53, 0.14)",
    border: "1px solid rgba(229, 57, 53, 0.3)",
  },

  errorText: {
    margin: 0,
    color: "#fecaca",
    fontFamily: "Inter, Segoe UI, sans-serif",
    fontSize: "0.95rem",
    fontWeight: 600,
  },
};

export default Operations;