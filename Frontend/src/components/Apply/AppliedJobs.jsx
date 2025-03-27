import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../../../tokenUtils';
import { 
  FaBriefcase, 
  FaMapMarkerAlt, 
  FaMoneyBillWave, 
  FaUsers, 
  FaCalendarAlt,
  FaClock,
  FaBuilding,
  FaArrowRight,
  FaSearch,
  FaFilter,
  FaSort
} from 'react-icons/fa';

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const jobSeekerID = getToken();
        
        if (!jobSeekerID) {
          navigate('/login/jobseeker');
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/job_seeker/jobsApplied/${jobSeekerID}`, {
          headers: {
            Authorization: `job-seeker-token`
          }
        });

        // Handle null or empty response
        const jobsData = response.data || [];
        setAppliedJobs(jobsData);
        setFilteredJobs(jobsData);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error fetching applied jobs:', err);
        // Only set error if it's not a 404 (no jobs found)
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || 'Failed to fetch applied jobs');
        } else {
          setError(null);
        }
        // Initialize with empty arrays
        setAppliedJobs([]);
        setFilteredJobs([]);
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [navigate]);

  useEffect(() => {
    if (!Array.isArray(appliedJobs)) {
      setFilteredJobs([]);
      return;
    }

    let filtered = appliedJobs.filter(job => 
      job?.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job?.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job?.status === statusFilter);
    }

    // Apply job type filter
    if (jobTypeFilter !== 'all') {
      filtered = filtered.filter(job => job?.job_type === jobTypeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b?.applied_date || 0) - new Date(a?.applied_date || 0);
        case 'oldest':
          return new Date(a?.applied_date || 0) - new Date(b?.applied_date || 0);
        case 'salary-high':
          return (b?.max_salary || 0) - (a?.max_salary || 0);
        case 'salary-low':
          return (a?.min_salary || 0) - (b?.min_salary || 0);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  }, [searchTerm, appliedJobs, statusFilter, jobTypeFilter, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
        {/* Page Header */}
        <div className="text-center mb-12 transform transition-all duration-500">
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 
                         transform transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            My Applications
          </h1>
          <p className={`text-gray-400 text-lg transform transition-all duration-500 delay-100 
                        ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            Track and manage your job applications
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className={`mb-8 max-w-2xl mx-auto transform transition-all duration-500 delay-200 
                        ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="relative group mb-4">
            <input
              type="text"
              placeholder="Search jobs, companies, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl 
                       text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 
                       focus:ring-2 focus:ring-blue-500/20 transition-all duration-300
                       group-hover:border-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-500/10"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 
                               group-hover:text-blue-400 transition-colors duration-300" />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-4">
            {/* Status Filter */}
            <div className="relative group w-full">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 
                         rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all duration-300 cursor-pointer text-sm sm:text-base
                         group-hover:border-blue-500/30"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                                 group-hover:text-blue-400 transition-colors duration-300 pointer-events-none" />
            </div>

            {/* Job Type Filter */}
            <div className="relative group w-full">
              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 
                         rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all duration-300 cursor-pointer text-sm sm:text-base
                         group-hover:border-blue-500/30"
              >
                <option value="all">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
              <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                                 group-hover:text-blue-400 transition-colors duration-300 pointer-events-none" />
            </div>

            {/* Sort Options */}
            <div className="relative group w-full">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 
                         rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all duration-300 cursor-pointer text-sm sm:text-base
                         group-hover:border-blue-500/30"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="salary-high">Salary: High to Low</option>
                <option value="salary-low">Salary: Low to High</option>
              </select>
              <FaSort className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                               group-hover:text-blue-400 transition-colors duration-300 pointer-events-none" />
            </div>
          </div>

          {/* Application Count Badge */}
          <div className="mt-4 flex justify-center">
            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              {Array.isArray(filteredJobs) ? filteredJobs.length : 0} {filteredJobs?.length === 1 ? 'Application' : 'Applications'} Found
            </span>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50">
                <FaBriefcase className="mx-auto text-blue-400 text-5xl mb-4 animate-bounce" />
                <p className="text-gray-400 text-lg mb-4">No applications found.</p>
                <button
                  onClick={() => navigate('/jobs')}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
                >
                  Browse Jobs
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job, index) => (
                <div
                  key={job.id}
                  className="relative bg-gray-800 p-6 rounded-xl border border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
                  }}
                >
                  {/* Card Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0 mr-4">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 
                                     transition-colors duration-300 truncate">
                          {job.job_title || 'Untitled Job'}
                        </h3>
                        <div className="flex items-center text-gray-300 text-sm">
                          <FaBuilding className="mr-2 text-blue-400" />
                          <span className="truncate">{job.company_name}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm 
                                     whitespace-nowrap flex-shrink-0 border border-blue-500/30 
                                     group-hover:bg-blue-500/30 group-hover:border-blue-500/40 
                                     transition-all duration-300">
                        {job.job_type}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-300 text-sm group-hover:text-white 
                                   transition-colors duration-300">
                        <FaMapMarkerAlt className="mr-2 text-blue-400" />
                        <span className="truncate">{job.location || 'Location Not Specified'}</span>
                      </div>
                      <div className="flex items-center text-gray-300 text-sm group-hover:text-white 
                                   transition-colors duration-300">
                        <FaMoneyBillWave className="mr-2 text-blue-400" />
                        <span>${job.min_salary?.toLocaleString() || 0} - ${job.max_salary?.toLocaleString() || 0} USD</span>
                      </div>
                      <div className="flex items-center text-gray-300 text-sm group-hover:text-white 
                                   transition-colors duration-300">
                        <FaUsers className="mr-2 text-blue-400" />
                        <span>{job.applicant_count || 0} Applications</span>
                      </div>
                      <div className="flex items-center text-gray-300 text-sm group-hover:text-white 
                                   transition-colors duration-300">
                        <FaCalendarAlt className="mr-2 text-blue-400" />
                        <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-300 text-sm group-hover:text-white 
                                   transition-colors duration-300">
                        <FaCalendarAlt className="mr-2 text-blue-400" />
                        <span>Expires {new Date(job.expiry_date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        job.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        job.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        job.status === 'Rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {job.status || 'Active'}
                      </span>
                      <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                        <span className="text-sm">View Details</span>
                        <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Card Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 
                                rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
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

export default AppliedJobs;
