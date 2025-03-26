import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaBriefcase, FaUsers, FaBuilding, FaChartLine, FaBars } from "react-icons/fa";
import { useState } from "react";

export function Home() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchForm, setSearchForm] = useState({
    keyword: "",
    location: "",
    category: "All Categories"
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to jobs page with search parameters
    navigate(`/role`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <header className="fixed w-full z-50 bg-gray-900/95 backdrop-blur-sm">
        <div className="flex justify-between items-center px-4 sm:px-8 py-4 max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            JobPortal
          </h1>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars className="text-2xl" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <button
              className="bg-transparent text-white border border-white px-4 py-2 rounded-md mr-4 hover:bg-gray-800 transition-all duration-300"
              onClick={() => navigate("/login/jobseeker")}
            >
              Job Seeker Login
            </button>
            <button
              className="bg-transparent text-white border border-white px-4 py-2 rounded-md mr-4 hover:bg-gray-800 transition-all duration-300"
              onClick={() => navigate("/login/employer")}
            >
              Employer Login
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4 hover:bg-blue-600 transition-all duration-300"
              onClick={() => navigate("/role")}
            >
              Signup
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-300"
              onClick={() => navigate("/create-company")}
            >
              Register Company
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-gray-900/95 backdrop-blur-sm border-t border-gray-800`}>
          <div className="px-4 py-3 space-y-2">
            <button
              className="w-full bg-transparent text-white border border-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all duration-300"
              onClick={() => {
                navigate("/login/jobseeker");
                setIsMenuOpen(false);
              }}
            >
              Job Seeker Login
            </button>
            <button
              className="w-full bg-transparent text-white border border-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all duration-300"
              onClick={() => {
                navigate("/login/employer");
                setIsMenuOpen(false);
              }}
            >
              Employer Login
            </button>
            <button
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
              onClick={() => {
                navigate("/role");
                setIsMenuOpen(false);
              }}
            >
              Signup
            </button>
            <button
              className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-300"
              onClick={() => {
                navigate("/create-company");
                setIsMenuOpen(false);
              }}
            >
              Register Company
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 sm:gap-10">
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Dream Job</span> Today
            </h1>
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto md:mx-0">
              Connect with thousands of employers and opportunities tailored to your skills and ambitions.
              Start your journey to success today.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <button
                className="w-full sm:w-auto bg-blue-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-md hover:bg-blue-600 transition-all duration-300"
                onClick={() => navigate("/login/jobseeker")}
              >
                Browse Jobs
              </button>
              <button
                className="w-full sm:w-auto bg-transparent text-white border border-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-md hover:bg-gray-800 transition-all duration-300"
                onClick={() => navigate("/login/employer")}
              >
                Post a Job
              </button>
              <button
                className="w-full sm:w-auto bg-green-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-md hover:bg-green-600 transition-all duration-300"
                onClick={() => navigate("/create-company")}
              >
                Register Company
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl w-full md:w-2/5 border border-gray-800">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Quick Job Search</h2>
            <form onSubmit={handleSearch} className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="keyword" className="text-gray-400 block mb-1.5 sm:mb-2">Keyword or Title</label>
                <input
                  id="keyword"
                  name="keyword"
                  type="text"
                  value={searchForm.keyword}
                  onChange={handleInputChange}
                  placeholder="e.g., Software Developer, Marketing"
                  className="w-full p-2.5 sm:p-3 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:border-blue-500 transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="text-gray-400 block mb-1.5 sm:mb-2">Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={searchForm.location}
                  onChange={handleInputChange}
                  placeholder="City, State or Remote"
                  className="w-full p-2.5 sm:p-3 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:border-blue-500 transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="text-gray-400 block mb-1.5 sm:mb-2">Category</label>
                <select
                  id="category"
                  name="category"
                  value={searchForm.category}
                  onChange={handleInputChange}
                  className="w-full p-2.5 sm:p-3 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:border-blue-500 transition-all duration-300"
                  required
                >
                  <option value="All Categories">All Categories</option>
                  <option value="Remote">Remote</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Design">Design</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Customer Service">Customer Service</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2.5 sm:py-3 rounded-md flex items-center justify-center hover:bg-blue-600 transition-all duration-300"
              >
                <FaSearch className="mr-2" /> Search Jobs
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl font-bold text-blue-500 mb-1 sm:mb-2">10K+</div>
              <div className="text-sm sm:text-base text-gray-400">Active Jobs</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl font-bold text-blue-500 mb-1 sm:mb-2">5K+</div>
              <div className="text-sm sm:text-base text-gray-400">Companies</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl font-bold text-blue-500 mb-1 sm:mb-2">50K+</div>
              <div className="text-sm sm:text-base text-gray-400">Job Seekers</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl font-bold text-blue-500 mb-1 sm:mb-2">95%</div>
              <div className="text-sm sm:text-base text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Popular Job Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: <FaBriefcase className="text-xl sm:text-2xl" />, title: "Engineering", count: "2,500+ Jobs" },
              { icon: <FaUsers className="text-xl sm:text-2xl" />, title: "Marketing", count: "1,800+ Jobs" },
              { icon: <FaBuilding className="text-xl sm:text-2xl" />, title: "Business", count: "2,200+ Jobs" },
              { icon: <FaChartLine className="text-xl sm:text-2xl" />, title: "Finance", count: "1,500+ Jobs" },
            ].map((category, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-gray-800 hover:border-blue-500 transition-all duration-300 cursor-pointer"
                onClick={() => navigate("/role")}
              >
                <div className="text-blue-500 mb-3 sm:mb-4">{category.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{category.title}</h3>
                <p className="text-sm sm:text-base text-gray-400">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
