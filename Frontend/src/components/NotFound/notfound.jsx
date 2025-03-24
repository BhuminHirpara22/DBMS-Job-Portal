import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUserRole } from "../../../tokenUtils"; // Helper to get token & role
import { FaHome, FaArrowLeft, FaGamepad, FaTrophy, FaCheck, FaTimes } from "react-icons/fa";

const jobSkills = [
  {
    jobTitle: "Software Engineer",
    skills: ["JavaScript", "React", "Node.js", "Git"],
    correctSkills: ["JavaScript", "React", "Node.js", "Git"]
  },
  {
    jobTitle: "Data Scientist",
    skills: ["Python", "Machine Learning", "SQL", "Excel"],
    correctSkills: ["Python", "Machine Learning", "SQL"]
  },
  {
    jobTitle: "UI/UX Designer",
    skills: ["Figma", "Adobe XD", "HTML", "CSS"],
    correctSkills: ["Figma", "Adobe XD", "HTML"]
  },
  {
    jobTitle: "Digital Marketing",
    skills: ["SEO", "Social Media", "Content Writing", "Analytics"],
    correctSkills: ["SEO", "Social Media", "Content Writing"]
  }
];

const NotFound = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [particles, setParticles] = useState([]);
  const [currentJob, setCurrentJob] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Handle navigation based on login status & role
  const handleRedirect = () => {
    const token = getToken();
    const role = getUserRole();

    if (token) {
      navigate(role === "employer" ? "/employer/dashboard" : "/mainpage");
    } else {
      navigate("/");
    }
  };

  // Create initial particles (limited number)
  useEffect(() => {
    const createInitialParticles = () => {
      const initialParticles = Array.from({ length: 20 }, () => ({
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
      }));
      setParticles(initialParticles);
    };

    createInitialParticles();
  }, []);

  // Update particle positions (optimized)
  useEffect(() => {
    let animationFrameId;
    let lastUpdate = 0;
    const updateInterval = 50; // Update every 50ms instead of continuously

    const updateParticles = (timestamp) => {
      if (timestamp - lastUpdate >= updateInterval) {
        setParticles(prev => 
          prev.map(particle => ({
            ...particle,
            x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
            y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
          }))
        );
        lastUpdate = timestamp;
      }
      animationFrameId = requestAnimationFrame(updateParticles);
    };

    animationFrameId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Game logic
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setGameCompleted(false);
    setCurrentJob(0);
    setSelectedSkills([]);
    setShowFeedback(false);
  };

  const handleSkillSelect = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const checkAnswer = () => {
    if (selectedSkills.length === 0) return;
    
    const currentJobData = jobSkills[currentJob];
    const isAnswerCorrect = currentJobData.correctSkills.every(skill => 
      selectedSkills.includes(skill)
    ) && selectedSkills.every(skill => 
      currentJobData.correctSkills.includes(skill)
    );

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    setTimeout(() => {
      if (isAnswerCorrect) {
        setScore(prev => prev + 1);
      }
      
      if (currentJob < jobSkills.length - 1) {
        setCurrentJob(prev => prev + 1);
        setSelectedSkills([]);
        setShowFeedback(false);
      } else {
        setGameCompleted(true);
      }
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Animated Background Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            transform: `scale(${particle.size})`,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        {/* 404 Text with 3D Effect */}
        <div className="relative">
          <h1 className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 blur-2xl -z-10 animate-pulse"></div>
        </div>

        {/* Error Message */}
        <div className="mt-8 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Game Section */}
        <div className="mt-12 space-y-6">
          {!gameStarted ? (
            <button
              onClick={startGame}
              className="group px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
            >
              <FaGamepad className="text-xl" />
              <span>Play Job Skills Match</span>
            </button>
          ) : (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-2xl font-bold text-blue-400">
                Score: {score}/{jobSkills.length}
              </div>
              
              {!gameCompleted && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-semibold mb-4">
                    Select the required skills for:
                  </h3>
                  <h4 className="text-2xl font-bold text-blue-400 mb-6">
                    {jobSkills[currentJob].jobTitle}
                  </h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {jobSkills[currentJob].skills.map((skill, index) => (
                      <button
                        key={index}
                        onClick={() => handleSkillSelect(skill)}
                        disabled={showFeedback}
                        className={`p-3 rounded-lg transition-all duration-300 ${
                          selectedSkills.includes(skill)
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-700 hover:bg-gray-600"
                        } ${showFeedback ? "cursor-default" : "cursor-pointer"}`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={checkAnswer}
                    disabled={selectedSkills.length === 0 || showFeedback}
                    className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check Answer
                  </button>

                  {showFeedback && (
                    <div className={`mt-4 text-xl font-semibold flex items-center justify-center gap-2 ${
                      isCorrect ? "text-green-400" : "text-red-400"
                    }`}>
                      {isCorrect ? (
                        <>
                          <FaCheck className="text-2xl" />
                          <span>Correct!</span>
                        </>
                      ) : (
                        <>
                          <FaTimes className="text-2xl" />
                          <span>Try Again!</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {gameCompleted && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-center gap-2 text-2xl font-bold text-green-400 mb-4">
                    <FaTrophy className="text-3xl" />
                    <span>Game Completed!</span>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Final Score: {score}/{jobSkills.length}
                  </p>
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleRedirect}
            className="group px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            <FaHome className="text-xl" />
            <span>Go Back Home</span>
          </button>
          <button
            onClick={() => window.history.back()}
            className="group px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl shadow-lg shadow-gray-500/20 hover:shadow-gray-500/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            <FaArrowLeft className="text-xl" />
            <span>Go Back</span>
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-900 to-transparent"></div>
    </div>
  );
};

export default NotFound;
