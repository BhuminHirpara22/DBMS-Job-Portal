import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../../tokenUtils";
import { FaEdit, FaTrash, FaUserTie, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaBuilding, FaArrowLeft, FaGraduationCap, FaUsers, FaChartLine, FaHourglassHalf, FaCheckCircle } from "react-icons/fa";

const EmployerJob = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobDetails();
    fetchJobApplications();
  }, []);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/jobs/${jobId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch job details");
      }

      const data = await response.json();
      if (!data) {
        setJob(null);
        setError("Job not found");
        return;
      }
      setJob(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching job details:", error);
      if (error.response?.status !== 404) {
        setError("Failed to load job details.");
      } else {
        setError("Job not found");
      }
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobApplications = async () => {
    try {
      const token = getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/application/get_job_application/${jobId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.json())
      if (!(response.status===200)) {
        throw new Error("Failed to fetch applications");
      }

      const data = await response.json();
      const applicationsData = data || [];
      setApplications(applicationsData);
    } catch (error) {
      console.error("Error fetching applications:", error);
      if (error.response?.status !== 404) {
        console.error("Failed to load applications");
      }
      setApplications([]);
    }
  };

  const handleDeleteJob = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      const token = getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/employer/jobs/${jobId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `employer-token`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete job");

      alert("Job deleted successfully!");
      navigate("/employer/dashboard");
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleEditJob = () => {
    navigate(`/employer/job/${jobId}/edit`);
  };

  const formatExpiryDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
          onClick={fetchJobDetails}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-4 sm:mb-6 transition-colors group text-sm sm:text-base"
        >
          <FaArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Job Header */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6">
                <div className="flex-1 min-w-0 mr-0 sm:mr-6 mb-4 sm:mb-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 group-hover:from-blue-400 group-hover:to-white transition-all duration-500">
                    {job.job_title}
                  </h1>
                  <div className="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    <FaBuilding className="mr-2 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                    <span className="truncate text-base sm:text-lg">{job.company_name}</span>
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-4">
                  <button
                    onClick={handleEditJob}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-all duration-300 border border-yellow-500/20 hover:border-yellow-500/30 flex items-center justify-center text-sm sm:text-base"
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={handleDeleteJob}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-300 border border-red-500/20 hover:border-red-500/30 flex items-center justify-center text-sm sm:text-base"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6">
                <div className="flex items-center text-gray-400 p-2 sm:p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all duration-300 group-hover:border-blue-500/20 border border-transparent">
                  <FaMapMarkerAlt className="mr-2 sm:mr-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  <span className="truncate text-sm sm:text-base group-hover:text-gray-300 transition-colors duration-300">{job.location}</span>
                </div>
                <div className="flex items-center text-gray-400 p-2 sm:p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all duration-300 group-hover:border-blue-500/20 border border-transparent">
                  <FaClock className="mr-2 sm:mr-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  <span className="text-sm sm:text-base group-hover:text-gray-300 transition-colors duration-300">Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-400 p-2 sm:p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all duration-300 group-hover:border-blue-500/20 border border-transparent">
                  <FaMoneyBillWave className="mr-2 sm:mr-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  <span className="text-sm sm:text-base group-hover:text-gray-300 transition-colors duration-300">${job.min_salary} - ${job.max_salary} USD</span>
                </div>
              </div>

              {/* Deadline Section */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg border border-red-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 group-hover:from-red-500/20 group-hover:to-orange-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaHourglassHalf className="mr-2 sm:mr-3 text-red-400 text-lg sm:text-xl group-hover:text-red-300 transition-colors duration-300" />
                    <div>
                      <h3 className="text-white font-medium text-sm sm:text-base group-hover:text-gray-100 transition-colors duration-300">Application Deadline</h3>
                      <p className="text-gray-300 text-xs sm:text-sm group-hover:text-gray-200 transition-colors duration-300">
                        {formatExpiryDate(job.expiry_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                <FaGraduationCap className="mr-2 sm:mr-3 text-blue-400" />
                Job Description
              </h2>
              <p className="text-gray-300 text-sm sm:text-base whitespace-pre-wrap leading-relaxed">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                <FaUsers className="mr-2 sm:mr-3 text-blue-400" />
                Requirements
              </h2>
              <ul className="space-y-3 sm:space-y-4">
                {job.Requirements && job.Requirements.length > 0 ? (
                  job.Requirements.map((req, index) => (
                    <li key={index} className="flex items-start text-gray-300 p-2 sm:p-3 bg-gray-900/30 rounded-lg text-sm sm:text-base">
                      <FaCheckCircle className="text-green-500 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-300 p-2 sm:p-3 bg-gray-900/30 rounded-lg text-sm sm:text-base">No specific requirements listed.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Right Column - Applications */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700/50 lg:sticky lg:top-24 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                <FaUserTie className="mr-2 sm:mr-3 text-blue-400" />
                Applications ({applications.length})
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-3 sm:p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-blue-500/20 transition-all duration-300 cursor-pointer group"
                      onClick={() => navigate(`/application/get_seeker_application/${app.id}`)}
                    >
                      <h3 className="text-white font-medium text-sm sm:text-base group-hover:text-blue-400 transition-colors duration-300">
                        {app.job_seeker_name}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">{app.job_seeker_email}</p>
                      <p className="text-gray-500 text-xs sm:text-sm mt-2 line-clamp-2 group-hover:text-gray-400 transition-colors duration-300">
                        {app.cover_letter}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <p className="text-gray-400 text-sm sm:text-base">No applications received yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerJob;
