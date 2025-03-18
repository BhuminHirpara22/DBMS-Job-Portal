import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../../tokenUtils";

export function LoginJ() {
  const navigate = useNavigate();
  const [input, setInput] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${import.meta.env.VITE_API_URL}/job_seeker/login`; // ✅ Job Seeker API Endpoint
    try {
      const response = await axios.post(url, input);
      if (response.data.success) {
        setToken(response.data.token);
        navigate("/jobs"); // ✅ Redirect to Job Listings Page
      } else {
        setError(true);
        setInput({ ...input, password: "" });
      }
    } catch (e) {
      console.log(e);
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl text-white font-bold mb-6 text-center">
          Job Seeker Login
        </h2>
        {error && (
          <p className="text-red-500 bg-red-100 text-center p-2 rounded-md mb-4">
            ❌ Invalid Credentials. Try Again.
          </p>
        )}
        <form onSubmit={handleSubmit} method="POST">
          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={input.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={input.password}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mt-6">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-md">
              LOGIN AS JOB SEEKER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginJ;
