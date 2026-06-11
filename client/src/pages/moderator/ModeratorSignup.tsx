import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ModeratorProfile.css";

const ModeratorSignup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async () => {
    setErrorMessage("");
    if (!name || !email || !region || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/moderator/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, region, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Signup failed.");
        return;
      }

      alert("Signup Successful! Please login.");
      navigate("/moderator-login");
    } catch (err) {
      console.error(err);
      setErrorMessage("Server error. Try again later.");
    }
  };

  const handleGoogleSignup = () => {
    // redirect to backend OAuth route
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="moderator-container">
      <h2>Moderator Signup</h2>
      {errorMessage && <p className="error-text">{errorMessage}</p>}
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <select value={region} onChange={(e) => setRegion(e.target.value)}>
        <option value="">Select Region</option>
        <option value="Ludhiana Fields (Punjab)">Ludhiana Fields (Punjab)</option>
        <option value="Godavari Basin (Andhra Pradesh)">Godavari Basin (Andhra Pradesh)</option>
        <option value="Dharwad Farms (Karnataka)">Dharwad Farms (Karnataka)</option>
        <option value="Palakkad Gap (Kerala)">Palakkad Gap (Kerala)</option>
        <option value="Thanjavur Rice Belt (Tamil Nadu)">Thanjavur Rice Belt (Tamil Nadu)</option>
      </select>
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
      <button onClick={handleGoogleSignup} className="google-button">Sign Up with Google</button>
    </div>
  );
};

export default ModeratorSignup;