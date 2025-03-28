import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";
import { getToken } from "../../../tokenUtils"; // Import getToken for user ID

const InterviewScheduling = () => {
    const [scheduledJobs, setScheduledJobs] = useState([]); // Jobs with scheduled interviews
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const seekerId = getToken(); // Fetch user ID using getToken()
        const apiUrl = import.meta.env.VITE_API_URL; // Use VITE_API_URL for API requests

        // Fetch jobs with scheduled interviews
        axios
            .get(`${apiUrl}/interview/get_seeker_interview/${seekerId}`)
            .then((response) => {
                // The data is nested inside an 'interviews' array
                if (response.data && response.data.interviews && Array.isArray(response.data.interviews) && response.data.interviews.length > 0) {
                    setScheduledJobs(response.data.interviews);
                } else {
                    setScheduledJobs([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Interview fetch error:", err);
                setError("Failed to fetch scheduled interviews. Please try again.");
                setLoading(false);
            });
    }, []);

    // Format date from ISO string to readable format
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Extract time from ISO string
    const formatTime = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    // Render the status badge with appropriate color
    const getStatusBadge = (status) => {
        let bgColor = "bg-gray-500";
        
        if (status === "Completed") bgColor = "bg-green-500";
        else if (status === "Scheduled") bgColor = "bg-blue-500";
        else if (status === "Pending") bgColor = "bg-yellow-500";
        else if (status === "Cancelled") bgColor = "bg-red-500";
        
        return (
            <span className={`${bgColor} text-white text-xs font-medium py-1 px-2 rounded-full`}>
                {status || "Unknown"}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-500/20 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            <div className="max-w-[1600px] mx-auto relative">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Scheduled Interviews
                    </h1>
                    <p className="text-gray-400 text-lg">
                        View and manage your scheduled interviews
                    </p>
                </div>

                {/* Scheduled Jobs Section */}
                <div className="space-y-6">
                    {error && (
                        <div className="text-center py-12">
                            <p className="text-red-400 text-lg mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                    {scheduledJobs.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50">
                                <FaBriefcase className="mx-auto text-blue-400 text-5xl mb-4 animate-bounce" />
                                <p className="text-gray-400 text-lg mb-4">
                                    No interviews have been scheduled yet.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {scheduledJobs.map((interview, index) => (
                                <div
                                    key={interview.application_id || interview.id}
                                    className="relative bg-gray-800 p-6 rounded-xl border border-gray-700/50 
                                    transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1"
                                    style={{
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
                                    }}
                                >
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-bold text-white">
                                                Application #{interview.application_id || "N/A"}
                                            </h3>
                                            {getStatusBadge(interview.status)}
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-gray-400">
                                                <FaCalendarAlt className="inline-block mr-2 text-green-400" />
                                                <strong>Date:</strong> {formatDate(interview.scheduled_date)}
                                            </p>
                                            <p className="text-gray-400">
                                                <FaClock className="inline-block mr-2 text-yellow-400" />
                                                <strong>Time:</strong> {formatTime(interview.scheduled_date)}
                                            </p>
                                            <p className="text-gray-400">
                                                <FaMapMarkerAlt className="inline-block mr-2 text-red-400" />
                                                <strong>Location:</strong> {interview.location || "Remote"}
                                            </p>
                                            <p className="text-gray-400">
                                                <i className="fas fa-user-tie inline-block mr-2 text-purple-400"></i>
                                                <strong>Interviewer:</strong> {interview.interviewer_name || "Not assigned"}
                                            </p>
                                            <p className="text-gray-400">
                                                <i className="fas fa-video inline-block mr-2 text-blue-400"></i>
                                                <strong>Mode:</strong> {interview.interview_mode || "Not specified"}
                                            </p>
                                            {interview.interview_link && (
                                                <a 
                                                    href={interview.interview_link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="block mt-4 text-blue-400 hover:text-blue-300 transition-colors"
                                                >
                                                    <i className="fas fa-external-link-alt mr-2"></i>
                                                    Join Interview
                                                </a>
                                            )}
                                            <p className="text-gray-500 text-xs mt-2">
                                                <strong>Interview ID:</strong> #{interview.id}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            ))}
                        </div>
                    )}
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
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
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
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 15s ease infinite;
                }
                .animate-float {
                    animation: float 5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default InterviewScheduling;
