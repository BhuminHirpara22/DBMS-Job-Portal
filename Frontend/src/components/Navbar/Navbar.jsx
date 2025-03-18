import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation(); // Highlight active route

  return (
    <nav className="bg-gray-900 text-white fixed top-0 w-full flex justify-between items-center px-8 py-3 shadow-lg z-50">
      {/* Logo */}
      <Link to="/jobs" className="text-xl font-bold">
        JobPortal
      </Link>

      {/* Navigation Links */}
      <div className="flex space-x-6">
        <NavItem to="/jobs" label="Jobs" active={location.pathname === "/jobs"} />
        <NavItem to="/applications" label="Applications" active={location.pathname === "/applications"} />
        <NavItem to="/dashboard" label="Dashboard" active={location.pathname === "/dashboard"} />
        <NavItem to="/profile" label="Profile" active={location.pathname === "/profile"} />
      </div>
    </nav>
  );
};

// Nav Item Component (For Reusability)
const NavItem = ({ to, label, active }) => (
  <Link to={to} className={`hover:text-blue-400 ${active ? "text-blue-400" : "text-gray-300"}`}>
    {label}
  </Link>
);

export default Navbar;
