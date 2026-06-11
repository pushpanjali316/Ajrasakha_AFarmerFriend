import React,{useEffect,useState} from "react";
import "../styles/farmersPage.css";

interface Farmer{
  name:string;
  email:string;
  location:string;
}

const FarmersPage:React.FC=()=>{

  const[farmers,setFarmers]=useState<Farmer[]>([]);
  const[loading,setLoading]=useState(true);

  useEffect(()=>{
    fetchFarmers();
  },[]);

  const fetchFarmers=async()=>{
    try{

      const res=await fetch("http://localhost:5000/api/farmers");

      const data=await res.json();

      setFarmers(data);

    }catch(err){
      console.error("Error fetching farmers",err);
    }finally{
      setLoading(false);
    }
  };

  if(loading){
    return <div className="farmers-container">Loading farmers...</div>;
  }

  return(

    <div className="farmers-container">

      <h2>Registered Farmers 🌾</h2>

      <table className="farmers-table">

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Location</th>
          </tr>
        </thead>

        <tbody>

          {farmers.length===0 ? (

            <tr>
              <td colSpan={3}>No farmers added yet</td>
            </tr>

          ) : (

            farmers.map((farmer,index)=>(
              <tr key={index}>
                <td>{farmer.name}</td>
                <td>{farmer.email}</td>
                <td>{farmer.location}</td>
              </tr>
            ))

          )}

        </tbody>

      </table>

    </div>
  );
};

export default FarmersPage;