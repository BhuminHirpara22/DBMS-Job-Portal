import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import { 
  FaFileUpload, 
  FaFile, 
  FaRobot, 
  FaSearch, 
  FaListAlt, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaFileAlt, 
  FaMagic
} from 'react-icons/fa';

// Set the worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const ATSChecker = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisType, setAnalysisType] = useState("Quick Scan");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileHover, setFileHover] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Animation settings
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Progress animation
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          const newProgress = prevProgress + (100 - prevProgress) * 0.1;
          return newProgress >= 99 ? 99 : newProgress;
        });
      }, 300);
    } else {
      setUploadProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (e.dataTransfer.files[0].type === "application/pdf") {
        setFile(e.dataTransfer.files[0]);
      } else {
        alert("Please upload a PDF file only");
      }
    }
  };

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let text = "";
      
      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ") + " ";
      }
      
      return text;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw error;
    }
  };

  const analyzeResume = async () => {
    if (!file) {
      alert("Please upload a resume file first");
      return;
    }
    
    setLoading(true);
    setResponse(null);
    setUploadProgress(10);

    try {
      const pdfText = await extractTextFromPDF(file);
      setUploadProgress(40);

      let prompt;
      switch (analysisType) {
        case "Quick Scan":
          prompt = `Provide a quick scan of the following resume:
          1. Identify the most suitable profession for this resume.
          2. List 3 key strengths of the resume.
          3. Suggest 2 quick improvements.
          4. Give an overall ATS score out of 100.
          Resume text: ${pdfText}
          Job description (if provided): ${jobDescription}`;
          break;
        case "Detailed Analysis":
          prompt = `Provide a detailed analysis of the following resume:
          1. Identify the most suitable profession for this resume.
          2. List 5 strengths of the resume.
          3. Suggest 3-5 areas for improvement with specific recommendations.
          4. Rate the following aspects out of 10: Impact, Brevity, Style, Structure, Skills.
          5. Provide a brief review of each major section (e.g., Summary, Experience, Education).
          6. Give an overall ATS score out of 100 with a breakdown of the scoring.
          Resume text: ${pdfText}
          Job description (if provided): ${jobDescription}`;
          break;
        case "ATS Optimization":
          prompt = `Analyze the following resume for ATS optimization:
          1. Identify keywords from the job description that should be included in the resume.
          2. Suggest reformatting or restructuring to improve ATS readability.
          3. Recommend changes to improve keyword density without keyword stuffing.
          4. Provide 3-5 bullet points on how to tailor this resume for the specific job description.
          5. Give an ATS compatibility score out of 100 and explain how to improve it.
          Resume text: ${pdfText}
          Job description: ${jobDescription}`;
          break;
        default:
          prompt = "";
      }

      setUploadProgress(60);

      // Simulate API call
      setTimeout(() => {
        setResponse({
          type: analysisType,
          content: `This is a simulated response for ${analysisType}:\n\n${prompt.substring(0, 200)}...`,
          score: Math.floor(Math.random() * 30) + 70, // Random score between 70-99
        });
        setLoading(false);
        setUploadProgress(100);
      }, 2000);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setResponse({ 
        type: "Error", 
        content: "Failed to analyze resume. Please try again.",
        error: true
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      <div className="max-w-[1400px] mx-auto relative">
        {/* Page Header */}
        <div className="text-center mb-10 transform transition-all duration-500">
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 
                         transform transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            ATS Resume Checker
          </h1>
          <p className={`text-gray-400 text-lg max-w-2xl mx-auto transform transition-all duration-500 delay-100 
                        ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            Optimize your resume for Applicant Tracking Systems and increase your chances of getting interviews
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Resume Upload & Job Description */}
          <div className={`transform transition-all duration-500 delay-200 
                          ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaFileUpload className="mr-2 text-blue-400" />
                Upload Your Resume
              </h2>

              {/* PDF Upload Area */}
              <div 
                className={`relative mb-6 border-2 border-dashed rounded-xl p-8 text-center transition-all
                          ${!file && 'hover:border-blue-400'} 
                          ${dragActive ? 'border-blue-400 bg-blue-500/10' : 'border-gray-600'} 
                          ${file ? 'border-green-400 bg-green-500/10' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={loading}
                />
                
                <div className="flex flex-col items-center justify-center py-4">
                  {file ? (
                    <>
                      <div className="h-16 w-16 mb-4 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
                        <FaCheckCircle className="text-green-400 text-2xl" />
                      </div>
                      <p className="text-green-400 font-medium mb-1">{file.name}</p>
                      <p className="text-gray-400 text-sm">{Math.round(file.size / 1024)} KB</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="mt-4 px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                      >
                        Change File
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="h-16 w-16 mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <FaFileAlt className="text-blue-400 text-2xl" />
                      </div>
                      <p className="text-white font-medium mb-2">Drag & drop your resume here</p>
                      <p className="text-gray-400 text-sm mb-4">or click to browse files (PDF only)</p>
                      <div className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 
                                  hover:bg-blue-500/30 transition-colors inline-flex items-center">
                        <FaFileUpload className="mr-2" /> Select PDF File
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-2 flex items-center">
                  <FaListAlt className="mr-2 text-blue-400" />
                  Job Description
                </label>
                <div className="relative group">
                  <textarea
                    className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl 
                             text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 
                             focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 min-h-[180px]
                             group-hover:border-blue-500/30"
                    placeholder="Paste the job description here to analyze your resume's compatibility..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Analysis Type */}
              <div className="mb-8">
                <label className="block text-lg font-semibold mb-2 flex items-center">
                  <FaSearch className="mr-2 text-blue-400" />
                  Analysis Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Quick Scan", "Detailed Analysis", "ATS Optimization"].map((type) => (
                    <div 
                      key={type}
                      onClick={() => !loading && setAnalysisType(type)} 
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-300
                                ${analysisType === type 
                                  ? 'bg-blue-500/20 border-2 border-blue-500/50 shadow-lg shadow-blue-500/10' 
                                  : 'bg-gray-700/50 border border-gray-600/50 hover:bg-gray-700/90'}`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2
                                      ${analysisType === type ? 'bg-blue-500/30' : 'bg-gray-600/30'}`}>
                          {type === "Quick Scan" && <FaRobot className={analysisType === type ? 'text-blue-400' : 'text-gray-400'} />}
                          {type === "Detailed Analysis" && <FaSearch className={analysisType === type ? 'text-blue-400' : 'text-gray-400'} />}
                          {type === "ATS Optimization" && <FaMagic className={analysisType === type ? 'text-blue-400' : 'text-gray-400'} />}
                        </div>
                        <span className={`font-medium ${analysisType === type ? 'text-blue-400' : 'text-gray-300'}`}>
                          {type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                className={`w-full p-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2
                         ${loading 
                           ? 'bg-gray-700 cursor-not-allowed' 
                           : file 
                             ? 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-blue-500/20' 
                             : 'bg-gray-700 cursor-not-allowed'}`}
                onClick={analyzeResume}
                disabled={loading || !file}
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <FaRobot className="mr-1" /> 
                    {file ? 'Analyze Resume' : 'Upload a Resume to Start'}
                  </>
                )}
              </button>
              
              {loading && (
                <div className="mt-4">
                  <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Analyzing...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Results */}
          <div className={`transform transition-all duration-500 delay-300 
                          ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 h-full shadow-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaSearch className="mr-2 text-blue-400" />
                Analysis Results
              </h2>

              {!response && !loading ? (
                <div className="flex flex-col items-center justify-center h-[80%] text-center">
                  <div className="h-20 w-20 mb-6 bg-gray-700/50 rounded-full flex items-center justify-center">
                    <FaRobot className="text-gray-500 text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-300">No Analysis Yet</h3>
                  <p className="text-gray-400 max-w-md">
                    Upload your resume and click "Analyze Resume" to see how your CV performs with Applicant Tracking Systems
                  </p>
                </div>
              ) : !response && loading ? (
                <div className="flex flex-col items-center justify-center h-[80%] text-center">
                  <div className="h-20 w-20 mb-6 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
                    <FaRobot className="text-blue-400 text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-300">Analyzing Your Resume</h3>
                  <p className="text-gray-400 max-w-md mb-6">
                    We're processing your resume and job description. This will only take a moment...
                  </p>
                  <div className="w-64 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : response && response.error ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
                      <FaExclamationTriangle className="text-red-400 text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-red-400">Analysis Failed</h3>
                  </div>
                  <p className="text-gray-300 mb-4">{response.content}</p>
                  <button
                    onClick={() => {
                      setResponse(null);
                      setUploadProgress(0);
                    }}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors inline-flex items-center"
                  >
                    Try Again
                  </button>
                </div>
              ) : response && (
                <div className="animate-fadeIn">
                  <div className="mb-6 bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-white">{response.type} Results</h3>
                      {response.score && (
                        <div className="flex items-center">
                          <div className="relative h-16 w-16">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#4b5563"
                                strokeWidth="3"
                                strokeDasharray="100, 100"
                              />
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={response.score >= 90 ? "#34d399" : response.score >= 70 ? "#60a5fa" : "#fbbf24"}
                                strokeWidth="3"
                                strokeDasharray={`${response.score}, 100`}
                              />
                              <text x="18" y="20.5" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">
                                {response.score}
                              </text>
                            </svg>
                          </div>
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-400">ATS Score</div>
                            <div className={`text-lg font-bold ${
                              response.score >= 90 ? 'text-green-400' : 
                              response.score >= 70 ? 'text-blue-400' : 
                              'text-yellow-400'
                            }`}>
                              {response.score}%
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="whitespace-pre-line text-gray-300 mt-4">
                      {response.content}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setResponse(null)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                             transition-colors shadow-lg hover:shadow-blue-500/20
                             flex items-center justify-center mx-auto"
                  >
                    Analyze Another Resume
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-10px) translateX(5px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ATSChecker;