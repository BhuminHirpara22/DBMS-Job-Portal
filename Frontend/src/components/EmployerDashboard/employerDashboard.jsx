import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaClipboardList, FaChartBar, FaBuilding, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaUsers, FaArrowRight } from "react-icons/fa";
import { getToken } from "../../../tokenUtils"; //  Import helper functions

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const employerID = getToken(); //  Ensure employer_id is retrieved
  const [jobs, setJobs] = useState(null); //  Initialize as `null`
  const [stats, setStats] = useState({ totalJobs: 0, totalApplications: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (employerID) {
      fetchEmployerJobs();
    }
  }, [employerID]);

  //  Fetch Employer's Job Listings (Pass employer_id)
  const fetchEmployerJobs = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        console.error("❌ No token found. Redirecting to login.");
        navigate("/employer/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/employer/jobs?employer_id=${employerID}`, //  Send employer_id as query param
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `employer-token`, //  Correct token format
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch jobs");

      const data = await response.json();
      setJobs(data);
      setStats({
        totalJobs: data.length,
        totalApplications: data.reduce((acc, job) => acc + (job.applicant_count || 0), 0),
      });
      setError(null);
    } catch (error) {
      console.error("❌ Error fetching jobs:", error);
      setError("Failed to load jobs. Please try again.");
      setJobs([]); //  Ensure jobs is always an array
    } finally {
      setLoading(false);
    }
  };

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
          onClick={fetchEmployerJobs}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Dashboard Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Employer Dashboard
          </h1>
          <p className="text-gray-400">Manage your job listings and track applications</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors duration-300">
                <FaClipboardList className="text-blue-400 text-2xl" />
              </div>
              <span className="text-2xl font-bold text-blue-400">{stats.totalJobs}</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-300 group-hover:text-white transition-colors duration-300">Total Job Listings</h2>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors duration-300">
                <FaChartBar className="text-green-400 text-2xl" />
              </div>
              <span className="text-2xl font-bold text-green-400">{stats.totalApplications}</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-300 group-hover:text-white transition-colors duration-300">Total Applications</h2>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors duration-300">
                <FaPlus className="text-yellow-400 text-2xl" />
              </div>
              <button
                className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors duration-300 font-medium"
                onClick={() => navigate("/employer/postjob")}
              >
                Post New Job
              </button>
            </div>
            <h2 className="text-lg font-semibold text-gray-300 group-hover:text-white transition-colors duration-300">Create New Listing</h2>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Your Job Listings</h2>
            <button
              onClick={() => navigate("/employer/postjob")}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              <span className="mr-2">Post New Job</span>
              <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(jobs) && jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group cursor-pointer"
                  onClick={() => navigate(`/employer/job/${job.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0 mr-4">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300 truncate">
                        {job.job_title}
                      </h3>
                      <div className="flex items-center text-gray-400 text-sm">
                        <FaBuilding className="mr-2" />
                        <span className="truncate">{job.company_name}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm whitespace-nowrap flex-shrink-0 border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all duration-300">
                      {job.job_type}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-400 text-sm">
                      <FaMapMarkerAlt className="mr-2" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <FaClock className="mr-2" />
                      <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <FaMoneyBillWave className="mr-2" />
                      <span>${job.min_salary} - ${job.max_salary} USD</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <FaUsers className="mr-2" />
                      <span>{job.applicant_count || 0} Applications</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
                    {job.description}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50">
                  <p className="text-gray-400 text-lg mb-4">No jobs found.</p>
                  <button
                    onClick={() => navigate("/employer/postjob")}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    Post Your First Job
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
