import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";

export function JobSeekerSignup() {
  const [input, setInput] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    linkedin_url: "",
    location: "",
    education: [],
    experience: [],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

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

  const addEducation = () => {
    setInput({
      ...input,
      education: [
        ...input.education,
        {
          education_level: "",
          institution_name: "",
          field_of_study: "",
          start_year: "",
          end_year: "",
          grade: "",
        },
      ],
    });
  };

  const removeEducation = (index) => {
    const newEducation = input.education.filter((_, i) => i !== index);
    setInput({ ...input, education: newEducation });
  };

  const addExperience = () => {
    setInput({
      ...input,
      experience: [
        ...input.experience,
        {
          job_title: "",
          company_name: "",
          location: "",
          start_date: "",
          end_date: "",
        },
      ],
    });
  };

  const removeExperience = (index) => {
    const newExperience = input.experience.filter((_, i) => i !== index);
    setInput({ ...input, experience: newExperience });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-10 py-6">
      <div className="w-full bg-gray-800 p-10 rounded-lg shadow-lg">
        <h2 className="text-3xl text-white font-bold mb-6 text-center">
          Job Seeker Sign Up
        </h2>
        <form
          onSubmit={handleSubmit}
          method="POST"
          className="grid grid-cols-2 gap-6"
        >
          {[
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "linkedin_url",
            "location",
            "password",
            "confirmPassword",
          ].map((name, index) => (
            <div key={index}>
              <label className="block text-gray-300 font-medium mb-2 capitalize">
                {name.replace("_", " ")}
              </label>
              <input
                type={name.includes("password") ? "password" : "text"}
                name={name}
                value={input[name]}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          ))}
          <div className="col-span-2">
            <h3 className="text-xl text-white font-semibold mb-3">Education</h3>
            {input.education.map((edu, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-4 items-center mb-3"
              >
                {Object.keys(edu).map((field, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={field.replace("_", " ")}
                    className="p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
                    value={edu[field]}
                    onChange={(e) => {
                      let newEdu = [...input.education];
                      newEdu[index][field] = e.target.value;
                      setInput({ ...input, education: newEdu });
                    }}
                    required
                  />
                ))}
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-500 text-lg"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addEducation}
              className="text-blue-500 flex items-center"
            >
              <FaPlus className="mr-1" /> Add Education
            </button>
          </div>
          <div className="col-span-2">
            <h3 className="text-xl text-white font-semibold mb-3">
              Experience
            </h3>
            {input.experience.map((exp, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-4 items-center mb-3"
              >
                {Object.keys(exp).map((field, i) => (
                  <input
                    key={i}
                    type={field.includes("date") ? "date" : "text"}
                    placeholder={field.replace("_", " ")}
                    className="p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
                    value={exp[field]}
                    onChange={(e) => {
                      let newExp = [...input.experience];
                      newExp[index][field] = e.target.value;
                      setInput({ ...input, experience: newExp });
                    }}
                    required
                  />
                ))}
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 text-lg"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addExperience}
              className="text-blue-500 flex items-center"
            >
              <FaPlus className="mr-1" /> Add Experience
            </button>
          </div>
          <div className="col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-10 rounded-md focus:ring-2 focus:ring-blue-400"
            >
              SIGN UP
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
