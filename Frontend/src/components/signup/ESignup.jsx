import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaBuilding, FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";

export function EmployerSignup() {
  const [input, setInput] = useState({
    company_id: "",
    contact_person: "",
    email: "",
    contact_number: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const navigate = useNavigate();

  // Fetch companies from backend
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/company/get_companies");
        if (response.status === 200) {
          setCompanies(response.data.companies);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        setErrors({ companies: "Failed to load companies. Please try again." });
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!input.company_id) newErrors.company_id = "Company selection is required";
    if (!input.contact_person.trim()) newErrors.contact_person = "Contact person name is required";
    if (!input.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(input.email)) newErrors.email = "Invalid email format";
    
    if (!input.contact_number.trim()) newErrors.contact_number = "Contact number is required";
    
    if (!input.password) newErrors.password = "Password is required";
    else if (input.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    
    if (input.password !== input.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!input.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(input.phone_number.replace(/\D/g, ''))) {
      newErrors.phone_number = "Phone number must be exactly 10 digits";
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
      console.log(input);
      const response = await axios.post(url, input);
      if (response.data.success) {
        navigate("/login/employer");
      } else {
        setErrors({ submit: response.data.message || "Registration failed. Please try again." });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ 
        submit: error.response?.data?.message || "Registration failed. Please try again." 
      });
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
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBuilding className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <select
                    name="company_id"
                    value={input.company_id}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-3 bg-gray-700/50 border ${
                      errors.company_id ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer hover:border-blue-500/50 group-hover:border-blue-500/50`}
                    required
                    disabled={isLoadingCompanies}
                  >
                    <option value="" className="bg-gray-800 text-gray-400">Select Company</option>
                    {companies && companies.map((company) => (
                      <option 
                        key={company.id} 
                        value={company.id}
                        className="bg-gray-800 text-white py-2"
                      >
                        {company.company_name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg 
                      className={`w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors transform group-hover:rotate-180 duration-300`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {isLoadingCompanies && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                {errors.company_id && (
                  <p className="mt-1 text-sm text-red-400">{errors.company_id}</p>
                )}
                {errors.companies && (
                  <p className="mt-1 text-sm text-red-400">{errors.companies}</p>
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
                    name="phone_number"
                    value={input.phone_number}
                    onChange={(e) => {
                      // Only allow numeric input
                      const value = e.target.value.replace(/\D/g, '');
                      // Limit to 10 digits
                      if (value.length <= 10) {
                        setInput({ ...input, phone_number: value });
                      }
                      if (errors.phone_number) {
                        setErrors({ ...errors, phone_number: "" });
                      }
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${
                      errors.phone_number ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter 10-digit phone number"
                    maxLength="10"
                    pattern="\d{10}"
                    required
                  />
                </div>
                {errors.contact_number && (
                  <p className="mt-1 text-sm text-red-400">{errors.contact_number}</p>
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
