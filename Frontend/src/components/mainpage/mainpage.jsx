import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaUserTie, FaClipboardList, FaBell, FaSearch, FaUsers, FaChartLine, FaCheckCircle, FaStar } from "react-icons/fa";

const Mainpage = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-[1600px] mx-auto relative">
        {/* Hero Section */}
        <div className={`text-center py-16 px-4 sm:px-6 lg:px-8 transform transition-all duration-500 
                        ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Explore job opportunities, manage applications, and stay updated with the latest career prospects!
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-12 max-w-3xl mx-auto">
            <div className="group bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-center border border-gray-700/50 
                          hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 
                          hover:-translate-y-1">
              <div className="w-8 h-8 mx-auto mb-1.5 rounded-full bg-blue-500/10 flex items-center justify-center 
                            group-hover:scale-110 transition-transform duration-300">
                <FaUsers className="text-blue-400 text-base" />
              </div>
              <p className="text-lg font-bold text-white mb-0.5 group-hover:text-blue-400 transition-colors duration-300">1.2K</p>
              <p className="text-gray-400 text-[10px]">Active Users</p>
            </div>
            <div className="group bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-center border border-gray-700/50 
                          hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 
                          hover:-translate-y-1">
              <div className="w-8 h-8 mx-auto mb-1.5 rounded-full bg-green-500/10 flex items-center justify-center 
                            group-hover:scale-110 transition-transform duration-300">
                <FaBriefcase className="text-green-400 text-base" />
              </div>
              <p className="text-lg font-bold text-white mb-0.5 group-hover:text-green-400 transition-colors duration-300">500+</p>
              <p className="text-gray-400 text-[10px]">Job Listings</p>
            </div>
            <div className="group bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-center border border-gray-700/50 
                          hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 
                          hover:-translate-y-1">
              <div className="w-8 h-8 mx-auto mb-1.5 rounded-full bg-yellow-500/10 flex items-center justify-center 
                            group-hover:scale-110 transition-transform duration-300">
                <FaCheckCircle className="text-yellow-400 text-base" />
              </div>
              <p className="text-lg font-bold text-white mb-0.5 group-hover:text-yellow-400 transition-colors duration-300">2.5K</p>
              <p className="text-gray-400 text-[10px]">Applications</p>
            </div>
            <div className="group bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-center border border-gray-700/50 
                          hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20 
                          hover:-translate-y-1">
              <div className="w-8 h-8 mx-auto mb-1.5 rounded-full bg-red-500/10 flex items-center justify-center 
                            group-hover:scale-110 transition-transform duration-300">
                <FaStar className="text-red-400 text-base" />
              </div>
              <p className="text-lg font-bold text-white mb-0.5 group-hover:text-red-400 transition-colors duration-300">4.8</p>
              <p className="text-gray-400 text-[10px]">Success Rate</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl 
                          transition-all duration-500 group-hover:opacity-100 opacity-0"></div>
            <div className="relative flex items-center bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 
                          p-2 group-hover:border-blue-500/50 transition-all duration-300 group-hover:shadow-xl 
                          group-hover:shadow-blue-500/20">
              <FaSearch className="text-gray-400 ml-4 group-hover:text-blue-400 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search for jobs..."
                className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400 px-4 py-3"
              />
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8 
                        transform transition-all duration-500 delay-200 
                        ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {/* Applied Jobs Card */}
          <div
            className="group cursor-pointer perspective-1000"
            onClick={() => navigate("/applied-jobs")}
            onMouseEnter={() => setHoveredCard("applied-jobs")}
            onMouseLeave={(e) => {
              setHoveredCard(null);
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            }}
            onMouseMove={(e) => {
              const card = e.currentTarget;
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateX = (y - centerY) / 20;
              const rotateY = (centerX - x) / 20;
              card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }}
          >
            <div className="relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 
                          transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 
                               transition-all duration-300 group-hover:scale-110`}>
                  <FaUserTie className="text-blue-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                  Applied Jobs
                </h3>
                <p className="text-gray-400 text-sm">
                  Track and manage your job applications
                </p>
              </div>
            </div>
          </div>

          {/* Job Listings Card */}
          <div
            className="group cursor-pointer perspective-1000"
            onClick={() => navigate("/jobs")}
            onMouseEnter={() => setHoveredCard("job-listings")}
            onMouseLeave={(e) => {
              setHoveredCard(null);
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            }}
            onMouseMove={(e) => {
              const card = e.currentTarget;
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateX = (y - centerY) / 20;
              const rotateY = (centerX - x) / 20;
              card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }}
          >
            <div className="relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 
                          transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-xl 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 
                               transition-all duration-300 group-hover:scale-110`}>
                  <FaClipboardList className="text-purple-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors duration-300">
                  Job Listings
                </h3>
                <p className="text-gray-400 text-sm">
                  Browse and apply for new opportunities
                </p>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div
            className="group cursor-pointer perspective-1000"
            onClick={() => navigate("/notifications")}
            onMouseEnter={() => setHoveredCard("notifications")}
            onMouseLeave={(e) => {
              setHoveredCard(null);
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            }}
            onMouseMove={(e) => {
              const card = e.currentTarget;
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateX = (y - centerY) / 20;
              const rotateY = (centerX - x) / 20;
              card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }}
          >
            <div className="relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 
                          transition-all duration-300 hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-red-500/5 rounded-xl 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-6 
                               transition-all duration-300 group-hover:scale-110`}>
                  <FaBell className="text-pink-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-pink-400 transition-colors duration-300">
                  Notifications
                </h3>
                <p className="text-gray-400 text-sm">
                  Stay updated with job alerts and messages
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-10px) translateX(5px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default Mainpage;
