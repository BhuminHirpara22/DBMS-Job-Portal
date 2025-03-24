import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaBuilding, FaUser, FaEnvelope, FaPhone, FaGlobe, FaMapMarkerAlt, FaLock, FaBriefcase } from "react-icons/fa";

export function EmployerSignup() {
  const [input, setInput] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    contact_number: "",
    website: "",
    location: "",
    description: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!input.company_name.trim()) newErrors.company_name = "Company name is required";
    if (!input.contact_person.trim()) newErrors.contact_person = "Contact person name is required";
    if (!input.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(input.email)) newErrors.email = "Invalid email format";
    
    if (!input.contact_number.trim()) newErrors.contact_number = "Contact number is required";
    if (!input.location.trim()) newErrors.location = "Location is required";
    if (!input.description.trim()) newErrors.description = "Company description is required";
    
    if (!input.password) newErrors.password = "Password is required";
    else if (input.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    
    if (input.password !== input.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
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
    const url = import.meta.env.VITE_API_URL + "/user/register/employer";
    try {
      const response = await axios.post(url, input);
      navigate("/login/employer");
    } catch (e) {
      console.log(e);
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
      <div className="w-full max-w-3xl">
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
            <h2 className="text-3xl font-bold text-white mb-2">Create Company Profile</h2>
            <p className="text-gray-400">Join our network of employers</p>
          </div>

          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBuilding className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="company_name"
                    value={input.company_name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${
                      errors.company_name ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                {errors.company_name && (
                  <p className="mt-1 text-sm text-red-400">{errors.company_name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Contact Person
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="contact_person"
                    value={input.contact_person}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${
                      errors.contact_person ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter contact person name"
                    required
                  />
                </div>
                {errors.contact_person && (
                  <p className="mt-1 text-sm text-red-400">{errors.contact_person}</p>
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
                    placeholder="Enter company email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Contact Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="contact_number"
                    value={input.contact_number}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${
                      errors.contact_number ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter contact number"
                    required
                  />
                </div>
                {errors.contact_number && (
                  <p className="mt-1 text-sm text-red-400">{errors.contact_number}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Website
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGlobe className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="website"
                    value={input.website}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter company website"
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
                    placeholder="Enter company location"
                    required
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-400">{errors.location}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Company Description
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FaBriefcase className="text-gray-400" />
                  </div>
                  <textarea
                    name="description"
                    value={input.description}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${
                      errors.description ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Describe your company"
                    required
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-400">{errors.description}</p>
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
                to="/login/employer"
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

export default EmployerSignup;
