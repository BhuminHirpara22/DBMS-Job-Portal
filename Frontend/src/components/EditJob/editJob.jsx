import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../../tokenUtils";
import { FaArrowLeft, FaSave, FaTimes, FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaGraduationCap, FaUsers, FaHourglassHalf } from "react-icons/fa";

const EditJob = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    job_title: "",
    company_name: "",
    location: "",
    job_type: "",
    min_salary: "",
    max_salary: "",
    description: "",
    Requirements: [],
    expiry_date: "",
    job_category: "",
    status: "",
  });
  const [newRequirement, setNewRequirement] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchJobDetails();
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
      setFormData({
        job_title: data.job_title || "",
        company_name: data.company_name || "",
        location: data.location || "",
        job_type: data.job_type || "",
        min_salary: data.min_salary || "",
        max_salary: data.max_salary || "",
        description: data.description || "",
        Requirements: data.Requirements || [],
        expiry_date: data.expiry_date ? data.expiry_date.split("T")[0] : "",
        status: data.status || "",
        job_category: data.job_category || "",
      });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        Requirements: [...prev.Requirements, newRequirement.trim()],
      }));
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (index) => {
    setFormData((prev) => ({
      ...prev,
      Requirements: prev.Requirements.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/employer/jobs/${jobId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `employer-token`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update job");

      alert("Job updated successfully!");
      navigate(`/employer/job/${jobId}`);
    } catch (error) {
      console.error("Error updating job:", error);
      setError("Failed to update job. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          onClick={fetchJobDetails}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-8 sm:pt-12 md:pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-4 sm:mb-6 transition-colors group"
        >
          <FaArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Job Details
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Header */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700/50">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Edit Job Details
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Type
                </label>
                <select
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  required
                >
                  <option value="">Select Job Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Minimum Salary
                </label>
                <input
                  type="number"
                  name="min_salary"
                  value={formData.min_salary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Maximum Salary
                </label>
                <input
                  type="number"
                  name="max_salary"
                  value={formData.max_salary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700/50">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaGraduationCap className="mr-2 text-blue-400" />
              Job Description
            </h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="6"
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
              required
            />
          </div>

          {/* Requirements */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700/50">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaUsers className="mr-2 text-blue-400" />
              Requirements
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Add a requirement"
                  className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {formData.Requirements.map((req, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg"
                  >
                    <span className="text-gray-300">{req}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave className="mr-2" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
