import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const JobListings = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]); // ✅ Always start with an empty array
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/job_seeker/jobs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "job-seeker-token", // ✅ Ensure correct token
        },
      });

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const data = await response.json();

      // ✅ Ensure we receive an array, otherwise reset jobs
      if (!Array.isArray(data)) {
        console.error("Invalid response format: Expected an array but received", data);
        setJobs([]);
      } else {
        setJobs(data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]); // ✅ Prevent .filter() errors
    }
  };

  // ✅ Ensure `jobs` is always an array before filtering
  const filteredJobs = jobs.filter(
    (job) =>
      job.job_title.toLowerCase().includes(search.toLowerCase()) &&
      job.location.toLowerCase().includes(location.toLowerCase()) &&
      (category === "" || job.job_category.toLowerCase() === category.toLowerCase())
  );

  return (
    <div className="bg-black text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center">Browse Job Listings</h1>

      {/* 🔍 Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mt-6 justify-center">
        <input
          type="text"
          placeholder="Search by job title..."
          className="p-2 w-full md:w-1/3 bg-gray-800 border border-gray-700 rounded-md text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by location..."
          className="p-2 w-full md:w-1/3 bg-gray-800 border border-gray-700 rounded-md text-white"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select
          className="p-2 w-full md:w-1/3 bg-gray-800 border border-gray-700 rounded-md text-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Remote">Remote</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      {/* 📌 Job Listings */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-gray-900 p-5 rounded-lg hover:shadow-lg transition">
              <h2 className="text-xl font-bold text-blue-400">{job.job_title}</h2>
              <p className="text-gray-400">{job.location} • {job.job_type}</p>
              <p className="text-gray-500 mt-2">{job.description.substring(0, 80)}...</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {job.min_salary} - {job.max_salary} USD
                </span>
                {/* ✅ Navigate to Apply Page */}
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  onClick={() => navigate(`/apply/${job.id}`)}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">No jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default JobListings;
