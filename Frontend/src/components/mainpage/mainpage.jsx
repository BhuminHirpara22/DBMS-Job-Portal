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
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-gradient-x" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className={`relative p-10 md:p-20 transform transition-all duration-1000 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-5xl font-bold text-center mb-6">
            Welcome to Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Dashboard
            </span>
          </h2>
          <p className="mt-2 text-center text-gray-400 text-lg max-w-2xl mx-auto">
            Explore job opportunities, manage applications, and stay updated with the latest career prospects!
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700/50">
              <FaUsers className="text-blue-400 text-2xl mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">1.2K</p>
              <p className="text-gray-400 text-sm">Active Users</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700/50">
              <FaBriefcase className="text-green-400 text-2xl mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-gray-400 text-sm">Job Listings</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700/50">
              <FaCheckCircle className="text-yellow-400 text-2xl mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">2.5K</p>
              <p className="text-gray-400 text-sm">Applications</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700/50">
              <FaStar className="text-red-400 text-2xl mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">4.8</p>
              <p className="text-gray-400 text-sm">Success Rate</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-10 flex justify-center">
            <div className="relative w-full max-w-2xl group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl transition-all duration-500 group-hover:opacity-100 opacity-0" />
              <div className="relative flex items-center bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-2">
                <FaSearch className="text-gray-400 ml-4" />
                <input
                  type="text"
                  placeholder="Search for jobs..."
                  className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400 px-4 py-3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className={`p-10 md:p-20 transform transition-all duration-1000 ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* My Jobs Card */}
          <div
            className="relative group cursor-pointer perspective-1000"
            onClick={() => navigate("/my-jobs")}
            onMouseEnter={() => setHoveredCard("my-jobs")}
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
            <div
              className={`absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl transition-all duration-500 ${
                hoveredCard === "my-jobs" ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 transition-all duration-500 hover:border-blue-500/50">
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 transition-all duration-500 ${
                  hoveredCard === "my-jobs" ? "scale-110" : "scale-100"
                }`}>
                  <FaBriefcase className="text-blue-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">My Jobs</h3>
                <p className="text-gray-400 text-sm">
                  View and manage the jobs you've posted.
                </p>
              </div>
            </div>
          </div>

          {/* Applied Jobs Card */}
          <div
            className="relative group cursor-pointer perspective-1000"
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
            <div
              className={`absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl transition-all duration-500 ${
                hoveredCard === "applied-jobs" ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 transition-all duration-500 hover:border-green-500/50">
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6 transition-all duration-500 ${
                  hoveredCard === "applied-jobs" ? "scale-110" : "scale-100"
                }`}>
                  <FaUserTie className="text-green-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Applied Jobs</h3>
                <p className="text-gray-400 text-sm">
                  Track jobs you've applied for.
                </p>
              </div>
            </div>
          </div>

          {/* Job Listings Card */}
          <div
            className="relative group cursor-pointer perspective-1000"
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
            <div
              className={`absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl transition-all duration-500 ${
                hoveredCard === "job-listings" ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 transition-all duration-500 hover:border-yellow-500/50">
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6 transition-all duration-500 ${
                  hoveredCard === "job-listings" ? "scale-110" : "scale-100"
                }`}>
                  <FaClipboardList className="text-yellow-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Job Listings</h3>
                <p className="text-gray-400 text-sm">
                  Browse and apply for new jobs.
                </p>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div
            className="relative group cursor-pointer perspective-1000"
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
            <div
              className={`absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl blur-xl transition-all duration-500 ${
                hoveredCard === "notifications" ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 transition-all duration-500 hover:border-red-500/50">
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 transition-all duration-500 ${
                  hoveredCard === "notifications" ? "scale-110" : "scale-100"
                }`}>
                  <FaBell className="text-red-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Notifications</h3>
                <p className="text-gray-400 text-sm">
                  Stay updated with job alerts and messages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mainpage;
