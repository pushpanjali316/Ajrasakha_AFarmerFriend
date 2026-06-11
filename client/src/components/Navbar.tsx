import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  const [menuOpen,setMenuOpen]=useState(false);
  return (
    <div style={styles.navbar}>
      <h2 style={{margin:0, fontSize:"1.4rem", whiteSpace:"nowrap"}}>
      🌾 CropCare Advisor
      </h2>
          <button
            className="menuButton"
            onClick={()=>setMenuOpen(!menuOpen)}
            >
            ☰
            </button>
        <ul className={`navList ${menuOpen ? "mobileMenu" : ""}`}>
          <li>
          <NavLink to="/" style={navStyle} onClick={()=>setMenuOpen(false)}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/ops" style={navStyle} onClick={()=>setMenuOpen(false)}>
            Ops Center
          </NavLink>
        </li>
        <li>
          <NavLink to="/map" style={navStyle} onClick={()=>setMenuOpen(false)}>
            Live Map
          </NavLink>
       </li>

        <li>
          <NavLink to="/alerts" style={navStyle} onClick={()=>setMenuOpen(false)}>
            Alerts
          </NavLink>
        </li>

        <li>
          <NavLink to="/insights" style={navStyle} onClick={()=>setMenuOpen(false)}>
            Insights
          </NavLink>
        </li>

        <li>
          <NavLink to="/moderator-profile" style={navStyle} onClick={()=>setMenuOpen(false)}>
            Moderator Profile
          </NavLink>
        </li>

        <li>
          <NavLink to="/add-farmer" style={{...navStyle({isActive: false}), background: '#dc2626', padding: '8px 16px', borderRadius: '4px' }} onClick={()=>setMenuOpen(false)}>
            Add Farmer
          </NavLink>
        </li>

        <li>
        <NavLink
          to="/login"
          style={{
            ...navStyle({isActive: false}),background: '#dc2626',padding: '8px 16px',borderRadius: '4px'
          }}
          onClick={()=>setMenuOpen(false)}
        >
          Admin Login
        </NavLink>
      </li>

      </ul>
    </div>
  );
};

const navStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  color: isActive ? "#38bdf8" : "white",
  textDecoration: "none",
  fontWeight: isActive ? "bold" : "normal",
});

const styles: { [key: string]: React.CSSProperties } = {
  navbar:{
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  padding:"12px 16px",
  background:"#1e293b",
  color:"white",
  position:"relative",
  zIndex:10000
},

  navList: {
    display: "flex",
    listStyle: "none",
    gap: "25px",
    margin: 0,
    padding: 0,
  },
  menuButton:{
  display:"block",
  fontSize:"24px",
  background:"none",
  border:"none",
  color:"white",
  cursor:"pointer",
  marginLeft:"auto"
},
  
mobileMenu:{
  display:"flex",
  flexDirection:"column",
  position:"fixed",
  top:"70px",
  left:"0",
  width:"100%",
  background:"#1e293b",
  padding:"20px",
  gap:"15px",
  zIndex:9999,
},
};

export default Navbar;
