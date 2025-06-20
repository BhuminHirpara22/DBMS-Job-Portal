import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaUser, FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaBriefcase, FaUsers, FaChartLine, FaCalendarAlt, FaCog } from "react-icons/fa";
import { getToken } from "../../../tokenUtils";
import Settings from "../Settings/Settings";
import axios from "axios";

const EmployerProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    company_name: "",
    email: "",
    phone: "",
    location: "",
    description: "",
    website: "",
    industry: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const fetchProfile = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/get_employer/${token}`, {
        headers: {},
      });

      console.log(response);
      if (!(response.status === 200)) throw new Error("Failed to fetch profile");

      const data = response.data.profile;
      const safeProfile = {
        name: data.contact_person || "",
        company_name: data.company_name || "",
        email: data.email || "",
        phone: data.contact_number || "",
        location: data.location || "",
        description: data.description || "",
        website: data.website || "",
        industry: data.industry || "",
      };

      setProfile(safeProfile);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();

      const payload = {
        id: profile.id || 0,
        company_id: 1,
        email: profile.email,
        password: "placeholder",
        description: profile.description || null,
        contact_person: profile.name || null,
        contact_number: profile.phone || null,
        company_name: profile.company_name,
        industry: profile.industry || null,
        website: profile.website || null,
        location: profile.location || null,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/update_employer/${token}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) throw new Error("Failed to update profile");

      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      setError(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button
          onClick={fetchProfile}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (showSettings) {
    return <Settings />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Company Profile
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Manage your company information and settings
          </p>
          <button
            onClick={toggleSettings}
            className="absolute right-0 top-0 p-2 text-blue-400 hover:text-blue-300 transition-colors"
            title="Settings"
          >
            <FaCog size={24} />
          </button>
        </div>

        {/* Main Profile Container */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Company Name */}
              <div className="group sm:col-span-2">
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaBuilding className="mr-2 text-blue-400" />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-75"
                  required
                />
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaBuilding className="mr-2 text-blue-400" />
                  Company Name
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={profile.company_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-75"
                  required
                />
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaEnvelope className="mr-2 text-blue-400" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-75"
                  required
                />
              </div>

              {/* Phone */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaPhone className="mr-2 text-blue-400" />
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-75"
                  required
                />
              </div>

              {/* Website */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaBuilding className="mr-2 text-blue-400" />
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={profile.website}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-75"
                  required
                />
              </div>

              {/* Industry */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaBriefcase className="mr-2 text-blue-400" />
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  value={profile.industry}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-75"
                  required
                />
              </div>
            </div>

            {/* Company Description */}
            <div className="group">
              <label className="block text-gray-300 font-medium mb-2 flex items-center">
                <FaFileAlt className="mr-2 text-blue-400" />
                Company Description
              </label>
              <textarea
                name="description"
                value={profile.description}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[150px] disabled:opacity-75"
                required
                placeholder="Describe your company..."
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-lg shadow-gray-500/20 hover:shadow-gray-500/30 transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <FaTimes className="inline-block mr-2" /> Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <FaSave className="inline-block mr-2" /> Save Changes
                  </button>
                </>
              ) : (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={toggleSettings}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-lg shadow-gray-500/20 hover:shadow-gray-500/30 transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <FaCog className="inline-block mr-2" /> Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <FaEdit className="inline-block mr-2" /> Edit Profile
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
