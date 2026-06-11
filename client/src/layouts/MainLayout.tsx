import React from "react";
import Navbar from "../components/Navbar";

interface Props {
  children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div style={{ padding: "30px" }}>
        {children}
      </div>
    </>
  );
};

export default MainLayout;
