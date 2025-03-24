import React from "react";
import Navbar from "../Navbar/Navbar";
import BottomNav from "../BottomNav/BottomNav";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar /> {/*  Top Navbar for Desktop */}
      <div className="pt-16 pb-16"> {/* Space for Navbar & BottomNav */}
        <Outlet /> {/*  Render dynamic pages here */}
      </div>
      <BottomNav /> {/*  Bottom Navigation for Mobile */}
    </div>
  );
};

export default Layout;
