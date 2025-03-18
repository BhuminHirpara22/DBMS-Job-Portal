import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBriefcase, FaUser, FaClipboardList } from "react-icons/fa";

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="bg-gray-900 text-white fixed bottom-0 w-full flex justify-around items-center py-3 shadow-lg z-50 md:hidden">
      <NavItem to="/jobs" icon={<FaBriefcase />} label="Jobs" active={location.pathname === "/jobs"} />
      <NavItem to="/applications" icon={<FaClipboardList />} label="Apps" active={location.pathname === "/applications"} />
      <NavItem to="/dashboard" icon={<FaHome />} label="Dashboard" active={location.pathname === "/dashboard"} />
      <NavItem to="/profile" icon={<FaUser />} label="Profile" active={location.pathname === "/profile"} />
    </nav>
  );
};

const NavItem = ({ to, icon, label, active }) => (
  <Link to={to} className={`flex flex-col items-center ${active ? "text-blue-400" : "text-gray-300"}`}>
    {icon}
    <span className="text-xs">{label}</span>
  </Link>
);

export default BottomNav;
