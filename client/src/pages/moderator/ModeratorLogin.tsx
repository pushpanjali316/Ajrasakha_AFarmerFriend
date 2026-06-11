import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ModeratorProfile.css";

const ModeratorLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/moderator/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Login failed");
        return;
      }

      // save token and region in localStorage
      localStorage.setItem("moderatorToken", data.token);
      localStorage.setItem("moderatorRegion", data.region);

      navigate("/moderator-dashboard");
    } catch (err) {
      console.error(err);
      setErrorMessage("Server error");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="moderator-container">
      <h2>Moderator Login</h2>
      {errorMessage && <p className="error-text">{errorMessage}</p>}
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleGoogleLogin} className="google-button">Login with Google</button>
    </div>
  );
};

export default ModeratorLogin;