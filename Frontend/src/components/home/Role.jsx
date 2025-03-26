import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaBuilding, FaArrowRight, FaArrowLeft } from "react-icons/fa";

export function Role() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [hoveredRole, setHoveredRole] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === "jobseeker") {
      navigate("/signup/jobseeker");
    } else if (role === "employer") {
      navigate("/signup/employer");
    }
  };

  const handleGetStarted = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === "jobseeker") {
      navigate("/signup/jobseeker");
    } else if (selectedRole === "employer") {
      navigate("/signup/employer");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => navigate("/")}
          className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-gray-800/70"
        >
          <FaArrowLeft className="text-lg" />
          <span className="hidden sm:inline">Back to Home</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to Job Portal
            </h1>
            <p className="text-gray-400 text-lg">
              Choose your role to get started
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Job Seeker Card */}
            <div
              className={`relative group cursor-pointer transition-all duration-500 ${
                role === "jobseeker" ? "scale-105" : "hover:scale-105"
              }`}
              onClick={() => setRole("jobseeker")}
              onMouseEnter={() => setHoveredRole("jobseeker")}
              onMouseLeave={() => setHoveredRole(null)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl transition-all duration-500 ${
                  hoveredRole === "jobseeker" ? "opacity-100" : "opacity-0"
                }`}
              />
              <div
                className={`relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border ${
                  role === "jobseeker"
                    ? "border-blue-500 shadow-lg shadow-blue-500/20"
                    : "border-gray-700 hover:border-blue-500/50"
                } transition-all duration-500 transform hover:-translate-y-1`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 transition-all duration-500 ${
                      role === "jobseeker" ? "scale-110" : "group-hover:scale-110"
                    }`}
                  >
                    <FaUserTie className="w-10 h-10 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Job Seeker
                  </h2>
                  <p className="text-gray-400 mb-6">
                    Looking for your next career opportunity? Create a profile and
                    connect with top employers.
                  </p>
                  <button
                    onClick={() => handleGetStarted("jobseeker")}
                    className={`flex items-center gap-2 text-blue-400 transition-all duration-500 hover:text-blue-300 ${
                      role === "jobseeker"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <span>Get Started</span>
                    <FaArrowRight className="transition-transform duration-500 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Employer Card */}
            <div
              className={`relative group cursor-pointer transition-all duration-500 ${
                role === "employer" ? "scale-105" : "hover:scale-105"
              }`}
              onClick={() => setRole("employer")}
              onMouseEnter={() => setHoveredRole("employer")}
              onMouseLeave={() => setHoveredRole(null)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl transition-all duration-500 ${
                  hoveredRole === "employer" ? "opacity-100" : "opacity-0"
                }`}
              />
              <div
                className={`relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border ${
                  role === "employer"
                    ? "border-green-500 shadow-lg shadow-green-500/20"
                    : "border-gray-700 hover:border-green-500/50"
                } transition-all duration-500 transform hover:-translate-y-1`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 transition-all duration-500 ${
                      role === "employer" ? "scale-110" : "group-hover:scale-110"
                    }`}
                  >
                    <FaBuilding className="w-10 h-10 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Employer</h2>
                  <p className="text-gray-400 mb-6">
                    Looking to hire talented professionals? Post jobs and find the
                    perfect candidates.
                  </p>
                  <button
                    onClick={() => handleGetStarted("employer")}
                    className={`flex items-center gap-2 text-green-400 transition-all duration-500 hover:text-green-300 ${
                      role === "employer"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <span>Get Started</span>
                    <FaArrowRight className="transition-transform duration-500 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={handleSubmit}
              disabled={!role}
              className={`relative group px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-500 ${
                role
                  ? "bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg hover:shadow-blue-500/20"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-xl blur-lg transition-all duration-500 ${
                  role ? "opacity-100" : "opacity-0"
                }`}
              />
              <span className="relative">
                {role ? "Continue" : "Select a Role"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Role;
