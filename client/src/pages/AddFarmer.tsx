import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../styles/addFarmer.css";

const AddFarmer: React.FC = () => {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [location,setLocation]=useState("");
  const [errorMessage,setErrorMessage]=useState("");
  const navigate=useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  const validateEmail=(email:string)=>{
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleAddFarmer = async () => {

  setErrorMessage("");

  if (!name || !email || !location) {
    alert("Please fill all fields");
    return;
  }

  if (!validateEmail(email)) {
    setErrorMessage("Please enter a valid email address (e.g. name@mail.com)");
    return;
  }

  try {

    const res = await fetch("http://localhost:5000/api/add-farmer",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({name,email,location})
    });

    const data = await res.json();

    if(!res.ok){
      setErrorMessage(data.message || "Farmer already exists.");
      return;
    }

    alert("Farmer Added Successfully 🌾");

    setName("");
    setEmail("");
    setLocation("");

    navigate("/add-farmer");

  } catch(err) {
    console.error(err);
    setErrorMessage("Could not connect to server.");
  }
};

  return (
    <div className="farmer-container">
      <div className="farmer-card">
        <h2>Add Farmer 🌾</h2>

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        <div className="input-group">

          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="farmer-input"
          />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="farmer-input"
            style={{borderColor:errorMessage.includes("email")?"red":""}}
          />

          <select
            value={location}
            onChange={(e)=>setLocation(e.target.value)}
            className="farmer-input farmer-select"
          >
            <option value="">Select Region</option>
            <option value="Ludhiana Fields (Punjab)">Ludhiana Fields (Punjab)</option>
            <option value="Godavari Basin (Andhra Pradesh)">Godavari Basin (Andhra Pradesh)</option>
            <option value="Dharwad Farms (Karnataka)">Dharwad Farms (Karnataka)</option>
            <option value="Palakkad Gap (Kerala)">Palakkad Gap (Kerala)</option>
            <option value="Thanjavur Rice Belt (Tamil Nadu)">Thanjavur Rice Belt (Tamil Nadu)</option>
          </select>

        </div>

        <button onClick={handleAddFarmer} className="farmer-button">
          Add Farmer
        </button>

      </div>
    </div>
  );
};

export default AddFarmer;