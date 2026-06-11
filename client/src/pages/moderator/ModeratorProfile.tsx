// import React, { useEffect, useState } from "react";
// import "../../styles/ModeratorProfile.css";

// interface Farmer {
//   name: string;
//   email: string;
//   location: string;
// }

// interface Alert {
//   message: string;
//   date: string;
//   severity: string;
// }

// const ModeratorProfile: React.FC = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [region, setRegion] = useState("");

//   const [farmers, setFarmers] = useState<Farmer[]>([]);
//   const [alerts, setAlerts] = useState<Alert[]>([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loadingFarmers, setLoadingFarmers] = useState(false);
//   const [loadingAlerts, setLoadingAlerts] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("moderatorToken");
//     const storedRegion = localStorage.getItem("moderatorRegion");
//     const storedName = localStorage.getItem("moderatorName");
//     const storedEmail = localStorage.getItem("moderatorEmail");

//     if (token) {
//       setIsLoggedIn(true);
//       setRegion(storedRegion || "");
//       setName(storedName || "");
//       setEmail(storedEmail || "");
//     }
//   }, []);

//   useEffect(() => {
//     if (!isLoggedIn || !region) return;

//     fetchFarmers(region);
//     fetchAlerts(region);
//   }, [isLoggedIn, region]);

//   const fetchFarmers = async (selectedRegion: string) => {
//     setLoadingFarmers(true);
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/farmers?region=${encodeURIComponent(
//           selectedRegion
//         )}`
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         setFarmers([]);
//         return;
//       }

//       if (Array.isArray(data)) {
//         setFarmers(data);
//       } else if (Array.isArray(data.farmers)) {
//         setFarmers(data.farmers);
//       } else {
//         setFarmers([]);
//       }
//     } catch (err) {
//       console.error("Error fetching farmers:", err);
//       setFarmers([]);
//     } finally {
//       setLoadingFarmers(false);
//     }
//   };

//   const fetchAlerts = async (selectedRegion: string) => {
//     setLoadingAlerts(true);
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/alerts?region=${encodeURIComponent(
//           selectedRegion
//         )}`
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         setAlerts([]);
//         return;
//       }

//       if (Array.isArray(data)) {
//         setAlerts(data);
//       } else if (Array.isArray(data.alerts)) {
//         setAlerts(data.alerts);
//       } else {
//         setAlerts([]);
//       }
//     } catch (err) {
//       console.error("Error fetching alerts:", err);
//       setAlerts([]);
//     } finally {
//       setLoadingAlerts(false);
//     }
//   };

//   const handleLogin = async () => {
//     setErrorMessage("");

//     if (!email || !password) {
//       setErrorMessage("Please enter email and password.");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/moderator/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ email, password })
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setErrorMessage(data.message || "Login failed");
//         return;
//       }

//       const loggedInName = data.name || "Moderator";
//       const loggedInEmail = data.email || email;
//       const loggedInRegion = data.region || "";

//       localStorage.setItem("moderatorToken", data.token || "moderator-token");
//       localStorage.setItem("moderatorRegion", loggedInRegion);
//       localStorage.setItem("moderatorName", loggedInName);
//       localStorage.setItem("moderatorEmail", loggedInEmail);

//       setName(loggedInName);
//       setEmail(loggedInEmail);
//       setRegion(loggedInRegion);
//       setIsLoggedIn(true);
//     } catch (err) {
//       console.error(err);
//       setErrorMessage("Server error");
//     }
//   };

//   const handleTempLogin = async () => {
//     setErrorMessage("");

//     const demoName = "Demo Moderator";
//     const demoEmail = "demo@cropcare.com";
//     const demoRegion = "Godavari Basin (Andhra Pradesh)";
//     const demoToken = "demo-moderator-token";

//     localStorage.setItem("moderatorToken", demoToken);
//     localStorage.setItem("moderatorRegion", demoRegion);
//     localStorage.setItem("moderatorName", demoName);
//     localStorage.setItem("moderatorEmail", demoEmail);

//     setName(demoName);
//     setEmail(demoEmail);
//     setRegion(demoRegion);
//     setIsLoggedIn(true);

//     await fetchFarmers(demoRegion);
//     await fetchAlerts(demoRegion);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("moderatorToken");
//     localStorage.removeItem("moderatorRegion");
//     localStorage.removeItem("moderatorName");
//     localStorage.removeItem("moderatorEmail");

//     setIsLoggedIn(false);
//     setName("");
//     setEmail("");
//     setPassword("");
//     setRegion("");
//     setFarmers([]);
//     setAlerts([]);
//     setErrorMessage("");
//   };

//   return (
//     <div className="moderator-container">
//       {!isLoggedIn ? (
//         <div className="moderator-login">
//           <h2>Moderator Login 🌾</h2>

//           {errorMessage && <p className="error-text">{errorMessage}</p>}

//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button onClick={handleLogin}>Login</button>

//           <button onClick={handleTempLogin} className="google-button">
//             Temp Login
//           </button>
//         </div>
//       ) : (
//         <div className="moderator-dashboard">
//           <h2>Moderator Dashboard 🌾</h2>

//           <div className="moderator-profile">
//             <h3>Profile Info</h3>
//             <p>
//               <strong>Name:</strong> {name}
//             </p>
//             <p>
//               <strong>Email:</strong> {email}
//             </p>
//             <p>
//               <strong>Region:</strong> {region}
//             </p>

//             <button onClick={handleLogout}>Logout</button>
//           </div>

//           <div className="farmers-section">
//             <h3>Users / Farmers in your region</h3>

//             {loadingFarmers ? (
//               <p>Loading farmers...</p>
//             ) : farmers.length === 0 ? (
//               <p>No farmers found.</p>
//             ) : (
//               farmers.map((farmer) => (
//                 <div key={farmer.email} className="farmer-card">
//                   <p>
//                     <strong>Name:</strong> {farmer.name}
//                   </p>
//                   <p>
//                     <strong>Email:</strong> {farmer.email}
//                   </p>
//                   <p>
//                     <strong>Location:</strong> {farmer.location}
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>

//           <div className="alerts-section">
//             <h3>Alerts from database</h3>

//             {loadingAlerts ? (
//               <p>Loading alerts...</p>
//             ) : alerts.length === 0 ? (
//               <p>No alerts found.</p>
//             ) : (
//               alerts.map((alert, index) => (
//                 <div key={index} className="alert-card">
//                   <p>
//                     <strong>Message:</strong> {alert.message}
//                   </p>
//                   <p>
//                     <strong>Severity:</strong> {alert.severity}
//                   </p>
//                   <p>
//                     <strong>Date:</strong>{" "}
//                     {alert.date
//                       ? new Date(alert.date).toLocaleString()
//                       : "No date"}
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ModeratorProfile;
import React, { useEffect, useState } from "react";
import "../../styles/ModeratorProfile.css";

interface Farmer {
  name: string;
  email: string;
  location: string;
}

interface Alert {
  message: string;
  date: string;
  severity: string;
  location?: string;
  region?: string;
}

const ModeratorProfile: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("");

  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingFarmers, setLoadingFarmers] = useState(false);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("moderatorToken");
    const storedRegion = localStorage.getItem("moderatorRegion");
    const storedName = localStorage.getItem("moderatorName");
    const storedEmail = localStorage.getItem("moderatorEmail");

    if (token) {
      setIsLoggedIn(true);
      setRegion(storedRegion || "");
      setName(storedName || "");
      setEmail(storedEmail || "");
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !region) return;

    fetchFarmers(region);
    fetchAlerts(region);
  }, [isLoggedIn, region]);

  const normalize = (value: string) => value.trim().toLowerCase();

  const fetchFarmers = async (selectedRegion: string) => {
    setLoadingFarmers(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/farmers?region=${encodeURIComponent(
          selectedRegion
        )}`
      );

      const data = await res.json();

      let farmersList: Farmer[] = [];

      if (Array.isArray(data)) {
        farmersList = data;
      } else if (Array.isArray(data.farmers)) {
        farmersList = data.farmers;
      }

      // extra safety filter: only same region users
      const filteredFarmers = farmersList.filter(
        (farmer) => normalize(farmer.location) === normalize(selectedRegion)
      );

      setFarmers(filteredFarmers);
    } catch (err) {
      console.error("Error fetching farmers:", err);
      setFarmers([]);
    } finally {
      setLoadingFarmers(false);
    }
  };

  const fetchAlerts = async (selectedRegion: string) => {
    setLoadingAlerts(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/alerts?region=${encodeURIComponent(
          selectedRegion
        )}`
      );

      const data = await res.json();

      let alertsList: Alert[] = [];

      if (Array.isArray(data)) {
        alertsList = data;
      } else if (Array.isArray(data.alerts)) {
        alertsList = data.alerts;
      }

      // if alert has region/location field, filter it too
      const filteredAlerts = alertsList.filter((alert) => {
        const alertRegion = alert.location || alert.region;
        if (!alertRegion) return true; // keep if backend doesn't send region field
        return normalize(alertRegion) === normalize(selectedRegion);
      });

      setAlerts(filteredAlerts);
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setAlerts([]);
    } finally {
      setLoadingAlerts(false);
    }
  };

  const handleLogin = async () => {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter email and password.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/moderator/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Login failed");
        return;
      }

      const loggedInName = data.name || "Moderator";
      const loggedInEmail = data.email || email;
      const loggedInRegion = data.region || "";

      localStorage.setItem("moderatorToken", data.token || "moderator-token");
      localStorage.setItem("moderatorRegion", loggedInRegion);
      localStorage.setItem("moderatorName", loggedInName);
      localStorage.setItem("moderatorEmail", loggedInEmail);

      setName(loggedInName);
      setEmail(loggedInEmail);
      setRegion(loggedInRegion);
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
      setErrorMessage("Server error");
    }
  };

  const handleTempLogin = async () => {
    setErrorMessage("");

    const demoName = "Demo Moderator";
    const demoEmail = "demo@cropcare.com";
    const demoRegion = "Godavari Basin (Andhra Pradesh)";
    const demoToken = "demo-moderator-token";

    localStorage.setItem("moderatorToken", demoToken);
    localStorage.setItem("moderatorRegion", demoRegion);
    localStorage.setItem("moderatorName", demoName);
    localStorage.setItem("moderatorEmail", demoEmail);

    setName(demoName);
    setEmail(demoEmail);
    setRegion(demoRegion);
    setIsLoggedIn(true);

    await fetchFarmers(demoRegion);
    await fetchAlerts(demoRegion);
  };

  const handleLogout = () => {
    localStorage.removeItem("moderatorToken");
    localStorage.removeItem("moderatorRegion");
    localStorage.removeItem("moderatorName");
    localStorage.removeItem("moderatorEmail");

    setIsLoggedIn(false);
    setName("");
    setEmail("");
    setPassword("");
    setRegion("");
    setFarmers([]);
    setAlerts([]);
    setErrorMessage("");
  };

  return (
    <div className="moderator-container">
      {!isLoggedIn ? (
        <div className="moderator-login">
          <h2>Moderator Login 🌾</h2>

          {errorMessage && <p className="error-text">{errorMessage}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Login</button>

          <button onClick={handleTempLogin} className="google-button">
            Temp Login
          </button>
        </div>
      ) : (
        <div className="moderator-dashboard">
          <h2>Moderator Dashboard 🌾</h2>

          <div className="moderator-profile">
            <h3>Profile Info</h3>
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Region:</strong> {region}
            </p>

            <button onClick={handleLogout}>Logout</button>
          </div>

          <div className="farmers-section">
            <h3>Users / Farmers in your region</h3>

            {loadingFarmers ? (
              <p>Loading farmers...</p>
            ) : farmers.length === 0 ? (
              <p>No farmers found for {region}.</p>
            ) : (
              farmers.map((farmer) => (
                <div key={farmer.email} className="farmer-card">
                  <p>
                    <strong>Name:</strong> {farmer.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {farmer.email}
                  </p>
                  <p>
                    <strong>Location:</strong> {farmer.location}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="alerts-section">
            <h3>Alerts from database</h3>

            {loadingAlerts ? (
              <p>Loading alerts...</p>
            ) : alerts.length === 0 ? (
              <p>No alerts found for {region}.</p>
            ) : (
              alerts.map((alert, index) => (
                <div key={index} className="alert-card">
                  <p>
                    <strong>Message:</strong> {alert.message}
                  </p>
                  <p>
                    <strong>Severity:</strong> {alert.severity}
                  </p>
                  {/* <p>
                    <strong>Date:</strong>{" "}
                    {alert.date
                      ? new Date(alert.date).toLocaleString()
                      : "No date"}
                  </p> */}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorProfile;