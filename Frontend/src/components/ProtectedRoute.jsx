import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, getUserRole } from "../../tokenUtils";

const ProtectedRoute = ({ component: Component }) => {
  const token = getToken();
  const role = getUserRole();
  
  if (!token) {
    // Not logged in, redirect to the home page
    return <Navigate to="/" replace />;
  }

  // Check for correct role-based access
  const path = window.location.pathname;
  
  // Employer routes should only be accessible by employers
  if (path.startsWith("/employer") && !role?.includes("employer")) {
    return <Navigate to="/mainpage" replace />;
  }
  
  // Job seeker routes should only be accessible by job seekers
  if ((path.startsWith("/jobs") || 
       path.startsWith("/applied-jobs") || 
       path.startsWith("/job-status") ||
       path.startsWith("/interviews") ||
       path.startsWith("/ats-checker") ||
       path.startsWith("/jobseeker") ||
       path === "/mainpage") && // Added mainpage as a job seeker specific route
      !role?.includes("JobSeeker")) {
    return <Navigate to="/employer/dashboard" replace />;
  }

  // If we have proper authorization, render the requested component
  return <Component />;
};

export default ProtectedRoute;
