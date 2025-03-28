import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../../tokenUtils";
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaBuilding, FaCheckCircle, FaArrowLeft, FaGraduationCap, FaUsers, FaChartLine, FaHourglassHalf } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

const Apply = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [otherJobs, setOtherJobs] = useState([]);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobDetails();
    fetchOtherJobs();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs/${jobId}`);
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
        setError("Failed to load job details. Please try again.");
      } else {
        setError("Job not found");
      }
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherJobs = async () => {
    try {
      console.log("Fetching other jobs");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs`);
      if (!response.ok) {
        throw new Error("Failed to fetch other jobs");
      }
      const data = await response.json();
      const jobsData = data || [];
      const filteredJobs = jobsData.filter((job) => job.id !== Number(jobId));
      setOtherJobs(filteredJobs);
    } catch (error) {
      console.error("Error fetching other jobs:", error);
      if (error.response?.status !== 404) {
        console.error("Failed to load other jobs");
      }
      setOtherJobs([]);
    }
  };

  const JobSeekerId = parseInt(getToken());

  const handleApply = async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("You must be logged in to apply.");
        navigate("/");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/job_seeker/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `job-seeker-token`,
        },
        body: JSON.stringify({
          job_seeker_id: JobSeekerId,
          job_listing_id: parseInt(jobId),
          cover_letter: coverLetter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error && data.error.includes("already applied")) {
          toast.error("You have already applied for this job!");
          return;
        }
        throw new Error(data.error || "Failed to apply for job");
      }

      toast.success("Application submitted successfully!");
      setTimeout(() => {
        navigate("/mainpage");
      }, 1500);
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error(error.message || "Error applying for job. Please try again.");
    }
  };

  // Calculate days until deadline
  const calculateDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1F2937',
            color: '#fff',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="max-w-[1600px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors group"
        >
          <FaArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Job Listings
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Other Jobs */}
          <div className="lg:w-1/4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 sticky top-24 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <FaBriefcase className="mr-2 text-blue-400" />
                Similar Jobs
              </h2>
              <div className="space-y-4">
                {otherJobs.length > 0 ? (
                  otherJobs.slice(0, 5).map((otherJob) => (
                    <div
                      key={otherJob.id}
                      className="p-4 bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-900/70 transition-all duration-300 border border-transparent hover:border-blue-500/20"
                      onClick={() => navigate(`/apply/${otherJob.id}`)}
                    >
                      <h3 className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">{otherJob.job_title}</h3>
                      <div className="flex items-center text-gray-400 text-sm mt-1">
                        <FaBuilding className="mr-2" />
                        <span className="truncate">{otherJob.company_name}</span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm mt-1">
                        <FaMapMarkerAlt className="mr-2" />
                        <span className="truncate">{otherJob.location}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No similar jobs available</p>
                )}
              </div>
            </div>
          </div>

          {/* Middle Column - Job Details */}
          <div className="lg:w-2/4 space-y-6">
            {/* Job Header */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 min-w-0 mr-6">
                  <h1 className="text-4xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 group-hover:from-blue-400 group-hover:to-white transition-all duration-500">
                    {job.job_title}
                  </h1>
                  <div className="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    <FaBuilding className="mr-2 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                    <span className="truncate text-lg">{job.company_name}</span>
                  </div>
                </div>
                <span className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm whitespace-nowrap flex-shrink-0 border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all duration-300">
                  {job.job_type}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                <div className="flex items-center text-gray-400 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all duration-300 group-hover:border-blue-500/20 border border-transparent">
                  <FaMapMarkerAlt className="mr-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  <span className="truncate group-hover:text-gray-300 transition-colors duration-300">{job.location}</span>
                </div>
                <div className="flex items-center text-gray-400 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all duration-300 group-hover:border-blue-500/20 border border-transparent">
                  <FaClock className="mr-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  <span className="group-hover:text-gray-300 transition-colors duration-300">Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-400 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all duration-300 group-hover:border-blue-500/20 border border-transparent">
                  <FaMoneyBillWave className="mr-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  <span className="group-hover:text-gray-300 transition-colors duration-300">${job.min_salary} - ${job.max_salary} USD</span>
                </div>
              </div>

              {/* Deadline Section */}
              <div className="mt-6 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg border border-red-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 group-hover:from-red-500/20 group-hover:to-orange-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaHourglassHalf className="mr-3 text-red-400 text-xl group-hover:text-red-300 transition-colors duration-300" />
                    <div>
                      <h3 className="text-white font-medium group-hover:text-gray-100 transition-colors duration-300">Application Deadline</h3>
                      <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">
                        {new Date(job.expiry_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      calculateDaysUntilDeadline(job.expiry_date) <= 7 
                        ? 'text-red-400 group-hover:text-red-300' 
                        : 'text-green-400 group-hover:text-green-300'
                    }`}>
                      {calculateDaysUntilDeadline(job.expiry_date) <= 0 
                        ? 'Deadline passed' 
                        : `${calculateDaysUntilDeadline(job.expiry_date)} days left`}
                    </span>
                    {calculateDaysUntilDeadline(job.expiry_date) <= 7 && calculateDaysUntilDeadline(job.expiry_date) > 0 && (
                      <p className="text-red-400 text-xs mt-1 group-hover:text-red-300 transition-colors duration-300">Hurry up!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 transform hover:scale-[1.01] transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaGraduationCap className="mr-3 text-blue-400" />
                Job Description
              </h2>
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 transform hover:scale-[1.01] transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaUsers className="mr-3 text-blue-400" />
                Requirements
              </h2>
              <ul className="space-y-4">
                {job.requirements && job.requirements.length > 0 ? (
                  job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start text-gray-300 p-3 bg-gray-900/30 rounded-lg">
                      <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-300 p-3 bg-gray-900/30 rounded-lg">No specific requirements listed.</li>
                )}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 transform hover:scale-[1.01] transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaChartLine className="mr-3 text-blue-400" />
                Benefits
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start text-gray-300 p-3 bg-gray-900/30 rounded-lg">
                  <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Competitive salary package</span>
                </li>
                <li className="flex items-start text-gray-300 p-3 bg-gray-900/30 rounded-lg">
                  <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Health Insurance</span>
                </li>
                <li className="flex items-start text-gray-300 p-3 bg-gray-900/30 rounded-lg">
                  <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Remote Work Options</span>
                </li>
                <li className="flex items-start text-gray-300 p-3 bg-gray-900/30 rounded-lg">
                  <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Performance Bonus</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Application Form */}
          <div className="lg:w-1/4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 sticky top-24 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaBriefcase className="mr-3 text-blue-400" />
                Apply for this Position
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Cover Letter
                  </label>
                  <textarea
                    className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    rows="8"
                    placeholder="Write your cover letter here..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>
                <button
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 font-medium transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20"
                  onClick={handleApply}
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apply;
