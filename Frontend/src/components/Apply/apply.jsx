import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Apply = () => {
  const { jobId } = useParams(); // Get job ID from URL
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [otherJobs, setOtherJobs] = useState([]);
  const [coverLetter, setCoverLetter] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState(null); // Placeholder for file upload

  useEffect(() => {
    fetchJobDetails();
    fetchOtherJobs();
  }, []);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs/${jobId}`);
      if (!response.ok) throw new Error("Failed to fetch job details");

      const data = await response.json();
      setJob(data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const fetchOtherJobs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs`);
      if (!response.ok) throw new Error("Failed to fetch other jobs");

      const data = await response.json();
      // Exclude current job from the list
      const filteredJobs = data.filter((job) => job.id !== Number(jobId));
      setOtherJobs(filteredJobs);
    } catch (error) {
      console.error("Error fetching other jobs:", error);
    }
  };

  const handleApply = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/job_seeker/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "job-seeker-token", // Ensure valid token
        },
        body: JSON.stringify({
          job_seeker_id: 1, // Replace with actual logged-in user ID
          job_listing_id: jobId,
          cover_letter: coverLetter,
          expected_salary: expectedSalary,
          experience: experience,
          skills: skills.split(","), // Convert string to array
        }),
      });

      if (!response.ok) throw new Error("Failed to apply for job");

      alert("Application submitted successfully!");
      navigate("/job-seeker-dashboard"); // Redirect to dashboard after applying
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Error applying for job. Please try again.");
    }
  };

  if (!job) {
    return <div className="text-white text-center mt-10">Loading job details...</div>;
  }

  return (
    <div className="bg-black text-white min-h-screen p-8 flex flex-col md:flex-row">
      {/* Left Column (25% width) - Other Jobs */}
      <div className="w-full md:w-1/4 p-4 bg-gray-900 rounded-lg">
        <h2 className="text-xl font-bold text-blue-400">📌 Other Jobs</h2>
        <ul className="mt-4">
          {otherJobs.length > 0 ? (
            otherJobs.map((job) => (
              <li
                key={job.id}
                className="p-2 border-b border-gray-700 cursor-pointer hover:text-blue-400"
                onClick={() => navigate(`/apply/${job.id}`)}
              >
                {job.job_title} - {job.location}
              </li>
            ))
          ) : (
            <p className="text-gray-400">No other jobs available</p>
          )}
        </ul>
      </div>

      {/* Right Column (75% width) - Job Details & Apply Form */}
      <div className="w-full md:w-3/4 p-6 bg-gray-900 ml-4 rounded-lg">
        {/* Job Title */}
        <h1 className="text-3xl font-bold text-blue-400">{job.job_title}</h1>
        <p className="text-gray-400 mt-2">{job.location} • {job.job_type}</p>

        {/* How to Apply */}
        <div className="mt-6">
          <h2 className="text-xl font-bold">📌 How to Apply</h2>
          <p className="text-gray-300 mt-2">
            Submit your application with a cover letter. Our team will review your application and contact you if you're shortlisted.
          </p>
        </div>

        {/* Requirements */}
        <div className="mt-6">
          <h2 className="text-xl font-bold">📋 Requirements</h2>
          <ul className="list-disc list-inside text-gray-300 mt-2">
            {job.requirements && job.requirements.length > 0 ? (
              job.requirements.map((req, index) => <li key={index}>{req}</li>)
            ) : (
              <li>No specific requirements listed.</li>
            )}
          </ul>
        </div>

        {/* What You'll Get */}
        <div className="mt-6">
          <h2 className="text-xl font-bold">🎁 What You'll Get</h2>
          <p className="text-gray-300 mt-2">
            Salary: <span className="text-green-400">${job.min_salary} - ${job.max_salary} per year</span>
          </p>
          <p className="text-gray-300 mt-2">Health Insurance, Remote Work, Performance Bonus, and more.</p>
        </div>

        {/* Experience Required */}
        <div className="mt-6">
          <h2 className="text-xl font-bold">🔍 Experience Required</h2>
          <p className="text-gray-300 mt-2">{job.experience || "No experience mentioned"}</p>
        </div>

        {/* Apply Form */}
        <div className="mt-6">
          <h2 className="text-xl font-bold">✍️ Apply Now</h2>

          {/* Expected Salary */}
          <div className="mt-4">
            <label className="text-gray-400">Expected Salary ($)</label>
            <input
              type="number"
              className="w-full p-2 mt-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
            />
          </div>

          {/* Years of Experience */}
          <div className="mt-4">
            <label className="text-gray-400">Years of Experience</label>
            <input
              type="number"
              className="w-full p-2 mt-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>

          {/* Skills Input */}
          <div className="mt-4">
            <label className="text-gray-400">Skills (comma-separated)</label>
            <input
              type="text"
              className="w-full p-2 mt-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              placeholder="e.g., React, Node.js, Python"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          {/* Cover Letter Input */}
          <div className="mt-4">
            <label className="text-gray-400">Cover Letter</label>
            <textarea
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white mt-2"
              rows="5"
              placeholder="Write your cover letter here..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>

          {/* Apply Button */}
          <button
            className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            onClick={handleApply}
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Apply;
