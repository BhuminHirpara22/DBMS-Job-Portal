import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaGraduationCap,
  FaBriefcase,
  FaFileAlt,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaPlus,
} from "react-icons/fa";
import { getToken } from "../../../tokenUtils";
import axios from "axios";

const JobSeekerProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    skills: [],
    experience: [],
    education: [],
    resume_url: "",
    linkedin_url: "",
    // github_url: "",
    // portfolio_url: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/get_jobseeker/1`,
        {
          headers: {},
        }
      );

      console.log(response);
      if (!(response.status === 200))
        throw new Error("Failed to fetch profile");

      const data = response.data.profile;

      // Ensure the structure is consistent
      const safeProfile = {
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone_number || "",
        location: data.location || "",
        // bio: data.bio || "",
        skills: data.skills || [], // Ensure `skills` is always an array
        experience: data.experience || [],
        education: data.education || [],
        resume_url: data.resume_url || "",
        linkedin_url: data.linkedin_url || "",
        // github_url: data.github_url || "",
        // portfolio_url: data.portfolio_url || "",
      };

      setProfile(safeProfile);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  // ID             int          `json:"id"`
  // FirstName      string       `json:"first_name" binding:"required"`
  // LastName       string       `json:"last_name" binding:"required"`
  // Email          string       `json:"email" binding:"required,email"`
  // Password       string       `json:"password" binding:"required,min=6"`
  // Resume         string       `json:"resume,omitempty"`
  // ProfilePicture *string      `json:"profile_picture,omitempty"`
  // PhoneNumber    *string      `json:"phone_number,omitempty"`
  // LinkedinURL    *string      `json:"linkedin_url,omitempty"`
  // Location       *string      `json:"location,omitempty"`
  // Education      []Education  `json:"education,omitempty"`
  // Experience     []Experience `json:"experience,omitempty"`
  // Skills         []Skill      `json:"skills,omitempty"`

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...profile.skills];
    updatedSkills[index] = value;
    setProfile({ ...profile, skills: updatedSkills });
  };
  const addEducation = () => {
    if (profile.education.length > 0) {
      // setErrors({ ...errors, education: "Please fill all fields before adding new education" });
      return;
    }
    //setErrors({ ...errors, education: "" });
    setProfile({
      ...profile,
      education: [
        ...profile.education,
        {
          education_level: "",
          institution_name: "",
          field_of_study: "",
          start_year: "",
          end_year: "",
          grade: "",
        },
      ],
    });
  };

  const removeEducation = (index) => {
    const newEducation = profile.education.filter((_, i) => i !== index);
    setInput({ ...profile, education: newEducation });
  };

  const addExperience = () => {
    if (profile.experience.length > 0) {
      // setErrors({ ...errors, experience: "Please fill all fields before adding new experience" });
      return;
    }
    // setErrors({ ...errors, experience: "" });
    setProfile({
      ...profile,
      experience: [
        ...profile.experience,
        {
          job_title: "",
          company_name: "",
          location: "",
          start_date: "",
          end_date: "",
        },
      ],
    });
  };

  const removeExperience = (index) => {
    const newExperience = prfoile.experience.filter((_, i) => i !== index);
    setInput({ ...profile, experience: newExperience });
  };
  const addSkill = () => {
    if (profile.skills.length > 0) {
      // setErrors({ ...errors, skills: "Please fill all fields before adding new skill" });
      return;
    }
    //setErrors({ ...errors, skills: "" });
    setProfile({
      ...profile,
      skills: [
        ...profile.skills,
        {
          name: "",
          level: "",
        },
      ],
    });
  };

  const removeSkill = (index) => {
    const newSkills = profile.skills.filter((_, i) => i !== index);
    setProfile({ ...profile, skills: newSkills });
  };
  const handleSubmit = async (e) => {
    setIsEditing(false);
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();

      // Ensure the payload structure matches the backend struct
      const payload = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        resume: profile.resume_url || "",
        profile_picture: null, // Add as null if not provided
        phone_number: profile.phone || null,
        linkedin_url: profile.linkedin_url || null,
        location: profile.location || null,
        education: profile.education || [],
        experience: profile.experience || [],
        skills: profile.skills || [],
      };
      console.log(payload);
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/update_jobseeker/1`,
        payload, // Send the payload as the second argument
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token authorization
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);

      if (response.status !== 200) throw new Error("Failed to update profile");

      const data = response.data.profile;

      const safeProfile = {
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone_number || "",
        location: data.location || "",
        skills: data.skills || [],
        experience: data.experience || [],
        education: data.education || [],
        resume_url: data.resume_url || "",
        linkedin_url: data.linkedin_url || "",
      };

      setProfile(safeProfile);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
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
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-75"
                  required
                />
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaUser className="mr-2 text-blue-400" />
                  Lasr Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={profile.last_name}
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

            {/* Skills Section */}
            <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FaBriefcase className="mr-2 text-blue-400" />
                Skills
              </h3>
              <div className="space-y-3">
                {isEditing &&
                  profile.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/30 p-4 rounded-lg border border-gray-600"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Skill Name
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={skill.name}
                            onChange={(e) => {
                              let newSkills = [...profile.skills];
                              newSkills[index].name = e.target.value;
                              setProfile({ ...profile, skills: newSkills });
                            }}
                            placeholder="e.g., JavaScript, Python"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Proficiency Level
                          </label>
                          <select
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={skill.level}
                            onChange={(e) => {
                              let newSkills = [...profile.skills];
                              newSkills[index].level = e.target.value;
                              setProfile({ ...profile, skills: newSkills });
                            }}
                            required
                          >
                            <option value="">Select Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="mt-2 text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors duration-300"
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  ))}

                {!isEditing &&
                  profile.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/30 p-4 rounded-lg border border-gray-600"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Skill Name
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={skill.name}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Proficiency Level
                          </label>
                          <input
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={skill.level}
                            required
                            disabled={!isEditing}
                          ></input>
                        </div>
                      </div>
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
            <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700/50 mt-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FaBriefcase className="mr-2 text-blue-400" />
                Professional Experience
              </h3>
              <div className="space-y-3">
                {isEditing &&
                  profile.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/30 p-4 rounded-lg border border-gray-600"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Job Title
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={exp.job_title}
                            onChange={(e) => {
                              let newExperience = [...profile.experience];
                              newExperience[index].job_title = e.target.value;
                              setProfile({
                                ...profile,
                                experience: newExperience,
                              });
                            }}
                            placeholder="e.g., Software Engineer"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Company Name
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={exp.company_name}
                            onChange={(e) => {
                              let newExperience = [...profile.experience];
                              newExperience[index].company_name =
                                e.target.value;
                              setProfile({
                                ...profile,
                                experience: newExperience,
                              });
                            }}
                            placeholder="e.g., Google"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={exp.location}
                            onChange={(e) => {
                              let newExperience = [...profile.experience];
                              newExperience[index].location = e.target.value;
                              setProfile({
                                ...profile,
                                experience: newExperience,
                              });
                            }}
                            placeholder="e.g., San Francisco, CA"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={exp.start_date}
                            onChange={(e) => {
                              let newExperience = [...profile.experience];
                              newExperience[index].start_date = e.target.value;
                              setProfile({
                                ...profile,
                                experience: newExperience,
                              });
                            }}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={exp.end_date}
                            onChange={(e) => {
                              let newExperience = [...profile.experience];
                              newExperience[index].end_date = e.target.value;
                              setProfile({
                                ...profile,
                                experience: newExperience,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="mt-2 text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors duration-300"
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  ))}

                {!isEditing &&
                  profile.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/30 p-4 rounded-lg border border-gray-600"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Job Title
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={exp.job_title}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Company Name
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={exp.company_name}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={exp.location}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Start Date
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={exp.start_date}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            End Date
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={exp.end_date}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={addExperience}
                  className="mt-4 flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
                >
                  <FaPlus className="mr-2" /> Add Experience
                </button>
              )}
            </div>
            <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700/50 mt-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FaGraduationCap className="mr-2 text-blue-400" />
                Education
              </h3>
              <div className="space-y-3">
                {isEditing &&
                  profile.education.map((edu, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/30 p-4 rounded-lg border border-gray-600"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Education Level
                          </label>
                          <select
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={edu.education_level}
                            onChange={(e) => {
                              let newEducation = [...profile.education];
                              newEducation[index].education_level =
                                e.target.value;
                              setProfile({
                                ...profile,
                                education: newEducation,
                              });
                            }}
                            required
                          >
                            <option value="">Select Level</option>
                            <option value="High School">High School</option>
                            <option value="Bachelor's">Bachelor's</option>
                            <option value="Master's">Master's</option>
                            <option value="PhD">PhD</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Institution Name
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={edu.institution_name}
                            onChange={(e) => {
                              let newEducation = [...profile.education];
                              newEducation[index].institution_name =
                                e.target.value;
                              setProfile({
                                ...profile,
                                education: newEducation,
                              });
                            }}
                            placeholder="e.g., Stanford University"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Field of Study
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={edu.field_of_study}
                            onChange={(e) => {
                              let newEducation = [...profile.education];
                              newEducation[index].field_of_study =
                                e.target.value;
                              setProfile({
                                ...profile,
                                education: newEducation,
                              });
                            }}
                            placeholder="e.g., Computer Science"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Start Year
                          </label>
                          <input
                            type="number"
                            min="1900"
                            max="2099"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={edu.start_year}
                            onChange={(e) => {
                              let newEducation = [...profile.education];
                              newEducation[index].start_year = e.target.value;
                              setProfile({
                                ...profile,
                                education: newEducation,
                              });
                            }}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            End Year
                          </label>
                          <input
                            type="number"
                            min="1900"
                            max="2099"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={edu.end_year}
                            onChange={(e) => {
                              let newEducation = [...profile.education];
                              newEducation[index].end_year = e.target.value;
                              setProfile({
                                ...profile,
                                education: newEducation,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Grade/GPA
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={edu.grade}
                            onChange={(e) => {
                              let newEducation = [...profile.education];
                              newEducation[index].grade = e.target.value;
                              setProfile({
                                ...profile,
                                education: newEducation,
                              });
                            }}
                            placeholder="e.g., 3.8"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="mt-2 text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors duration-300"
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  ))}

                {!isEditing &&
                  profile.education.map((edu, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/30 p-4 rounded-lg border border-gray-600"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Education Level
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={edu.education_level}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Institution Name
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={edu.institution_name}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Field of Study
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={edu.field_of_study}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Start Year
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={edu.start_year}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            End Year
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={edu.end_year}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-1">
                            Grade/GPA
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={edu.grade}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={addEducation}
                  className="mt-4 flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
                >
                  <FaPlus className="mr-2" /> Add Education
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
