import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaTrash, FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaLinkedin, FaMapMarkerAlt, FaLock, FaGraduationCap, FaBriefcase } from "react-icons/fa";

export function JobSeekerSignup() {
  const [input, setInput] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    linkedin_url: "",
    location: "",
    education: [],
    experience: [],
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!input.first_name.trim()) newErrors.first_name = "First name is required";
    if (!input.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!input.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(input.email)) newErrors.email = "Invalid email format";
    
    if (!input.password) newErrors.password = "Password is required";
    else if (input.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    
    if (input.password !== input.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!input.phone_number.trim()) newErrors.phone_number = "Phone number is required";
    if (!input.location.trim()) newErrors.location = "Location is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const url = import.meta.env.VITE_API_URL + "/user/register/jobseeker";
    try {
      const response = await axios.post(url, input);
      navigate("/login/jobseeker");
    } catch (e) {
      console.log(e);
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const addEducation = () => {
    setInput({
      ...input,
      education: [
        ...input.education,
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
    const newEducation = input.education.filter((_, i) => i !== index);
    setInput({ ...input, education: newEducation });
  };

  const addExperience = () => {
    setInput({
      ...input,
      experience: [
        ...input.experience,
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
    const newExperience = input.experience.filter((_, i) => i !== index);
    setInput({ ...input, experience: newExperience });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/role")}
          className="mb-6 text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Role Selection
        </button>

        {/* Signup Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Your Profile</h2>
            <p className="text-gray-400">Join our community of job seekers</p>
          </div>

          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="first_name"
                    value={input.first_name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${
                      errors.first_name ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-400">{errors.first_name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="last_name"
                    value={input.last_name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${
                      errors.last_name ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-400">{errors.last_name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={input.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${
                      errors.email ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone_number"
                    value={input.phone_number}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${
                      errors.phone_number ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                {errors.phone_number && (
                  <p className="mt-1 text-sm text-red-400">{errors.phone_number}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  LinkedIn URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLinkedin className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={input.linkedin_url}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your LinkedIn profile URL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={input.location}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${
                      errors.location ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter your location"
                    required
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-400">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={input.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${
                      errors.password ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Create a password"
                    required
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={input.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Education Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FaGraduationCap className="text-blue-500" />
                  Education
                </h3>
                <button
                  type="button"
                  onClick={addEducation}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors duration-300"
                >
                  <FaPlus /> Add Education
                </button>
              </div>

              {input.education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-gray-700/30 p-4 rounded-lg border border-gray-600"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.keys(edu).map((field, i) => (
                      <div key={i}>
                        <label className="block text-gray-300 text-sm font-medium mb-1">
                          {field.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        <input
                          type={field.includes("year") ? "number" : "text"}
                          className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          value={edu[field]}
                          onChange={(e) => {
                            let newEdu = [...input.education];
                            newEdu[index][field] = e.target.value;
                            setInput({ ...input, education: newEdu });
                          }}
                          placeholder={field.replace("_", " ")}
                          required
                        />
                      </div>
                    ))}
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
            </div>

            {/* Experience Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FaBriefcase className="text-blue-500" />
                  Experience
                </h3>
                <button
                  type="button"
                  onClick={addExperience}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors duration-300"
                >
                  <FaPlus /> Add Experience
                </button>
              </div>

              {input.experience.map((exp, index) => (
                <div
                  key={index}
                  className="bg-gray-700/30 p-4 rounded-lg border border-gray-600"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.keys(exp).map((field, i) => (
                      <div key={i}>
                        <label className="block text-gray-300 text-sm font-medium mb-1">
                          {field.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        <input
                          type={field.includes("date") ? "date" : "text"}
                          className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          value={exp[field]}
                          onChange={(e) => {
                            let newExp = [...input.experience];
                            newExp[index][field] = e.target.value;
                            setInput({ ...input, experience: newExp });
                          }}
                          placeholder={field.replace("_", " ")}
                          required
                        />
                      </div>
                    ))}
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
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login/jobseeker"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerSignup;
