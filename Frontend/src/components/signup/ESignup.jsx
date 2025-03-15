import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export function EmployerSignup() {
  const [input, setInput] = useState({
    company_name: "",
    industry: "",
    website: "",
    email: "",
    password: "",
    confirmPassword: "",
    description: "",
    contact_person: "",
    contact_number: "",
  });

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "";
    try {
      const response = await axios.post(url, input);
      console.log(response.data);
      navigate("/login");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-8 py-10">
      <div className="w-full max-w-5xl bg-gray-800 p-10 rounded-lg shadow-lg">
        <h2 className="text-3xl text-white font-bold mb-6 text-center">
          Employer Sign Up
        </h2>
        <form onSubmit={handleSubmit} method="POST">
          <div className="grid grid-cols-2 gap-6">
            {[
              { name: "company_name", label: "Company Name" },
              { name: "industry", label: "Industry" },
              { name: "website", label: "Company Website", type: "url" },
              { name: "contact_person", label: "Your Name" },
              { name: "email", label: "Email", type: "email" },
              { name: "contact_number", label: "Contact Number", type: "tel" },
              { name: "password", label: "Password", type: "password" },
              {
                name: "confirmPassword",
                label: "Confirm Password",
                type: "password",
              },
            ].map(({ name, label, type = "text" }) => (
              <div className="mb-4" key={name}>
                <label
                  htmlFor={name}
                  className="block text-gray-300 font-medium mb-2"
                >
                  {label}
                </label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={input[name]}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={label}
                  required
                />
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-300 font-medium mb-2"
            >
              Company Description
            </label>
            <textarea
              id="description"
              name="description"
              value={input.description}
              onChange={handleChange}
              className="w-full p-3 h-24 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Describe your company..."
              required
            />
          </div>
          <div className="flex items-center justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              SIGN UP
            </button>
          </div>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
