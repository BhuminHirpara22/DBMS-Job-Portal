import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaClock, FaMoneyBillWave, FaBuilding, FaFilter } from "react-icons/fa";

const JobListings = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/job_seeker/jobs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `job-seeker-token`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }


      const data = await response.json();
      
      // Check if data is in the expected format
      if (data && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else if (Array.isArray(data)) {
        setJobs(data);
      } else {
        console.error("Unexpected API response format:", data);
        throw new Error("Invalid response format from server");
      }
      
      setError(null);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError(error.message || "Failed to load jobs. Please try again later.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.job_title.toLowerCase().includes(search.toLowerCase()) &&
      job.location.toLowerCase().includes(location.toLowerCase()) &&
      (category === "" || job.job_category.toLowerCase() === category.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6">
          Find Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Dream Job</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-4">
          Discover thousands of job opportunities from top companies and employers
        </p>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8 md:mb-12">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 shadow-xl border border-gray-700/50">
          {/* Desktop Search and Filters */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by job title..."
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location..."
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="relative">
              <FaBriefcase className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm sm:text-base"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Remote">Remote</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>

          {/* Mobile Search and Filters */}
          <div className="sm:hidden space-y-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by job title..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-sm"
            >
              <FaFilter className="text-blue-400" />
              <span>Filters</span>
              <span className="ml-auto text-xs text-gray-400">
                {showFilters ? 'Hide' : 'Show'}
              </span>
            </button>

            <div className={`grid grid-cols-1 gap-3 transition-all duration-300 ${
              showFilters ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'
            }`}>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="relative">
                <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Remote">Remote</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-red-400 text-base sm:text-lg mb-4">{error}</p>
            <button
              onClick={fetchJobs}
              className="px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0 mr-3 sm:mr-4">
                      <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                        {job.job_title}
                      </h2>
                      <div className="flex items-center text-gray-400 mt-1">
                        <FaBuilding className="mr-2 flex-shrink-0" />
                        <span className="truncate text-sm sm:text-base">{job.company_name}</span>
                      </div>
                    </div>
                    <span className="px-2 sm:px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                      {job.job_type}
                    </span>
                  </div>

                  <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                    <div className="flex items-center text-gray-400 text-sm sm:text-base">
                      <FaMapMarkerAlt className="mr-2" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm sm:text-base">
                      <FaClock className="mr-2" />
                      <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm sm:text-base">
                      <FaMoneyBillWave className="mr-2" />
                      <span>${job.min_salary} - ${job.max_salary} USD</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex flex-wrap gap-2">
                      {job.skills?.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-md text-xs sm:text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center text-sm sm:text-base"
                      onClick={() => navigate(`/apply/${job.id}`)}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 sm:py-12">
                <FaBriefcase className="text-4xl sm:text-6xl text-gray-700 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-400 text-base sm:text-lg mb-4">No jobs found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setLocation("");
                    setCategory("");
                    setShowFilters(false);
                  }}
                  className="px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;
