import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../tokenUtils";
import { FaBriefcase, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const AcceptedJobs = () => {
    const [jobs, setJobs] = useState([]); // Jobs based on the selected status
    const [status, setStatus] = useState("accepted"); // Default to "accepted" jobs
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            setError("");
            const seekerId = getToken(); // Fetch user ID using getToken()
            const apiUrl = import.meta.env.VITE_API_URL; // Use VITE_API_URL for API requests

            try {
                const endpoint = status === "accepted" ? "get_accepted_application" : "get_rejected_application";
                const response = await axios.get(`${apiUrl}/application/${endpoint}/${seekerId}`);
                setJobs(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setError("Failed to fetch jobs. Please try again.");
            } finally {
                setLoading(false);
            }
            
        };

        fetchJobs();
    }, [status]);

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
                        {status === "accepted" ? "Accepted Jobs" : "Rejected Jobs"}
                    </h1>
                    <p className="text-gray-400 text-lg">
                        View jobs that have been {status}.
                    </p>
                </div>

                {/* Status Selector */}
                <div className="flex justify-center mb-8">
                    <button
                        onClick={() => setStatus("accepted")}
                        className={`px-6 py-2 rounded-lg mx-2 ${
                            status === "accepted"
                                ? "bg-green-500 text-white"
                                : "bg-gray-700 text-gray-400"
                        } hover:bg-green-600 transition-all`}
                    >
                        Accepted Jobs
                    </button>
                    <button
                        onClick={() => setStatus("rejected")}
                        className={`px-6 py-2 rounded-lg mx-2 ${
                            status === "rejected"
                                ? "bg-red-500 text-white"
                                : "bg-gray-700 text-gray-400"
                        } hover:bg-red-600 transition-all`}
                    >
                        Rejected Jobs
                    </button>
                </div>

                {/* Jobs Section */}
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
                    {jobs.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50">
                                {status === "accepted" ? (
                                    <FaCheckCircle className="mx-auto text-green-400 text-5xl mb-4 animate-bounce" />
                                ) : (
                                    <FaTimesCircle className="mx-auto text-red-400 text-5xl mb-4 animate-bounce" />
                                )}
                                <p className="text-gray-400 text-lg mb-4">
                                    No {status} jobs found.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job, index) => (
                                <div
                                    key={job.id}
                                    className="relative bg-gray-800 p-6 rounded-xl border border-gray-700/50 
                                    transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1"
                                    style={{
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
                                    }}
                                >
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            {job.jobTitle || "Untitled Job"}
                                        </h3>
                                        <p className="text-gray-400 mb-4">
                                            <strong>Company:</strong> {job.companyName}
                                        </p>
                                        <p className="text-gray-400">
                                            <strong>Status:</strong>{" "}
                                            {status === "accepted" ? (
                                                <span className="text-green-400">Accepted</span>
                                            ) : (
                                                <span className="text-red-400">Rejected</span>
                                            )}
                                        </p>
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

export default AcceptedJobs;
