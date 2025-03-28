import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaBriefcase,
  FaClock,
  FaMoneyBillWave,
  FaBuilding,
  FaFilter,
  FaStar,
  FaChevronDown,
} from "react-icons/fa";
import { motion } from "framer-motion";

const JobListings = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [jobType, setJobType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/job_seeker/jobs`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `job-seeker-token`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data) {
        setJobs([]);
        setError(null);
        return;
      }

      const jobsData = Array.isArray(data.jobs) ? data.jobs : Array.isArray(data) ? data : [];
      setJobs(jobsData);
      setError(null);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      if (error.response?.status !== 404) {
        setError(error.message || "Failed to load jobs. Please try again later.");
      } else {
        setError(null);
      }
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.job_title.toLowerCase().includes(search.toLowerCase()) &&
      job.location.toLowerCase().includes(location.toLowerCase()) &&
      (category === "" || job.job_category.toLowerCase() === category.toLowerCase()) &&
      (jobType === "" || job.job_type.toLowerCase() === jobType.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div
        className="max-w-7xl mx-auto text-center mb-8 sm:mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6">
          Find Your{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Dream Job
          </span>
        </h1>
        <motion.p
          className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Discover thousands of job opportunities from top companies and
          employers around the world
        </motion.p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="max-w-7xl mx-auto mb-8 sm:mb-10 md:mb-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-gray-700/50">
          {/* Desktop Search and Filters */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="relative group">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <input
                type="text"
                placeholder="Search by job title..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm sm:text-base hover:border-blue-500/30"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="relative group">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <input
                type="text"
                placeholder="Search by location..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm sm:text-base hover:border-blue-500/30"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="relative group">
              <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-gray-300 transition-colors pointer-events-none" />
              <select
                className="w-full appearance-none pl-12 pr-10 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 cursor-pointer transition-all duration-300 text-sm sm:text-base hover:border-blue-500/30"
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
                <option value="AI & Research">AI & Research</option>
                <option value="HealthCare">HealthCare</option>
                <option value="AI & ML">AI & ML</option>
              </select>
            </div>

            <div className="relative group">
              <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-gray-300 transition-colors pointer-events-none" />
              <select
                className="w-full appearance-none pl-12 pr-10 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 cursor-pointer transition-all duration-300 text-sm sm:text-base hover:border-blue-500/30"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="">All Job Types</option>
                <option value="Full-time">Full Time</option>
                <option value="Part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          {/* Mobile Search and Filters */}
          <div className="sm:hidden space-y-4">
            <div className="relative group">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <input
                type="text"
                placeholder="Search by job title..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-sm transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-500 hover:to-purple-500 rounded-xl transition-all duration-300 text-sm font-medium"
              whileTap={{ scale: 0.98 }}
            >
              <FaFilter className="text-blue-200" />
              <span>Filters</span>
              <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-md">
                {showFilters ? "Hide" : "Show"}
              </span>
            </motion.button>

            <motion.div
              className="grid grid-cols-1 gap-4 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: showFilters ? "auto" : 0,
                opacity: showFilters ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative group">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search by location..."
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-sm transition-all"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="relative group">
                <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full appearance-none pl-12 pr-10 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent cursor-pointer text-sm transition-all"
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
                  <option value="AI & Research">AI & Research</option>
                  <option value="HealthCare">HealthCare</option>
                  <option value="AI & ML">AI & ML</option>
                </select>
              </div>

              <div className="relative group">
                <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full appearance-none pl-12 pr-10 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent cursor-pointer text-sm transition-all"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
            </motion.div>
          </div>

          {/* Clear filters button */}
          {(search || location || category || jobType) && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                setSearch("");
                setLocation("");
                setCategory("");
                setJobType("");
                setShowFilters(false);
              }}
              className="mt-4 w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300 text-sm border border-gray-700/50"
            >
              <span>Clear Filters</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-blue-400">Fetching amazing opportunities for you...</p>
          </div>
        ) : error ? (
          <motion.div
            className="text-center py-12 sm:py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-red-500/10 rounded-xl p-6 max-w-md mx-auto border border-red-500/20">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchJobs}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg transition-all duration-300 shadow-lg"
              >
                Try Again
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 xl:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  className="group bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 relative overflow-hidden"
                >
                  {job.featured && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-xs text-gray-900 font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                        <FaStar className="text-gray-900" />
                        Featured
                      </div>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4 sm:mb-5">
                    <div className="flex-1 min-w-0 mr-3 sm:mr-4">
                      <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                        {job.job_title}
                      </h2>
                      <div className="flex items-center text-gray-400 mt-1">
                        <FaBuilding className="mr-2 flex-shrink-0 text-blue-400" />
                        <span className="truncate text-sm sm:text-base">
                          {job.company_name}
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs sm:text-sm whitespace-nowrap flex-shrink-0 font-medium border border-blue-500/20">
                      {job.job_type}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4 sm:mb-5">
                    <div className="flex items-center text-gray-300 text-sm sm:text-base">
                      <FaMapMarkerAlt className="mr-2 text-purple-400" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm sm:text-base">
                      <FaClock className="mr-2 text-green-400" />
                      <span>
                        Posted {new Date(job.posted_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm sm:text-base">
                      <FaMoneyBillWave className="mr-2 text-yellow-400" />
                      <span>
                        ${job.min_salary} - ${job.max_salary} USD
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-5 line-clamp-2 min-h-[40px]">
                    {job.description}
                  </p>

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex flex-wrap gap-2">
                      {job.skills?.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-700/70 text-gray-300 rounded-md text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700/70 text-gray-300 rounded-md text-xs font-medium">
                          +{job.skills.length - 3}
                        </span>
                      )}
                    </div>
                    <motion.button
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white rounded-lg transition-colors flex items-center text-sm font-medium shadow-lg shadow-blue-900/20"
                      onClick={() => navigate(`/apply/${job.id}`)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Apply Now
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full text-center py-12 sm:py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 max-w-lg mx-auto border border-gray-700/50">
                  <FaBriefcase className="text-5xl sm:text-6xl text-gray-600 mx-auto mb-4 sm:mb-6" />
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">No Job Listings Found</h3>
                  <p className="text-gray-400 text-base sm:text-lg mb-2">
                    We couldn't find any jobs matching your criteria
                  </p>
                  <p className="text-gray-500 text-sm sm:text-base mb-6">
                    Try adjusting your search filters or check back later for new opportunities
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearch("");
                      setLocation("");
                      setCategory("");
                      setJobType("");
                      setShowFilters(false);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg transition-all duration-300 shadow-lg font-medium"
                  >
                    Clear Filters
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobListings;
