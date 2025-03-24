import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaGraduationCap, FaBriefcase, FaFileAlt, FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";
import { getToken } from "../../../tokenUtils";

const JobSeekerProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: [],
    experience: [],
    education: [],
    resume_url: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/seeker/profile`, {
        headers: {
          Authorization: `seeker-token`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfile(data);
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

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...profile.skills];
    updatedSkills[index] = value;
    setProfile({ ...profile, skills: updatedSkills });
  };

  const addSkill = () => {
    setProfile({ ...profile, skills: [...profile.skills, ""] });
  };

  const removeSkill = (index) => {
    const updatedSkills = profile.skills.filter((_, i) => i !== index);
    setProfile({ ...profile, skills: updatedSkills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/seeker/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `seeker-token`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error("Failed to update profile");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Professional Profile
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Manage your professional information and settings
          </p>
        </div>

        {/* Main Profile Container */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Full Name */}
              <div className="group sm:col-span-2">
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaUser className="mr-2 text-blue-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={profile.full_name}
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

              {/* Location */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-400" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-75"
                  required
                />
              </div>
            </div>

            {/* Professional Bio */}
            <div className="group">
              <label className="block text-gray-300 font-medium mb-2 flex items-center">
                <FaFileAlt className="mr-2 text-blue-400" />
                Professional Bio
              </label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[150px] disabled:opacity-75"
                required
                placeholder="Write a brief professional bio..."
              ></textarea>
            </div>

            {/* Skills Section */}
            <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FaBriefcase className="mr-2 text-blue-400" />
                Skills
              </h3>
              <div className="space-y-3">
                {profile.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      disabled={!isEditing}
                      className="flex-1 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-75"
                      placeholder="Enter a skill..."
                      required
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={addSkill}
                  className="mt-4 flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
                >
                  <FaPlus className="mr-2" /> Add Skill
                </button>
              )}
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {/* LinkedIn */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaLinkedin className="mr-2 text-blue-400" />
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={profile.linkedin_url}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-75"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              {/* GitHub */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaGithub className="mr-2 text-blue-400" />
                  GitHub Profile
                </label>
                <input
                  type="url"
                  name="github_url"
                  value={profile.github_url}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-75"
                  placeholder="https://github.com/..."
                />
              </div>

              {/* Portfolio */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaGlobe className="mr-2 text-blue-400" />
                  Portfolio Website
                </label>
                <input
                  type="url"
                  name="portfolio_url"
                  value={profile.portfolio_url}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-75"
                  placeholder="https://your-portfolio.com"
                />
              </div>
            </div>

            {/* Resume Upload */}
            <div className="group">
              <label className="block text-gray-300 font-medium mb-2 flex items-center">
                <FaFileAlt className="mr-2 text-blue-400" />
                Resume URL
              </label>
              <input
                type="url"
                name="resume_url"
                value={profile.resume_url}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-75"
                placeholder="https://your-resume-url.com"
              />
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
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <FaEdit className="inline-block mr-2" /> Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfile; 