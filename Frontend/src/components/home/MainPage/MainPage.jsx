import React from "react";
import { Link } from "react-router-dom";
import { FaBriefcase, FaUserTie, FaBuilding, FaSearch } from "react-icons/fa";

const MainPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Find Your <span className="text-blue-400">Dream Job</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect with top employers and discover opportunities that match your skills and aspirations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/jobs"
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FaSearch className="text-lg" />
                Browse Jobs
              </Link>
              <Link
                to="/company/create"
                className="px-8 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FaBuilding className="text-lg" />
                Register Company
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-gray-400 text-lg">Discover the advantages of using our platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FaBriefcase className="text-4xl text-blue-400" />}
              title="Wide Range of Jobs"
              description="Access thousands of job opportunities from various industries and locations"
            />
            <FeatureCard
              icon={<FaUserTie className="text-4xl text-green-400" />}
              title="Top Employers"
              description="Connect with leading companies and organizations looking for talent"
            />
            <FeatureCard
              icon={<FaBuilding className="text-4xl text-purple-400" />}
              title="Company Profiles"
              description="Detailed company information to help you make informed decisions"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers and employers who have found success through our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
            >
              Sign Up Now
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default MainPage; 