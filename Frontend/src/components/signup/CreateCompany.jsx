import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaBuilding,
  FaGlobe,
  FaIndustry,
  FaImage,
  FaAlignLeft,
  FaRocket,
  FaLightbulb,
  FaChartLine,
  FaUsers,
} from "react-icons/fa";

export function CreateCompany() {
  const [input, setInput] = useState({
    company_name: "",
    website: "",
    industry: "",
    logo: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Add floating animation to background elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      
      document.documentElement.style.setProperty('--mouse-x', `${x}px`);
      document.documentElement.style.setProperty('--mouse-y', `${y}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!input.company_name.trim())
      newErrors.company_name = "Company name is required";
    if (!input.website.trim()) newErrors.website = "Website URL is required";
    else if (!isValidUrl(input.website))
      newErrors.website = "Please enter a valid URL";
    if (!input.industry.trim()) newErrors.industry = "Industry is required";
    if (!input.logo) newErrors.logo = "Company logo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput({ ...input, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("company_name", input.company_name);
    formData.append("website", input.website);
    formData.append("industry", input.industry);
    formData.append("logo", input.logo);

    try {
        console.log(input);
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/company/add_company",
        input,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        navigate("/role");
      } else {
        setErrors({
          submit:
            response.data.message ||
            "Company registration failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        submit:
          error.response?.data?.message ||
          "Company registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
        <div className="absolute w-[500px] h-[500px] bg-green-500/10 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
        >
          <FaArrowLeft className="transform group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        {/* Registration Card */}
        <div className="bg-gray-800/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50 relative overflow-hidden group">
          {/* Animated Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Content */}
          <div className="relative">
            <div className="text-center mb-8">
              <div className="inline-block p-3 rounded-full bg-blue-500/10 mb-4">
                <FaRocket className="text-3xl text-blue-500" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                Launch Your Company
              </h2>
              <p className="text-gray-400">Join the future of business</p>
            </div>

            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBuilding className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="company_name"
                      value={input.company_name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${
                        errors.company_name ? "border-red-500" : "border-gray-600"
                      } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-500/50`}
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                  {errors.company_name && (
                    <p className="mt-1 text-sm text-red-400">{errors.company_name}</p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Industry
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIndustry className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="industry"
                      value={input.industry}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${
                        errors.industry ? "border-red-500" : "border-gray-600"
                      } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-500/50`}
                      placeholder="Enter industry"
                      required
                    />
                  </div>
                  {errors.industry && (
                    <p className="mt-1 text-sm text-red-400">{errors.industry}</p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Website URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGlobe className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="url"
                      name="website"
                      value={input.website}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${
                        errors.website ? "border-red-500" : "border-gray-600"
                      } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-500/50`}
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-400">{errors.website}</p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Company Logo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaImage className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="file"
                      name="logo"
                      onChange={handleLogoChange}
                      accept="image/*"
                      className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border ${
                        errors.logo ? "border-red-500" : "border-gray-600"
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-blue-500/50`}
                      required
                    />
                  </div>
                  {errors.logo && (
                    <p className="mt-1 text-sm text-red-400">{errors.logo}</p>
                  )}
                  {previewUrl && (
                    <div className="mt-2 transform transition-transform duration-300 hover:scale-105">
                      <img
                        src={previewUrl}
                        alt="Logo preview"
                        className="w-20 h-20 object-contain rounded-lg border border-gray-700/50"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-600 transform hover:scale-[1.02] ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Launching Company...
                  </>
                ) : (
                  <>
                    <FaRocket className="text-lg" />
                    Launch Company
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 perspective-1000">
              <div className="feature-card group">
                <div className="relative p-6 bg-gray-700/30 rounded-xl transition-all duration-500 transform hover:scale-105 hover:rotate-y-6 hover:shadow-xl hover:shadow-blue-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="inline-block p-3 rounded-full bg-blue-500/10 mb-4 transform group-hover:scale-110 transition-transform duration-500">
                      <FaLightbulb className="text-blue-500 text-2xl" />
                    </div>
                    <p className="text-sm text-gray-300 font-medium">Innovation</p>
                    <p className="text-xs text-gray-400 mt-1">Pushing boundaries</p>
                  </div>
                </div>
              </div>

              <div className="feature-card group">
                <div className="relative p-6 bg-gray-700/30 rounded-xl transition-all duration-500 transform hover:scale-105 hover:rotate-y-6 hover:shadow-xl hover:shadow-purple-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="inline-block p-3 rounded-full bg-purple-500/10 mb-4 transform group-hover:scale-110 transition-transform duration-500">
                      <FaChartLine className="text-purple-500 text-2xl" />
                    </div>
                    <p className="text-sm text-gray-300 font-medium">Growth</p>
                    <p className="text-xs text-gray-400 mt-1">Expanding horizons</p>
                  </div>
                </div>
              </div>

              <div className="feature-card group">
                <div className="relative p-6 bg-gray-700/30 rounded-xl transition-all duration-500 transform hover:scale-105 hover:rotate-y-6 hover:shadow-xl hover:shadow-green-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="inline-block p-3 rounded-full bg-green-500/10 mb-4 transform group-hover:scale-110 transition-transform duration-500">
                      <FaUsers className="text-green-500 text-2xl" />
                    </div>
                    <p className="text-sm text-gray-300 font-medium">Community</p>
                    <p className="text-xs text-gray-400 mt-1">Building together</p>
                  </div>
                </div>
              </div>

              <div className="feature-card group">
                <div className="relative p-6 bg-gray-700/30 rounded-xl transition-all duration-500 transform hover:scale-105 hover:rotate-y-6 hover:shadow-xl hover:shadow-blue-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="inline-block p-3 rounded-full bg-blue-500/10 mb-4 transform group-hover:scale-110 transition-transform duration-500">
                      <FaRocket className="text-blue-500 text-2xl" />
                    </div>
                    <p className="text-sm text-gray-300 font-medium">Success</p>
                    <p className="text-xs text-gray-400 mt-1">Reaching new heights</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        .feature-card {
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
        }

        .feature-card:hover {
          transform: translateZ(20px);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .feature-card {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default CreateCompany;
