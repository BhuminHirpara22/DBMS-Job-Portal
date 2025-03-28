import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaArrowLeft, FaBriefcase, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaCalendarAlt, FaFileAlt, FaListUl } from "react-icons/fa";
import { getToken } from "../../../tokenUtils"; //  Import helper functions

const PostJob = () => {
  const navigate = useNavigate();
  const employerID = parseInt(getToken(), 10); //  Ensure employer_id is a number
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [job, setJob] = useState({
    employer_id: employerID, //  Set employer_id correctly as a number
    job_title: "",
    description: "",
    location: "",
    job_type: "",
    min_salary: "", // Will be converted to a number
    max_salary: "",
    expiry_date: "",
    job_category: "",
    requirements: [],
  });

  const [error, setError] = useState("");

  //  Handle Input Change (Ensure salaries are numbers)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob({
      ...job,
      [name]: name.includes("salary") ? parseFloat(value) || 0 : value,
    });
  };

  //  Add Requirement
  const addRequirement = () => {
    setJob({ ...job, requirements: [...job.requirements, ""] });
  };

  //  Remove Requirement
  const removeRequirement = (index) => {
    const updatedRequirements = job.requirements.filter((_, i) => i !== index);
    setJob({ ...job, requirements: updatedRequirements });
  };

  //  Handle Requirement Input Change
  const handleRequirementChange = (index, value) => {
    const updatedRequirements = [...job.requirements];
    updatedRequirements[index] = value;
    setJob({ ...job, requirements: updatedRequirements });
  };

  //  Submit Job Posting
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const token = getToken(); //  Fetch employer token
      if (!token) {
        setError("You must be logged in to post a job.");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/employer/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `employer-token`, //  Use correct Authorization format
        },
        body: JSON.stringify(job),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to post job");

      alert(" Job posted successfully!");
      navigate("/employer/dashboard"); //  Redirect after posting job
    } catch (error) {
      console.error("❌ Error posting job:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors group"
        >
          <FaArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Post a New Job
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Fill in the details below to create a new job posting
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Job Title */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaBriefcase className="mr-2 text-blue-400" />
                  Job Title
                </label>
                <input
                  type="text"
                  name="job_title"
                  value={job.job_title}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              {/* Location */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-400" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={job.location}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                  placeholder="e.g., New York, NY"
                />
              </div>

              {/* Job Type */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaClock className="mr-2 text-blue-400" />
                  Job Type
                </label>
                <select
                  name="job_type"
                  value={job.job_type}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Job Category */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaFileAlt className="mr-2 text-blue-400" />
                  Job Category
                </label>
                <select
                  name="job_category"
                  value={job.job_category}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Design">Design</option>
                  <option value="Sales">Sales</option>
                  <option value="Remote">Remote</option>
                  <option value="AI & Research">AI & Research</option>
                  <option value="AI & ML">AI & ML</option>

                </select>
              </div>

              {/* Salary Range */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-blue-400" />
                  Min Salary ($)
                </label>
                <input
                  type="number"
                  name="min_salary"
                  value={job.min_salary}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                  placeholder="e.g., 50000"
                />
              </div>

              <div className="group">
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-blue-400" />
                  Max Salary ($)
                </label>
                <input
                  type="number"
                  name="max_salary"
                  value={job.max_salary}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                  placeholder="e.g., 100000"
                />
              </div>

              {/* Expiry Date */}
              <div className="group sm:col-span-2">
                <label className="block text-gray-300 font-medium mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-400" />
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="expiry_date"
                  value={job.expiry_date}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Job Description */}
            <div className="group">
              <label className="block text-gray-300 font-medium mb-2 flex items-center">
                <FaFileAlt className="mr-2 text-blue-400" />
                Job Description
              </label>
              <textarea
                name="description"
                value={job.description}
                onChange={handleChange}
                className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[150px]"
                required
                placeholder="Describe the role, responsibilities, and requirements..."
              ></textarea>
            </div>

            {/* Requirements Section */}
            <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FaListUl className="mr-2 text-blue-400" />
                Job Requirements
              </h3>
              <div className="space-y-3">
                {job.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      className="flex-1 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter a requirement..."
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addRequirement}
                className="mt-4 flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                <FaPlus className="mr-2" /> Add Requirement
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Posting...
                  </span>
                ) : (
                  "Post Job"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
