import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Role() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === "jobseeker") {
      navigate("/signup/jobseeker");
    } else if (role === "employer") {
      navigate("/signup/employer");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl text-white font-bold mb-6 text-center">
          Select Your Role
        </h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => setRole("jobseeker")}
            className={`w-full py-3 text-lg font-semibold rounded-md transition ${
              role === "jobseeker"
                ? "bg-blue-600 text-white border-2 border-blue-400"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Job Seeker
          </button>
          <button
            onClick={() => setRole("employer")}
            className={`w-full py-3 text-lg font-semibold rounded-md transition ${
              role === "employer"
                ? "bg-blue-600 text-white border-2 border-blue-400"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Employer
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6">
          <button
            type="submit"
            disabled={!role}
            className={`w-full py-3 text-lg font-bold rounded-md transition ${
              role
                ? "bg-green-500 hover:bg-green-400 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
