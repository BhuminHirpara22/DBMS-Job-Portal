import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBriefcase, FaUser, FaChartBar, FaSignOutAlt, FaBars, FaTimes, FaBuilding, FaFileAlt, FaUsers, FaUserTie, FaClipboardList, FaRobot, FaBell } from "react-icons/fa";
import { getToken, getUserRole } from "../../../tokenUtils";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userType, setUserType] = useState(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine user type from token and redirect if necessary
  useEffect(() => {
    const role = getUserRole();
    if (role) {
      // Check if role contains 'employer' or 'JobSeeker'
      if (role.includes('employer')) {
        setUserType('employer');
        
        // Redirect employer if trying to access job seeker specific pages
        if (location.pathname === '/mainpage' || 
            location.pathname.startsWith('/jobs') || 
            location.pathname.startsWith('/applied-jobs') ||
            location.pathname.startsWith('/job-status') ||
            location.pathname.startsWith('/interviews') ||
            location.pathname.startsWith('/ats-checker') ||
            location.pathname.startsWith('/jobseeker')) {
          navigate('/employer/dashboard');
        }
      } else if (role.includes('JobSeeker')) {
        setUserType('seeker');
        
        // Redirect job seeker if trying to access employer specific pages
        if (location.pathname.startsWith('/employer')) {
          navigate('/mainpage');
        }
      }
    } else {
      // If no token/role, redirect to login
      if (!location.pathname.includes('/login') && 
          !location.pathname.includes('/signup') && 
          location.pathname !== '/' && 
          location.pathname !== '/role') {
        // Redirect to root if not authenticated
        window.location.href = '/';
      }
    }
  }, [location.pathname, navigate]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Employer Navigation Items
  const employerNavItems = [
    { to: "/employer/dashboard", label: "Dashboard", icon: <FaChartBar /> },
    { to: "/employer/jobs", label: "My Jobs", icon: <FaBriefcase /> },
    { to: "/employer/postjob", label: "Post Job", icon: <FaFileAlt /> },
    { to: "/notifications", label: "Notifications", icon: <FaBell /> }, // Added notifications for employers
    { to: "/employer/profile", label: "Profile", icon: <FaBuilding /> },
    { to: "/logout", label: "Logout", icon: <FaSignOutAlt /> }, // Added logout option
  ];

  // Job Seeker Navigation Items
  const seekerNavItems = [
    { to: "/jobs", label: "Find Jobs", icon: <FaBriefcase /> },
    { to: "/applied-jobs", label: "My Applications", icon: <FaClipboardList /> },
    { to: "/job-status", label: "Job Status", icon: <FaChartBar /> },
    { to: "/interviews", label: "Interviews", icon: <FaUserTie /> },
    { to: "/ats-checker", label: "ATS Checker", icon: <FaRobot /> },
    { to: "/notifications", label: "Notifications", icon: <FaBell /> },
    { to: "/jobseeker/profile", label: "Profile", icon: <FaUser /> },
    { to: "/logout", label: "Logout", icon: <FaSignOutAlt /> }, // Added logout option
  ];

  // Get navigation items based on user type
  const navItems = userType === 'employer' ? employerNavItems : seekerNavItems;

  // If no user type is set but we're in a protected route, show nothing until redirect happens
  if (!userType && !location.pathname.includes('/login') && 
      !location.pathname.includes('/signup') && 
      location.pathname !== '/' && 
      location.pathname !== '/role') {
    return null;
  }

  return (
    <nav className={`fixed top-0 w-full flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3 shadow-lg z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800' 
        : 'bg-gray-900/80 backdrop-blur-md border-b border-transparent'
    }`}>
      {/* Logo */}
      <Link to={userType === 'employer' ? "/employer/dashboard" : "/mainpage"} className="flex items-center space-x-2 group">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
          {userType === 'employer' ? <FaBuilding className="text-white text-xl" /> : <FaBriefcase className="text-white text-xl" />}
        </div>
        <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          {userType === 'employer' ? 'Employer Portal' : 'JobPortal'}
        </span>
      </Link>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-50"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
      </button>

      {/* Navigation Links */}
      <div className={`lg:flex space-x-1 absolute lg:relative top-full left-0 w-full lg:w-auto bg-gray-900/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-4 lg:p-0 transform transition-all duration-300 ease-in-out z-40 ${
        isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full lg:translate-y-0 opacity-0 lg:opacity-100'
      }`}>
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            to={item.to}
            label={item.label}
            icon={item.icon}
            active={location.pathname === item.to}
          />
        ))}
      </div>
    </nav>
  );
};

// Nav Item Component (For Reusability)
const NavItem = ({ to, label, icon, active }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-300 hover:bg-gray-800/50 ${
      active 
        ? "text-blue-400 bg-blue-400/10" 
        : "text-gray-300 hover:text-white"
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="text-base lg:text-sm">{label}</span>
  </Link>
);

export default Navbar;
