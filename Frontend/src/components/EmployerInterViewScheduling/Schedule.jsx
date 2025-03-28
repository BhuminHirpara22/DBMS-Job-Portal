import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../../../tokenUtils';
import { 
  FaUserAlt, 
  FaCalendarAlt, 
  FaClock, 
  FaEnvelope, 
  FaPhone,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUserClock,
  FaBriefcase,
  FaExternalLinkAlt,
  FaFilter,
  FaSort,
  FaSearch
} from 'react-icons/fa';

const Schedule = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [mounted, setMounted] = useState(false);

  // Interview scheduling modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewLocation, setInterviewLocation] = useState('');
  const [interviewMode, setInterviewMode] = useState('online');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const fetchJobApplications = async () => {
      try {
        setLoading(true);
        const employerId = getToken();
        
        if (!employerId) {
          navigate('/login/employer');
          return;
        }

        // Fetch job details - Fix the endpoint URL which may be causing loading issues
        const jobResponse = await axios.get(`${import.meta.env.VITE_API_URL}/employer/jobs/${jobId}`, {
          headers: {
            Authorization: `Bearer ${employerId}` // Update the auth header format
          }
        });
        
        // Add debugging
        console.log("Job details response:", jobResponse.data);
        setJobDetails(jobResponse.data);

        // Fetch applications for the job - Check this endpoint
        const appResponse = await axios.get(`${import.meta.env.VITE_API_URL}/application/get_job_application/${jobId}`, {
          headers: {
            Authorization: `Bearer ${employerId}` // Update the auth header format
          }
        });
        
        // Add debugging
        console.log("Applications response:", appResponse.data);
        const applicationsData = appResponse.data || [];
        setApplications(applicationsData);
        setFilteredApplications(applicationsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job applications:', err);
        // More detailed error logging
        console.error('Error details:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to fetch applications'); 
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobApplications();
      
      // Add a timeout to ensure loading state changes even if requests hang
      const timeout = setTimeout(() => {
        if (loading) {
          console.warn("Loading timed out after 10 seconds");
          setLoading(false);
          setError("Request timed out. Please try again later.");
        }
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [jobId, navigate, loading]);

  // Add this debugging section to help troubleshoot the loading state
  useEffect(() => {
    console.log("Current loading state:", loading);
    console.log("Applications data:", applications);
    console.log("Filtered applications:", filteredApplications);
  }, [loading, applications, filteredApplications]);

  useEffect(() => {
    if (!Array.isArray(applications)) {
      setFilteredApplications([]);
      return;
    }

    let filtered = applications.filter(app => 
      app?.seeker_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app?.seeker_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app?.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b?.application_date || 0) - new Date(a?.application_date || 0);
        case 'oldest':
          return new Date(a?.application_date || 0) - new Date(b?.application_date || 0);
        case 'name-asc':
          return (a?.seeker_name || '').localeCompare(b?.seeker_name || '');
        case 'name-desc':
          return (b?.seeker_name || '').localeCompare(a?.seeker_name || '');
        default:
          return 0;
      }
    });

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, sortBy]);

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/application/add_result/${applicationId}`, {
        status: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      // Update local state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      // If accepted, create notification
      if (newStatus === 'Accepted') {
        // Placeholder for notification API - this would be implemented in your backend
        const seekerId = applications.find(app => app.id === applicationId)?.seeker_id;
        if (seekerId) {
          try {
            await axios.post(`${import.meta.env.VITE_API_URL}/notification/create`, {
              user_id: seekerId,
              user_type: 'seeker',
              message: `Your application for ${jobDetails?.job_title} has been accepted!`,
              type: 'application_update'
            });
          } catch (error) {
            console.error('Failed to send notification', error);
          }
        }
      }
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('Failed to update application status.');
    }
  };

  const openScheduleModal = (applicant) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
    setInterviewDate('');
    setInterviewTime('');
    setInterviewLocation('');
    setInterviewMode('online');
    setInterviewNotes('');
  };

  const scheduleInterview = async (e) => {
    e.preventDefault();
    if (!selectedApplicant || !interviewDate || !interviewTime) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitLoading(true);
      
      // Format date and time for the backend
      const dateTime = `${interviewDate}T${interviewTime}:00`;
      
      await axios.post(`${import.meta.env.VITE_API_URL}/interview/schedule_interview`, {
        application_id: selectedApplicant.id,
        job_id: jobId,
        seeker_id: selectedApplicant.seeker_id,
        employer_id: getToken(),
        interview_date: dateTime,
        location: interviewLocation,
        mode: interviewMode,
        notes: interviewNotes
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      // Update application status to "Interview Scheduled"
      await handleUpdateStatus(selectedApplicant.id, 'Interview Scheduled');
      
      // Create notification for job seeker
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/notification/create`, {
          user_id: selectedApplicant.seeker_id,
          user_type: 'seeker',
          message: `Interview scheduled for ${jobDetails?.job_title} on ${interviewDate} at ${interviewTime}`,
          type: 'interview_scheduled'
        });
      } catch (error) {
        console.error('Failed to send notification', error);
      }

      setSubmitLoading(false);
      closeModal();
      alert('Interview scheduled successfully!');
    } catch (err) {
      console.error('Error scheduling interview:', err);
      setSubmitLoading(false);
      alert('Failed to schedule interview. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

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

      <div className="max-w-[1600px] mx-auto relative">
        {/* Page Header */}
        <div className="text-center mb-8 transform transition-all duration-500">
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 
                         transform transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            Manage Applications
          </h1>
          <p className={`text-gray-400 text-lg transform transition-all duration-500 delay-100 
                        ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {jobDetails?.job_title || 'Job'} - {applications.length} {applications.length === 1 ? 'Applicant' : 'Applicants'}
          </p>
        </div>

        {/* Back to Jobs Button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => navigate('/employer/jobs')}
            className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 
                     transition-all duration-300 hover:shadow-lg hover:shadow-gray-700/20
                     flex items-center justify-center gap-2 border border-gray-700"
          >
            ← Back to Jobs
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className={`mb-8 max-w-2xl mx-auto transform transition-all duration-500 delay-200 
                        ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="relative group mb-4">
            <input
              type="text"
              placeholder="Search applicants by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl 
                       text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 
                       focus:ring-2 focus:ring-blue-500/20 transition-all duration-300
                       group-hover:border-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-500/10"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 
                               group-hover:text-blue-400 transition-colors duration-300" />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
            {/* Status Filter */}
            <div className="relative group w-full">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 
                         rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all duration-300 cursor-pointer text-sm sm:text-base
                         group-hover:border-blue-500/30"
              >
                <option value="all">All Status</option>
                <option value="Applied">Applied</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
              </select>
              <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                                 group-hover:text-blue-400 transition-colors duration-300 pointer-events-none" />
            </div>

            {/* Sort Options */}
            <div className="relative group w-full">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 
                         rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all duration-300 cursor-pointer text-sm sm:text-base
                         group-hover:border-blue-500/30"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
              <FaSort className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                               group-hover:text-blue-400 transition-colors duration-300 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {(!applications || applications.length === 0) ? (
            <div className={`text-center py-12 transform transition-all duration-500 delay-300 
                           ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 
                            transform hover:scale-105 transition-all duration-300">
                <FaUserAlt className="mx-auto text-blue-400 text-5xl mb-4" />
                <p className="text-gray-400 text-lg mb-4">No applications found for this job.</p>
                <button
                  onClick={() => navigate('/employer/jobs')}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                           transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20
                           flex items-center justify-center mx-auto gap-2"
                >
                  Return to Jobs
                </button>
              </div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className={`text-center py-12 transform transition-all duration-500 delay-300 
                           ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 
                            transform hover:scale-105 transition-all duration-300">
                <FaUserAlt className="mx-auto text-blue-400 text-5xl mb-4" />
                <p className="text-gray-400 text-lg mb-4">No applications match your search criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setSortBy('recent');
                  }}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                           transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20
                           flex items-center justify-center mx-auto gap-2"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredApplications.map((application, index) => (
                <div
                  key={application.id}
                  className="group"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`
                  }}
                >
                  <div className="relative bg-gray-800 rounded-xl border border-gray-700/50 
                                transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 
                                hover:-translate-y-1 transform-gpu overflow-hidden">
                    {/* Status Badge */}
                    <div className={`absolute top-0 right-0 px-3 py-1 m-2 rounded-full text-xs font-medium z-10 ${
                      application.status === 'Applied' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      application.status === 'Accepted' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      application.status === 'Rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      application.status === 'Interview Scheduled' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {application.status || 'Applied'}
                    </div>
                    
                    {/* Application Content */}
                    <div className="p-6">
                      <div className="flex items-start mb-4">
                        <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <FaUserAlt className="text-blue-400 text-xl" />
                        </div>
                        <div className="ml-4 flex-grow">
                          <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {application.seeker_name || 'Applicant'}
                          </h3>
                          <div className="flex items-center text-sm text-gray-400">
                            <FaCalendarAlt className="mr-1 text-blue-400" />
                            <span>Applied: {new Date(application.application_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-5">
                        <div className="flex items-start text-sm">
                          <FaEnvelope className="mt-1 mr-2 text-blue-400" />
                          <span className="text-gray-300">{application.seeker_email || 'No email provided'}</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <FaPhone className="mt-1 mr-2 text-blue-400" />
                          <span className="text-gray-300">{application.seeker_phone || 'No phone provided'}</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <FaGraduationCap className="mt-1 mr-2 text-blue-400" />
                          <span className="text-gray-300">{application.seeker_education || 'No education details'}</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <FaBriefcase className="mt-1 mr-2 text-blue-400" />
                          <span className="text-gray-300">{application.seeker_experience || 'No experience details'}</span>
                        </div>
                        {application.resume_url && (
                          <div className="flex items-start text-sm">
                            <FaFileAlt className="mt-1 mr-2 text-blue-400" />
                            <a 
                              href={application.resume_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-400 hover:text-blue-300 flex items-center"
                            >
                              View Resume <FaExternalLinkAlt className="ml-1 text-xs" />
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Application Actions */}
                      <div className="pt-4 border-t border-gray-700/50">
                        {application.status === 'Applied' && (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleUpdateStatus(application.id, 'Accepted')}
                              className="flex items-center justify-center gap-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg
                                       border border-green-500/30 hover:bg-green-500/30 transition-colors duration-300"
                            >
                              <FaCheckCircle /> Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(application.id, 'Rejected')}
                              className="flex items-center justify-center gap-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg
                                       border border-red-500/30 hover:bg-red-500/30 transition-colors duration-300"
                            >
                              <FaTimesCircle /> Reject
                            </button>
                          </div>
                        )}

                        {application.status === 'Accepted' && (
                          <button
                            onClick={() => openScheduleModal(application)}
                            className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg
                                     border border-blue-500/30 hover:bg-blue-500/30 transition-colors duration-300"
                          >
                            <FaCalendarAlt /> Schedule Interview
                          </button>
                        )}

                        {application.status === 'Interview Scheduled' && (
                          <div className="flex items-center justify-center px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                            <FaUserClock className="mr-2" /> Interview Scheduled
                          </div>
                        )}

                        {application.status === 'Rejected' && (
                          <div className="flex items-center justify-center px-4 py-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
                            <FaTimesCircle className="mr-2" /> Application Rejected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interview Scheduling Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md p-6 animate-scaleIn">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-400" />
              Schedule Interview
            </h2>
            
            <div className="mb-4">
              <p className="text-gray-300">Applicant: <span className="text-white">{selectedApplicant?.seeker_name}</span></p>
              <p className="text-gray-300">Job: <span className="text-white">{jobDetails?.job_title}</span></p>
            </div>
            
            <form onSubmit={scheduleInterview}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Interview Date*</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Interview Time*</label>
                  <input
                    type="time"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Interview Mode</label>
                  <select
                    value={interviewMode}
                    onChange={(e) => setInterviewMode(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="online">Online</option>
                    <option value="in-person">In Person</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Location/Link</label>
                  <input
                    type="text"
                    value={interviewLocation}
                    onChange={(e) => setInterviewLocation(e.target.value)}
                    placeholder={interviewMode === 'online' ? 'Zoom/Teams link' : 'Office address'}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Notes</label>
                  <textarea
                    value={interviewNotes}
                    onChange={(e) => setInterviewNotes(e.target.value)}
                    placeholder="Additional information for the candidate"
                    rows="3"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <FaCalendarAlt /> Schedule Interview
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Schedule;
