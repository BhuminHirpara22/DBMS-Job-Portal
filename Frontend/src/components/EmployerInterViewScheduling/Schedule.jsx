import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  FaSearch,
  FaChartLine
} from 'react-icons/fa';

const Schedule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const jobId = queryParams.get('job');
  const applicantId = queryParams.get('applicant');
  
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [mounted, setMounted] = useState(false);
  const [skillsFilter, setSkillsFilter] = useState([]);
  const [uniqueSkills, setUniqueSkills] = useState([]);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);

  // Interview scheduling modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewLocation, setInterviewLocation] = useState('');
  const [interviewMode, setInterviewMode] = useState('online');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [interviewerName, setInterviewerName] = useState('');
  const [interviewerPhone, setInterviewerPhone] = useState('');

  // Retry mechanism state
  const MAX_RETRIES = 3;
  const TIMEOUT_DURATION = 20000; // Increase timeout to 20 seconds
  const [retryCount, setRetryCount] = useState(0);
  const [retryTimeout, setRetryTimeout] = useState(null);
  const [loadingTimeout, setLoadingTimeout] = useState(null);
  const [fetchingJob, setFetchingJob] = useState(false);
  const [fetchingApplications, setFetchingApplications] = useState(false);

  // Add a new state for the detailed view of an applicant
  const [selectedApplicantDetails, setSelectedApplicantDetails] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Add state for interview update modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [interviewToUpdate, setInterviewToUpdate] = useState(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const fetchJobApplications = async () => {
      try {
        setLoading(true);
        
        // Clear any existing timeouts
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
        }
        
        // Set new timeout for overall loading
        const timeout = setTimeout(() => {
          if (loading) {
            console.warn("Loading timed out after " + TIMEOUT_DURATION/1000 + " seconds");
            setLoading(false);
            setFetchingJob(false);
            setFetchingApplications(false);
            setError("Request timed out. Please try again later.");
          }
        }, TIMEOUT_DURATION);
        setLoadingTimeout(timeout);
        
        const token = getToken();
        
        if (!token) {
          navigate('/login/employer');
          return;
        }

        if (!jobId) {
          setError("No job selected");
          setLoading(false);
          return;
        }

        // Fetch job details
        setFetchingJob(true);
        let jobDetailsSuccess = false;
        let jobData = null;
        let retries = 0;

        while (!jobDetailsSuccess && retries < MAX_RETRIES) {
          try {
            const jobResponse = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/${jobId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              },
              timeout: 8000 // Set axios timeout
            });
            
            jobData = jobResponse.data;
            jobDetailsSuccess = true;
            console.log("Job details response:", jobData);
          } catch (err) {
            retries++;
            if (err.response && err.response.status === 429) {
              const backoff = (retries * 2000);
              console.log(`Rate limited. Retrying job details in ${backoff/1000}s... (${retries}/${MAX_RETRIES})`);
              await new Promise(resolve => setTimeout(resolve, backoff));
            } else if (retries >= MAX_RETRIES) {
              throw err;
            } else {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }

        setFetchingJob(false);
        setJobDetails(jobData);

        // Fetch applications for the job
        setFetchingApplications(true);
        let applicationsSuccess = false;
        let applicationsData = [];
        retries = 0;

        while (!applicationsSuccess && retries < MAX_RETRIES) {
          try {
            const appResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/application/get_job_application/${jobId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                },
                timeout: 8000 // Set axios timeout
              }
            );
            
            // Properly handle the response structure
            if (appResponse.data && Array.isArray(appResponse.data.applications)) {
              applicationsData = appResponse.data.applications;
            } else if (Array.isArray(appResponse.data)) {
              // Fallback if the response is an array directly
              applicationsData = appResponse.data;
            } else {
              applicationsData = [];
              console.warn("Unexpected response format:", appResponse.data);
            }
            
            // Process application data to standardize status field
            applicationsData = applicationsData.map(app => ({
              ...app,
              // Use application_status if available, fallback to status
              status: app.application_status || app.status || 'Applied'
            }));
            
            applicationsSuccess = true;
          } catch (err) {
            retries++;
            if (err.response && err.response.status === 429) {
              const backoff = (retries * 2000);
              console.log(`Rate limited. Retrying applications in ${backoff/1000}s... (${retries}/${MAX_RETRIES})`);
              await new Promise(resolve => setTimeout(resolve, backoff));
            } else if (retries >= MAX_RETRIES) {
              throw err;
            } else {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
        
        setFetchingApplications(false);
        setApplications(applicationsData);
        setFilteredApplications(applicationsData);
        
        // If applicant is specified in the URL, open the modal for that applicant
        if (applicantId) {
          const selectedApplicant = applicationsData.find(app => app.application_id.toString() === applicantId);
          if (selectedApplicant) {
            setSelectedApplicant(selectedApplicant);
            setIsModalOpen(true);
          }
        }
        
        setLoading(false);
        setRetryCount(0); // Reset retry count on success
        clearTimeout(timeout); // Clear the timeout since we're done
        
      } catch (err) {
        console.error('Error fetching job applications:', err);
        console.error('Error details:', err.response?.data || err.message);
        
        // Handle rate limiting with overall retries
        if (err.response?.status === 429 && retryCount < MAX_RETRIES) {
          const nextRetryCount = retryCount + 1;
          setRetryCount(nextRetryCount);
          
          const backoffTime = nextRetryCount * 2000;
          console.log(`Rate limited. Retrying entire fetch in ${backoffTime/1000}s... (${nextRetryCount}/${MAX_RETRIES})`);
          
          // Clear any existing timeout
          if (retryTimeout) {
            clearTimeout(retryTimeout);
          }
          
          // Set new timeout for retry
          const timeoutId = setTimeout(() => {
            if (mounted) fetchJobApplications();
          }, backoffTime);
          
          setRetryTimeout(timeoutId);
          return;
        }
        
        setError(
          err.response?.status === 429 
            ? `Rate limited. Please try again later.` 
            : err.message === "Network Error" 
              ? "Network error. Please check your connection."
              : err.code === "ECONNABORTED"
                ? "Request timed out. Server might be busy."
                : err.response?.data?.message || 'Failed to fetch applications'
        ); 
        setLoading(false);
        setFetchingJob(false);
        setFetchingApplications(false);
      }
    };

    if (mounted) {
      fetchJobApplications();
      
      return () => {
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
        }
        if (retryTimeout) {
          clearTimeout(retryTimeout);
        }
      };
    }
  }, [jobId, navigate, mounted, applicantId, retryCount]);

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
      (app?.first_name?.toLowerCase() + ' ' + app?.last_name?.toLowerCase()).includes(searchTerm.toLowerCase()) ||
      app?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app?.status === statusFilter);
    }

    // Apply skills filter - match any of the selected skills
    if (skillsFilter.length > 0) {
      filtered = filtered.filter(app => 
        Array.isArray(app.skills) && 
        app.skills.some(skill => 
          skillsFilter.some(selectedSkill => 
            selectedSkill.toLowerCase() === skill.toLowerCase()
          )
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b?.applied_date || 0) - new Date(a?.applied_date || 0);
        case 'oldest':
          return new Date(a?.applied_date || 0) - new Date(b?.applied_date || 0);
        case 'name-asc':
          return (`${a?.first_name} ${a?.last_name}` || '').localeCompare(`${b?.first_name} ${b?.last_name}` || '');
        case 'name-desc':
          return (`${b?.first_name} ${b?.last_name}` || '').localeCompare(`${a?.first_name} ${a?.last_name}` || '');
        default:
          return 0;
      }
    });

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, sortBy, skillsFilter]);

  useEffect(() => {
    // Extract all unique skills from applications
    if (Array.isArray(applications) && applications.length > 0) {
      const allSkills = applications.reduce((skills, app) => {
        if (Array.isArray(app.skills)) {
          return [...skills, ...app.skills];
        }
        return skills;
      }, []);
      
      // Get unique skills and sort alphabetically
      const uniqueSkillsSet = [...new Set(allSkills)].sort();
      setUniqueSkills(uniqueSkillsSet);
    }
  }, [applications]);

  const toggleSkill = (skill) => {
    setSkillsFilter(prevSkills => {
      if (prevSkills.includes(skill)) {
        return prevSkills.filter(s => s !== skill);
      } else {
        return [...prevSkills, skill];
      }
    });
  };

  const clearSkillsFilter = () => {
    setSkillsFilter([]);
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    let retries = 0;
    
    while (retries < MAX_RETRIES) {
      try {
        await axios.patch(`${import.meta.env.VITE_API_URL}/application/add_result/${applicationId}`, {
          status: newStatus
        }, {
          headers: {
            // Authorization: `Bearer ${getToken()}`
          }
        });

        // Update local state
        setApplications(prevApplications => 
          prevApplications.map(app => 
            app.application_id === applicationId ? { ...app, status: newStatus } : app
          )
        );

        // If accepted, create notification
        if (newStatus === 'Accepted') {
          const seekerId = applications.find(app => app.application_id === applicationId)?.seeker_id;
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
        
        return true; // Success
      } catch (err) {
        retries++;
        console.error(`Error updating application status (attempt ${retries}/${MAX_RETRIES}):`, err);
        
        if (err.response?.status === 429) {
          const backoff = (retries * 2000); // Exponential backoff
          console.log(`Rate limited. Retrying status update in ${backoff/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, backoff));
        } else if (retries >= MAX_RETRIES) {
          alert('Failed to update application status after multiple attempts.');
          return false;
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    return false;
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
    setInterviewerName('');
    setInterviewerPhone('');
    setInterviewNotes('');
  };

  const openUpdateInterviewModal = (applicant) => {
    setInterviewToUpdate(applicant);
    // Pre-fill fields if we have interview data
    if (applicant.interview_date) {
      const dateObj = new Date(applicant.interview_date);
      setInterviewDate(dateObj.toISOString().split('T')[0]);
      setInterviewTime(dateObj.toTimeString().substring(0, 5));
    }
    setInterviewMode(applicant.interview_mode || 'online');
    setInterviewLocation(applicant.interview_mode === 'online' ? (applicant.interview_link || '') : (applicant.location || ''));
    setInterviewerName(applicant.interviewer_name || '');
    setInterviewerPhone(applicant.interviewer_phone || '');
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setInterviewToUpdate(null);
    setInterviewDate('');
    setInterviewTime('');
    setInterviewLocation('');
    setInterviewMode('online');
    setInterviewerName('');
    setInterviewerPhone('');
    setInterviewNotes('');
  };

  // Add phone validation function
  const validatePhoneNumber = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const scheduleInterview = async (e) => {
    e.preventDefault();
    
    if (!selectedApplicant || !interviewDate || !interviewTime || !interviewerName || !interviewerPhone) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Validate phone number
    if (!validatePhoneNumber(interviewerPhone)) {
      alert('Phone number must be exactly 10 digits');
      return;
    }

    try {
      setSubmitLoading(true);
      
      // Format date and time for the backend - use RFC3339 format required by Go
      const dateObj = new Date(`${interviewDate}T${interviewTime}:00`);
      const formattedDateTime = dateObj.toISOString(); // ISO8601/RFC3339 format
      
      // Prepare interviewer name and link as pointers as expected by the backend
      const interviewerNameValue = interviewerName || null;
      const interviewLinkValue = interviewMode === 'online' ? interviewLocation : null;
      
      // Single API call to schedule interview and update status
      await axios.post(`${import.meta.env.VITE_API_URL}/interview/schedule_interview`, {
        application_id: selectedApplicant.application_id,
        job_id: jobId,
        seeker_id: selectedApplicant.seeker_id || selectedApplicant.job_seeker_id,
        employer_id: getToken(),
        scheduled_date: formattedDateTime, // RFC3339 format for Go backend
        interview_mode: interviewMode,
        location: interviewMode === 'online' ? null : interviewLocation,
        status: "Scheduled", 
        interviewer_name: interviewerNameValue,
        interviewer_phone: interviewerPhone,
        interview_link: interviewLinkValue,
        update_status: true
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      // Update local state without making another API call
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.application_id === selectedApplicant.application_id 
            ? { ...app, status: 'Interview Scheduled' } 
            : app
        )
      );
      
      setSubmitLoading(false);
      closeModal();
      alert('Interview scheduled successfully!');
      
    } catch (err) {
      console.error('Error scheduling interview:', err);
      console.error('Response data:', err.response?.data);
      setSubmitLoading(false);
      alert(`Failed to schedule interview: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    }
  };

  const updateInterview = async (e) => {
    e.preventDefault();
    
    if (!interviewToUpdate || !interviewDate || !interviewTime || !interviewerName || !interviewerPhone) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Validate phone number
    if (!validatePhoneNumber(interviewerPhone)) {
      alert('Phone number must be exactly 10 digits');
      return;
    }

    try {
      setSubmitLoading(true);
      
      // Format date and time for the backend - use RFC3339 format required by Go
      const dateObj = new Date(`${interviewDate}T${interviewTime}:00`);
      const formattedDateTime = dateObj.toISOString();
      
      // Prepare interviewer name and link as expected by the backend
      const interviewerNameValue = interviewerName || null;
      const interviewLinkValue = interviewMode === 'online' ? interviewLocation : null;
      
      await axios.patch(`${import.meta.env.VITE_API_URL}/interview/update_interview`, {
        application_id: interviewToUpdate.application_id,
        scheduled_date: formattedDateTime,
        interview_mode: interviewMode,
        location: interviewMode === 'online' ? null : interviewLocation,
        status: "Scheduled",
        interviewer_name: interviewerNameValue,
        interview_link: interviewLinkValue,
        interviewer_phone: interviewerPhone
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      // Update local state
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.application_id === interviewToUpdate.application_id
            ? {
                ...app,
                interview_date: formattedDateTime,
                interview_mode: interviewMode,
                location: interviewMode === 'online' ? null : interviewLocation,
                interviewer_name: interviewerNameValue,
                interviewer_phone: interviewerPhone,
                interview_link: interviewLinkValue
              }
            : app
        )
      );
      
      setSubmitLoading(false);
      closeUpdateModal();
      alert('Interview updated successfully!');
      
    } catch (err) {
      console.error('Error updating interview:', err);
      console.error('Response data:', err.response?.data);
      setSubmitLoading(false);
      alert(`Failed to update interview: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    }
  };

  const viewApplicantDetails = (applicant) => {
    setSelectedApplicantDetails(applicant);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedApplicantDetails(null);
    setIsDetailsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-white text-xl font-semibold mb-2">Loading...</div>
        <div className="text-gray-400 text-sm mb-6">
          {fetchingJob ? "Fetching job details..." : 
           fetchingApplications ? "Loading applications..." : "Initializing..."}
        </div>
        <div className="w-64 bg-gray-700 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-500 h-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md w-full">
          <div className="text-red-400 text-lg mb-4 text-center">{error}</div>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                setRetryCount(0);
              }}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              disabled={retryCount > 0}
            >
              {retryCount > 0 ? `Retrying (${retryCount}/${MAX_RETRIES})...` : 'Try Again'}
            </button>
            <button
              onClick={() => navigate('/employer/jobs')}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Return to Jobs
            </button>
          </div>
        </div>
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
        <div className={`mb-8 max-w-4xl mx-auto transform transition-all duration-500 delay-200 
                        ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="relative group mb-4">
            <input
              type="text"
              placeholder="Search applicants by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-800/70 backdrop-blur-md border border-gray-700/50 rounded-xl 
                       text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 
                       focus:ring-2 focus:ring-blue-500/20 transition-all duration-300
                       group-hover:border-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-500/10"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 
                               group-hover:text-blue-400 transition-colors duration-300" />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
            {/* Status Filter */}
            <div className="relative group w-full">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none px-4 py-3 bg-gray-800/70 backdrop-blur-md border border-gray-700/50 
                         rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all duration-300 cursor-pointer
                         group-hover:border-blue-500/30 hover:shadow-sm hover:shadow-blue-500/10"
              >
                <option value="all">All Status</option>
                <option value="Applied">Applied</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
              </select>
              <FaFilter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 
                                 group-hover:text-blue-400 transition-colors duration-300 pointer-events-none" />
            </div>
            
            {/* Sort Options */}
            <div className="relative group w-full">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none px-4 py-3 bg-gray-800/70 backdrop-blur-md border border-gray-700/50 
                         rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all duration-300 cursor-pointer
                         group-hover:border-blue-500/30 hover:shadow-sm hover:shadow-blue-500/10"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
              <FaSort className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 
                               group-hover:text-blue-400 transition-colors duration-300 pointer-events-none" />
            </div>
          </div>
          
          {/* Skills Filter */}
          {uniqueSkills.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap items-center justify-between">
                <label className="block text-gray-300 text-sm mb-2 pl-1 flex items-center font-medium">
                  <FaChartLine className="mr-2 text-blue-400" />
                  Filter by skills:
                  {skillsFilter.length > 0 && (
                    <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{skillsFilter.length} selected</span>
                  )}
                </label>
                <div className="flex">
                  {skillsFilter.length > 0 && (
                    <button 
                      onClick={clearSkillsFilter}
                      className="text-xs text-gray-400 hover:text-white flex items-center mr-2"
                    >
                      <FaTimesCircle className="mr-1" /> Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                  >
                    {showSkillsDropdown ? 'Hide skills' : 'Show all skills'}
                  </button>
                </div>
              </div>
              
              {/* Selected skills tags */}
              {skillsFilter.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 mt-2">
                  {skillsFilter.map((skill, index) => (
                    <span 
                      key={`selected-${index}`} 
                      className="bg-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {skill}
                      <button 
                        onClick={() => toggleSkill(skill)} 
                        className="ml-2 text-blue-300 hover:text-white focus:outline-none"
                      >
                        <FaTimesCircle className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              {/* Skills dropdown/grid - improved with scrollable container */}
              {showSkillsDropdown && (
                <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 mt-2 
                             shadow-lg shadow-blue-900/10 animate-fadeIn">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Select skills to filter ({uniqueSkills.length} available)</span>
                    <span className="text-xs text-gray-500">Showing common skills first</span>
                  </div>
                  
                  {/* Searchable input for skills */}
                  <div className="relative mb-3">
                    <input
                      type="text"
                      placeholder="Search skills..."
                      className="w-full px-3 py-2 pl-8 bg-gray-700/70 border border-gray-600/50 rounded-lg text-white text-sm
                               placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
                      onChange={(e) => {
                        const searchValue = e.target.value.toLowerCase();
                        // Filter skills as user types (implemented in UI only)
                        const skillElements = document.querySelectorAll('.skill-item');
                        skillElements.forEach(el => {
                          const skillText = el.textContent.toLowerCase();
                          if (searchValue === '' || skillText.includes(searchValue)) {
                            el.style.display = 'flex';
                          } else {
                            el.style.display = 'none';
                          }
                        });
                      }}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
                  </div>
                  
                  {/* Scrollable skills container */}
                  <div className="max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {uniqueSkills.map((skill, index) => (
                        <div 
                          key={index} 
                          onClick={() => toggleSkill(skill)}
                          className={`skill-item px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-200 flex items-center
                                    ${skillsFilter.includes(skill) 
                                      ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50' 
                                      : 'bg-gray-700/50 text-gray-300 border border-gray-600/30 hover:bg-gray-700'}`}
                        >
                          <span className="truncate flex-grow">{skill}</span>
                          {skillsFilter.includes(skill) && (
                            <FaCheckCircle className="ml-1 flex-shrink-0 h-3 w-3" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Quick actions footer */}
                  <div className="flex justify-end mt-3 pt-2 border-t border-gray-700/50">
                    <button
                      onClick={() => setShowSkillsDropdown(false)}
                      className="px-3 py-1 text-xs text-gray-300 hover:text-white"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Filter indicators - show active filters */}
          <div className="flex flex-wrap gap-2 mt-3">
            {statusFilter !== 'all' && (
              <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('all')} className="ml-1 text-blue-400 hover:text-white">
                  <FaTimesCircle className="h-3 w-3" />
                </button>
              </div>
            )}
            {(statusFilter !== 'all' || skillsFilter.length > 0) && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setSkillsFilter([]);
                }}
                className="text-gray-400 hover:text-white text-xs underline ml-1"
              >
                Clear all filters
              </button>
            )}
          </div>
          
          {/* Results count */}
          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredApplications.length} of {applications.length} applicants
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
                  key={application.application_id}
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
                            {application.first_name + ' ' + application.last_name || 'Applicant'}
                          </h3>
                          <div className="flex items-center text-sm text-gray-400">
                            <FaCalendarAlt className="mr-1 text-blue-400" />
                            <span>Applied: {new Date(application.applied_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3 mb-5">
                        <div className="flex items-start text-sm">
                          <FaEnvelope className="mt-1 mr-2 text-blue-400" />
                          <span className="text-gray-300">{application.email || 'No email provided'}</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <FaPhone className="mt-1 mr-2 text-blue-400" />
                          <span className="text-gray-300">{application.phone_number || 'No phone provided'}</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <FaGraduationCap className="mt-1 mr-2 text-blue-400" />
                          <span className="text-gray-300">
                            {Array.isArray(application.education) && application.education.length > 0 
                              ? `${application.education[0].level} in ${application.education[0].field_of_study} at ${application.education[0].institution}`
                              : 'No education details'}
                          </span>
                        </div>
                        <div className="flex items-start text-sm">
                          <FaBriefcase className="mt-1 mr-2 text-blue-400" />
                          <span className="text-gray-300">
                            {Array.isArray(application.experience) && application.experience.length > 0
                              ? `${application.experience[0].job_title || application.experience[0].position} at ${application.experience[0].company}`
                              : 'No experience details'}
                          </span>
                        </div>
                        {/* Skills section */}
                        {Array.isArray(application.skills) && application.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {application.skills.slice(0, 3).map((skill, index) => (
                              <span 
                                key={index}
                                className="bg-gray-700/50 text-gray-300 text-xs px-2 py-1 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {application.skills.length > 3 && (
                              <span className="text-gray-400 text-xs">+{application.skills.length - 3} more</span>
                            )}
                          </div>
                        )}
                      </div>
                      {/* View Details Button */}
                      <div className="mb-4">
                        <button
                          onClick={() => viewApplicantDetails(application)}
                          className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg
                                   border border-gray-600/30 hover:bg-gray-700 transition-colors duration-300"
                        >
                          <FaUserAlt className="mr-1" /> View Full Profile
                        </button>
                      </div>
                      {/* Application Actions */}
                      <div className="pt-4 border-t border-gray-700/50">
                        {(application.status === 'Applied' || !application.status) && (
                          <div className="flex flex-col space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleUpdateStatus(application.application_id, 'Accepted')}
                                className="flex items-center justify-center gap-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg
                                         border border-green-500/30 hover:bg-green-500/30 transition-colors duration-300"
                              >
                                <FaCheckCircle /> Accept
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(application.application_id, 'Rejected')}
                                className="flex items-center justify-center gap-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg
                                         border border-red-500/30 hover:bg-red-500/30 transition-colors duration-300"
                              >
                                <FaTimesCircle /> Reject
                              </button>
                            </div>
                            <button
                              onClick={() => openScheduleModal(application)}
                              className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg
                                       border border-blue-500/30 hover:bg-blue-500/30 transition-colors duration-300"
                            >
                              <FaCalendarAlt /> Schedule Interview
                            </button>
                          </div>
                        )}
                        {application.status === 'Accepted' && (
                          <div className="flex items-center justify-center px-4 py-2 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20">
                            <FaCheckCircle className="mr-2" /> Application Accepted
                          </div>
                        )}
                        {application.status === 'Interview Scheduled' && (
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-center px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 mb-2">
                              <FaUserClock className="mr-2" /> Interview Scheduled
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleUpdateStatus(application.application_id, 'Accepted')}
                                className="flex items-center justify-center gap-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg
                                         border border-green-500/30 hover:bg-green-500/30 transition-colors duration-300"
                              >
                                <FaCheckCircle /> Accept
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(application.application_id, 'Rejected')}
                                className="flex items-center justify-center gap-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg
                                         border border-red-500/30 hover:bg-red-500/30 transition-colors duration-300"
                              >
                                <FaTimesCircle /> Reject
                              </button>
                            </div>
                            <button
                              onClick={() => openUpdateInterviewModal(application)}
                              className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg
                                       border border-blue-500/30 hover:bg-blue-500/30 transition-colors duration-300"
                            >
                              <FaCalendarAlt /> Update Interview
                            </button>
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
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md p-6 animate-scaleIn modal-content">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-400" />
              Schedule Interview
            </h2>
            
            <div className="mb-4">
              <p className="text-gray-300">Applicant: <span className="text-white">
                {selectedApplicant ? `${selectedApplicant.first_name} ${selectedApplicant.last_name}` : ''}
              </span></p>
              <p className="text-gray-300">Job: <span className="text-white">{jobDetails?.job_title}</span></p>
            </div>
            <form onSubmit={scheduleInterview}>
              <div className="space-y-4">
                {/* Interviewer Information */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Interviewer Name*</label>
                  <input
                    type="text"
                    required
                    value={interviewerName}
                    onChange={(e) => setInterviewerName(e.target.value)}
                    placeholder="Name of the interviewer"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Interviewer Phone*</label>
                  <input
                    type="tel"
                    required
                    value={interviewerPhone}
                    onChange={(e) => {
                      // Only allow digits and limit to 10 characters
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setInterviewerPhone(value);
                    }}
                    placeholder="10-digit phone number"
                    className={`w-full px-4 py-2 bg-gray-700 border ${
                      interviewerPhone && !validatePhoneNumber(interviewerPhone) 
                      ? 'border-red-500' 
                      : 'border-gray-600'
                    } rounded-lg text-white focus:outline-none focus:border-blue-500`}
                    pattern="\d{10}"
                    title="Please enter exactly 10 digits"
                  />
                  {interviewerPhone && !validatePhoneNumber(interviewerPhone) && (
                    <p className="text-red-500 text-xs mt-1">Phone number must be exactly 10 digits</p>
                  )}
                </div>
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
                  <label className="block text-gray-300 text-sm font-medium mb-1">Interview Mode*</label>
                  <select
                    value={interviewMode}
                    onChange={(e) => setInterviewMode(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">
                    {interviewMode === 'online' ? 'Meeting Link*' : 'Location*'}
                  </label>
                  <input
                    type="text"
                    required
                    value={interviewLocation}
                    onChange={(e) => setInterviewLocation(e.target.value)}
                    placeholder={interviewMode === 'online' ? 'Zoom/Teams/Meet link' : 'Office address'}
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
      {/* Interview Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md p-6 animate-scaleIn modal-content">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-400" />
              Update Interview
            </h2>
            
            <div className="mb-4">
              <p className="text-gray-300">Applicant: <span className="text-white">
                {interviewToUpdate ? `${interviewToUpdate.first_name} ${interviewToUpdate.last_name}` : ''}
              </span></p>
              <p className="text-gray-300">Job: <span className="text-white">{jobDetails?.job_title}</span></p>
            </div>
            <form onSubmit={updateInterview}>
              <div className="space-y-4">
                {/* Interviewer Information */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Interviewer Name*</label>
                  <input
                    type="text"
                    required
                    value={interviewerName}
                    onChange={(e) => setInterviewerName(e.target.value)}
                    placeholder="Name of the interviewer"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Interviewer Phone*</label>
                  <input
                    type="tel"
                    required
                    value={interviewerPhone}
                    onChange={(e) => {
                      // Only allow digits and limit to 10 characters
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setInterviewerPhone(value);
                    }}
                    placeholder="10-digit phone number"
                    className={`w-full px-4 py-2 bg-gray-700 border ${
                      interviewerPhone && !validatePhoneNumber(interviewerPhone) 
                      ? 'border-red-500' 
                      : 'border-gray-600'
                    } rounded-lg text-white focus:outline-none focus:border-blue-500`}
                    pattern="\d{10}"
                    title="Please enter exactly 10 digits"
                  />
                  {interviewerPhone && !validatePhoneNumber(interviewerPhone) && (
                    <p className="text-red-500 text-xs mt-1">Phone number must be exactly 10 digits</p>
                  )}
                </div>
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
                  <label className="block text-gray-300 text-sm font-medium mb-1">Interview Mode*</label>
                  <select
                    value={interviewMode}
                    onChange={(e) => setInterviewMode(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">
                    {interviewMode === 'online' ? 'Meeting Link*' : 'Location*'}
                  </label>
                  <input
                    type="text"
                    required
                    value={interviewLocation}
                    onChange={(e) => setInterviewLocation(e.target.value)}
                    placeholder={interviewMode === 'online' ? 'Zoom/Teams/Meet link' : 'Office address'}
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
                  onClick={closeUpdateModal}
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaCalendarAlt /> Update Interview
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Applicant Details Modal */}
      {isDetailsModalOpen && selectedApplicantDetails && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-3xl p-6 animate-scaleIn my-8 modal-content">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaUserAlt className="text-blue-400" />
                Applicant Profile
              </h2>
              <button 
                onClick={closeDetailsModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Applicant Header */}
            <div className="flex items-center mb-6 pb-6 border-b border-gray-700">
              <div className="h-16 w-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                <FaUserAlt className="text-blue-400 text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-white">
                  {selectedApplicantDetails.first_name} {selectedApplicantDetails.last_name}
                </h3>
                <div className="flex items-center gap-4 text-gray-400 mt-1">
                  <span className="flex items-center">
                    <FaEnvelope className="mr-1" /> {selectedApplicantDetails.email}
                  </span>
                  <span className="flex items-center">
                    <FaPhone className="mr-1" /> {selectedApplicantDetails.phone_number || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            {/* Cover Letter */}
            {selectedApplicantDetails.cover_letter && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                  <FaFileAlt className="mr-2 text-blue-400" />
                  Cover Letter
                </h4>
                <div className="bg-gray-900/50 p-4 rounded-lg text-gray-300 text-sm">
                  {selectedApplicantDetails.cover_letter}
                </div>
              </div>
            )}
            {/* Education */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                <FaGraduationCap className="mr-2 text-blue-400" />
                Education
              </h4>
              {Array.isArray(selectedApplicantDetails.education) && selectedApplicantDetails.education.length > 0 ? (
                <div className="space-y-3">
                  {selectedApplicantDetails.education.map((edu, idx) => (
                    <div key={idx} className="bg-gray-900/50 p-4 rounded-lg">
                      <div className="flex justify-between">
                        <h5 className="text-white font-medium">{edu.level}</h5>
                        <span className="text-gray-400 text-sm">
                          {edu.start_year} - {edu.end_year || 'Present'}
                        </span>
                      </div>
                      <p className="text-gray-300 mt-1">{edu.field_of_study}</p>
                      <p className="text-gray-400 text-sm mt-1">{edu.institution}</p>
                      {edu.grade && <p className="text-gray-400 text-sm mt-1">Grade: {edu.grade}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No education details provided</p>
              )}
            </div>
            {/* Work Experience */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                <FaBriefcase className="mr-2 text-blue-400" />
                Work Experience
              </h4>
              {Array.isArray(selectedApplicantDetails.experience) && selectedApplicantDetails.experience.length > 0 ? (
                <div className="space-y-3">
                  {selectedApplicantDetails.experience.map((exp, idx) => (
                    <div key={idx} className="bg-gray-900/50 p-4 rounded-lg">
                      <div className="flex justify-between">
                        <h5 className="text-white font-medium">{exp.job_title || exp.position}</h5>
                        <span className="text-gray-400 text-sm">
                          {new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}
                        </span>
                      </div>
                      <p className="text-gray-300 mt-1">{exp.company}</p>
                      <p className="text-gray-400 text-sm mt-1">{exp.location}</p>
                      {exp.description && <p className="text-gray-400 text-sm mt-1">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No experience details provided</p>
              )}
            </div>
            {/* Skills */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                <FaChartLine className="mr-2 text-blue-400" />
                Skills
              </h4>
              {Array.isArray(selectedApplicantDetails.skills) && selectedApplicantDetails.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedApplicantDetails.skills.map((skill, idx) => (
                    <span key={idx} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No skills listed</p>
              )}
            </div>
            {/* Application Status */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-white flex items-center">
                  <FaUserClock className="mr-2 text-blue-400" />
                  Application Status
                </h4>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  selectedApplicantDetails.status === 'Accepted' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  selectedApplicantDetails.status === 'Rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  selectedApplicantDetails.status === 'Interview Scheduled' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {selectedApplicantDetails.status || 'Applied'}
                </span>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4">
                {(selectedApplicantDetails.status === 'Applied' || !selectedApplicantDetails.status) && (
                  <>
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedApplicantDetails.application_id, 'Accepted');
                        closeDetailsModal();
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg
                              border border-green-500/30 hover:bg-green-500/30 transition-colors"
                    >
                      <FaCheckCircle className="mr-1" /> Accept Application
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedApplicantDetails.application_id, 'Rejected');
                        closeDetailsModal();
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg
                              border border-red-500/30 hover:bg-red-500/30 transition-colors"
                    >
                      <FaTimesCircle className="mr-1" /> Reject Application
                    </button>
                    <button
                      onClick={() => {
                        closeDetailsModal();
                        openScheduleModal(selectedApplicantDetails);
                      }}
                      className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg
                              border border-blue-500/30 hover:bg-blue-500/30 transition-colors mt-2"
                    >
                      <FaCalendarAlt className="mr-1" /> Schedule Interview
                    </button>
                  </>
                )}
                {selectedApplicantDetails.status === 'Accepted' && (
                  <button
                    onClick={closeDetailsModal}
                    className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg
                            hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                )}
                {selectedApplicantDetails.status === 'Interview Scheduled' && (
                  <>
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedApplicantDetails.application_id, 'Accepted');
                        closeDetailsModal();
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg
                              border border-green-500/30 hover:bg-green-500/30 transition-colors"
                    >
                      <FaCheckCircle className="mr-1" /> Accept Application
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedApplicantDetails.application_id, 'Rejected');
                        closeDetailsModal();
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg
                              border border-red-500/30 hover:bg-red-500/30 transition-colors"
                    >
                      <FaTimesCircle className="mr-1" /> Reject Application
                    </button>
                    <button
                      onClick={() => {
                        closeDetailsModal();
                        openUpdateInterviewModal(selectedApplicantDetails);
                      }}
                      className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg
                              border border-blue-500/30 hover:bg-blue-500/30 transition-colors mt-2"
                    >
                      <FaCalendarAlt className="mr-1" /> Update Interview
                    </button>
                    <button
                      onClick={closeDetailsModal}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Close
                    </button>
                  </>
                )}
                {selectedApplicantDetails.status === 'Rejected' && (
                  <button
                    onClick={closeDetailsModal}
                    className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg
                            hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        /* Custom scrollbar styles */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.3) rgba(17, 24, 39, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(17, 24, 39, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Schedule;
