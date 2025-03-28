import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken, removeToken, getUserRole } from "../../../tokenUtils";

const Settings = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark"); // Default theme
  const [error, setError] = useState("");

  const themes = [
    { value: "dark", label: "Dark" },
    { value: "light", label: "Light" },
    { value: "purple", label: "Purple" },
    { value: "honeybee", label: "HoneyBee" },
    { value: "luxury", label: "Luxury" },
    { value: "professional", label: "Professional" },
  ];

  const handleLogout = async () => {
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
      removeToken();
      navigate("/");
    } catch (error) {
      setError("Failed to logout. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) {
      return;
    }

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

      removeToken();
      navigate("/");
    } catch (error) {
      setError("Failed to delete account. Please try again.");
    }
  };

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Settings
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Manage your account and preferences
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300">
          {error && (
            <p className="text-red-400 text-center mb-4">{error}</p>
          )}

          {/* Theme Selection */}
          <div className="mb-6">
            <label className="block text-gray-300 font-medium mb-2">
              Select Theme
            </label>
            <select
              value={theme}
              onChange={handleThemeChange}
              className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Logout
            </button>
          </div>

          {/* Delete Account Button */}
          <div>
            <button
              onClick={handleDeleteAccount}
              className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
