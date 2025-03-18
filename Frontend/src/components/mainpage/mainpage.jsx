import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaUserTie, FaClipboardList, FaBell } from "react-icons/fa";

const Mainpage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 bg-gray-900 shadow-lg">
        <h1 className="text-2xl font-bold">JobPortal</h1>
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={() => navigate("/logout")}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard */}
      <div className="p-10 md:p-20">
        <h2 className="text-4xl font-bold text-center">
          Welcome to Your <span className="text-blue-500">Dashboard</span>
        </h2>
        <p className="mt-2 text-center text-gray-400">
          Explore job opportunities, manage applications, and stay updated!
        </p>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {/* My Jobs */}
          <div
            className="bg-gray-900 p-6 rounded-lg text-center hover:bg-gray-800 cursor-pointer transition duration-300"
            onClick={() => navigate("/my-jobs")}
          >
            <FaBriefcase className="text-blue-500 text-4xl mx-auto" />
            <h3 className="mt-4 text-xl font-bold">My Jobs</h3>
            <p className="text-gray-400 text-sm mt-2">
              View and manage the jobs you've posted.
            </p>
          </div>

          {/* Applied Jobs */}
          <div
            className="bg-gray-900 p-6 rounded-lg text-center hover:bg-gray-800 cursor-pointer transition duration-300"
            onClick={() => navigate("/applied-jobs")}
          >
            <FaUserTie className="text-green-500 text-4xl mx-auto" />
            <h3 className="mt-4 text-xl font-bold">Applied Jobs</h3>
            <p className="text-gray-400 text-sm mt-2">
              Track jobs you've applied for.
            </p>
          </div>

          {/* Job Listings */}
          <div
            className="bg-gray-900 p-6 rounded-lg text-center hover:bg-gray-800 cursor-pointer transition duration-300"
            onClick={() => navigate("/jobs")}
          >
            <FaClipboardList className="text-yellow-500 text-4xl mx-auto" />
            <h3 className="mt-4 text-xl font-bold">Job Listings</h3>
            <p className="text-gray-400 text-sm mt-2">
              Browse and apply for new jobs.
            </p>
          </div>

          {/* Notifications */}
          <div
            className="bg-gray-900 p-6 rounded-lg text-center hover:bg-gray-800 cursor-pointer transition duration-300"
            onClick={() => navigate("/notifications")}
          >
            <FaBell className="text-red-500 text-4xl mx-auto" />
            <h3 className="mt-4 text-xl font-bold">Notifications</h3>
            <p className="text-gray-400 text-sm mt-2">
              Stay updated with job alerts and messages.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-10 flex justify-center">
          <input
            type="text"
            placeholder="Search for jobs..."
            className="w-3/4 md:w-1/2 p-3 rounded-md bg-gray-800 border border-gray-700 text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Mainpage;
