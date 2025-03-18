import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="flex justify-between items-center px-8 py-4 bg-gray-900">
        <h1 className="text-2xl font-bold">JobPortal</h1>
        <div>
          {/* ✅ Separate Login Buttons for Job Seekers & Employers */}
          <button
            className="bg-transparent text-white border border-white px-4 py-2 rounded-md mr-4 hover:bg-gray-800"
            onClick={() => navigate("/login/jobseeker")}
          >
            Job Seeker Login
          </button>
          <button
            className="bg-transparent text-white border border-white px-4 py-2 rounded-md mr-4 hover:bg-gray-800"
            onClick={() => navigate("/login/employer")}
          >
            Employer Login
          </button>

          {/* ✅ Signup Button Navigates to Role Selection */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={() => navigate("/role")}
          >
            Signup
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row justify-center items-center p-10 md:p-20 gap-10">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold">
            Find Your <span className="text-blue-500">Dream Job</span> Today
          </h1>
          <p className="mt-4 text-gray-400">
            Connect with thousands of employers and opportunities tailored to your skills and ambitions.
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg w-full md:w-2/5 cursor-pointer" onClick={() => navigate("/jobs")}>
          <h2 className="text-xl font-bold">Quick Job Search</h2>
          <div className="mt-4">
            <label className="text-gray-400">Keyword or Title</label>
            <input
              type="text"
              placeholder="e.g., Software Developer, Marketing"
              className="w-full p-2 mt-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              readOnly
            />
          </div>
          <div className="mt-4">
            <label className="text-gray-400">Location</label>
            <input
              type="text"
              placeholder="City, State or Remote"
              className="w-full p-2 mt-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              readOnly
            />
          </div>
          <div className="mt-4">
            <label className="text-gray-400">Category</label>
            <select className="w-full p-2 mt-2 bg-gray-800 border border-gray-700 rounded-md text-white" disabled>
              <option>All Categories</option>
              <option>Remote</option>
              <option>Engineering</option>
              <option>Part-time</option>
              <option>Marketing</option>
            </select>
          </div>

          {/* ✅ Clicking the Search Button Takes Users to Job Listings */}
          <button
            className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md flex items-center justify-center hover:bg-blue-600"
            onClick={() => navigate("/jobs")}
          >
            <FaSearch className="mr-2" /> Search Jobs
          </button>

          <p className="mt-4 text-gray-400 text-sm">
            Popular:{" "}
            <span className="text-blue-500 cursor-pointer">Remote</span>,{" "}
            <span className="text-blue-500 cursor-pointer">Engineering</span>,{" "}
            <span className="text-blue-500 cursor-pointer">Part-time</span>,{" "}
            <span className="text-blue-500 cursor-pointer">Marketing</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
