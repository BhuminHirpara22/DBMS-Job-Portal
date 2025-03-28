import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken, removeToken, getUserRole } from "../../../tokenUtils";
import { 
  FaCog, 
  FaPalette, 
  FaSignOutAlt, 
  FaUserMinus, 
  FaCheck, 
  FaExclamationTriangle 
} from "react-icons/fa";

const Settings = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark"); // Default theme
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const themes = [
    { value: "dark", label: "Dark", colors: { primary: "#1e293b", secondary: "#334155" } },
    { value: "light", label: "Light", colors: { primary: "#f8fafc", secondary: "#e2e8f0" } },
    { value: "purple", label: "Purple", colors: { primary: "#6b21a8", secondary: "#9333ea" } },
    { value: "honeybee", label: "HoneyBee", colors: { primary: "#facc15", secondary: "#f59e0b" } },
    { value: "luxury", label: "Luxury", colors: { primary: "#374151", secondary: "#111827" } },
    { value: "professional", label: "Professional", colors: { primary: "#0f172a", secondary: "#1e293b" } },
  ];

  // Create background particles
  useEffect(() => {
    const createInitialParticles = () => {
      const initialParticles = Array.from({ length: 25 }, () => ({
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2.5 + 1,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.3 + 0.1,
      }));
      setParticles(initialParticles);
    };

    createInitialParticles();
  }, []);

  // Update particle positions
  useEffect(() => {
    let animationFrameId;
    let lastUpdate = 0;
    const updateInterval = 50; // Update every 50ms

    const updateParticles = (timestamp) => {
      if (timestamp - lastUpdate >= updateInterval) {
        setParticles(prev => 
          prev.map(particle => ({
            ...particle,
            x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
            y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
          }))
        );
        lastUpdate = timestamp;
      }
      animationFrameId = requestAnimationFrame(updateParticles);
    };

    animationFrameId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("preferred-theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = getToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Successfully logged out!");
      setTimeout(() => {
        removeToken();
        navigate("/");
      }, 1500);
    } catch (error) {
      setError("Failed to logout. Please try again.");
      setIsLoading(false);
    }
  };

  const initiateDeleteAccount = () => {
    setShowConfirmation(true);
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = getToken();
      const userType = getUserRole(); // "job_seeker" or "employer"
      const endpoint =
        userType === "employer"
          ? `${import.meta.env.VITE_API_URL}/user/delete_employer/${token}`
          : `${import.meta.env.VITE_API_URL}/user/delete_jobseeker/${token}`;

      await axios.delete(endpoint, {
        headers: {
        //   Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Account deleted successfully. Redirecting...");
      setTimeout(() => {
        removeToken();
        navigate("/");
      }, 2000);
    } catch (error) {
      setError("Failed to delete account. Please try again.");
      setIsLoading(false);
    } finally {
      setShowConfirmation(false);
    }
  };

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("preferred-theme", selectedTheme);
    setSuccess(`Theme changed to ${selectedTheme}!`);
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            transform: `scale(${particle.size})`,
            background: `rgba(59, 130, 246, ${particle.opacity})`,
          }}
        />
      ))}

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="relative mb-2">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 inline-flex items-center gap-3">
              <FaCog className="text-blue-400 animate-spin-slow" />
              Settings
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 blur-2xl -z-10"></div>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            Manage your account and preferences
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300">
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-center mb-6 bg-red-500/10 p-4 rounded-lg animate-fadeIn">
              <FaExclamationTriangle />
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="flex items-center gap-2 text-green-400 text-center mb-6 bg-green-500/10 p-4 rounded-lg animate-fadeIn">
              <FaCheck />
              <p>{success}</p>
            </div>
          )}

          {/* Theme Selection with previews */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-gray-300 font-medium mb-4 text-lg">
              <FaPalette className="text-blue-400" />
              <span>Select Theme</span>
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {themes.map((t) => (
                <div 
                  key={t.value} 
                  className={`cursor-pointer rounded-lg border-2 p-3 transition-all duration-300 ${
                    theme === t.value 
                      ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                  onClick={() => {
                    setTheme(t.value);
                    document.documentElement.setAttribute("data-theme", t.value);
                    localStorage.setItem("preferred-theme", t.value);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span>{t.label}</span>
                    {theme === t.value && <FaCheck className="text-blue-500" />}
                  </div>
                  <div className="flex gap-2">
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: t.colors.primary }}
                    ></div>
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: t.colors.secondary }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <select
              value={theme}
              onChange={handleThemeChange}
              className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              aria-label="Select theme"
            >
              {themes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Logout Button */}
          <div className="mb-6">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <FaSignOutAlt className="text-xl" />
              {isLoading ? "Processing..." : "Logout"}
            </button>
          </div>

          {/* Delete Account Button */}
          <div>
            <button
              onClick={initiateDeleteAccount}
              disabled={isLoading || showConfirmation}
              className="w-full px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <FaUserMinus className="text-xl" />
              Delete Account
            </button>
          </div>
          
          {/* Delete Account Confirmation Dialog */}
          {showConfirmation && (
            <div className="mt-6 border border-red-500/50 rounded-lg p-4 bg-red-500/10 animate-fadeIn">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Are you sure?</h3>
              <p className="text-gray-300 mb-4">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-colors disabled:opacity-70"
                >
                  {isLoading ? "Processing..." : "Yes, Delete Account"}
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors disabled:opacity-70"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Decorative Element */}
        <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 mt-10 rounded-full opacity-40"></div>
      </div>
      
      {/* Gradient Overlays */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-900 to-transparent"></div>
    </div>
  );
};

export default Settings;
