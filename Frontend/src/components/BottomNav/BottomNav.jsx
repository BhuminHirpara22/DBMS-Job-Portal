import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBriefcase, FaUser, FaClipboardList, FaBuilding, FaPlus, FaBell, FaChartBar, FaUserTie, FaFileAlt } from "react-icons/fa";
import { getToken, getUserRole } from "../../../tokenUtils";

const BottomNav = () => {
  const location = useLocation();
  const role = getUserRole();
  const isEmployer = role?.includes('employer');

  const seekerNavItems = [
    { to: "/jobs", icon: <FaBriefcase />, label: "Jobs" },
    { to: "/applied-jobs", icon: <FaClipboardList />, label: "Apps" },
    { to: "/job-status", icon: <FaChartBar />, label: "Status" },
    { to: "/interviews", icon: <FaUserTie />, label: "Interviews" },
    { to: "/notifications", icon: <FaBell />, label: "Alerts" },
    { to: "/jobseeker/profile", icon: <FaUser />, label: "Profile" },
  ];

  const employerNavItems = [
    { to: "/employer/dashboard", icon: <FaHome />, label: "Home" },
    { to: "/employer/jobs", icon: <FaBriefcase />, label: "Jobs" },
    { to: "/employer/postjob", icon: <FaPlus />, label: "Post" },
    { to: "/notifications", icon: <FaBell />, label: "Alerts" },
    { to: "/employer/profile", icon: <FaBuilding />, label: "Company" },
  ];

  const navItems = isEmployer ? employerNavItems : seekerNavItems;

  return (
    <nav className="bg-gray-900 text-white fixed bottom-0 w-full flex justify-around items-center py-3 shadow-lg z-50 md:hidden">
      {navItems.map((item) => (
        <NavItem
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
          active={location.pathname === item.to}
        />
      ))}
    </nav>
  );
};

const NavItem = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex flex-col items-center transition-colors duration-200 ${
      active ? "text-blue-400" : "text-gray-300 hover:text-gray-100"
    }`}
  >
    <span className="text-xl mb-1">{icon}</span>
    <span className="text-xs font-medium">{label}</span>
  </Link>
);

export default BottomNav;
