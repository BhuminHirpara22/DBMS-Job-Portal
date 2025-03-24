import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { Home } from "./components/home/Home";
import { Role } from "./components/home/Role";
import { LoginE } from "./components/login/LoginE";
import { LoginJ } from "./components/login/LoginJ";
import { JobSeekerSignup } from "./components/signup/JSignup";
import { EmployerSignup } from "./components/signup/ESignup";
import Mainpage from "./components/mainpage/mainpage";
import JobListings from "./components/jobListing/JobListings";
import Apply from "./components/Apply/apply";
import NotFound from "./components/NotFound/notfound";
import Layout from "./components/layout/Layout"; //  Wrap protected pages inside Layout
import EmployerDashboard from "./components/EmployerDashboard/employerDashboard";
import PostJob from "./components/PostJob/postJob";
import EmployerJob from "./components/EmployerJobDetails/EmployerJobDetails";
import EditJob from "./components/EditJob/editJob";
import Logout from "./components/Logout/Logout";
import EmployerProfile from "./components/Profile/EmployerProfile";
import JobSeekerProfile from "./components/Profile/JobSeekerProfile";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/role",
    element: <Role />,
  },
  {
    path: "/login/jobseeker",
    element: <LoginJ />,
  },
  {
    path: "/login/employer",
    element: <LoginE />,
  },
  {
    path: "/signup/jobseeker",
    element: <JobSeekerSignup />,
  },
  {
    path: "/signup/employer",
    element: <EmployerSignup />,
  },
  {
    path: "/",
    element: <Layout />, //  Only show Navbar & BottomNav after login
    children: [
      {
        path: "/mainpage",
        element: <ProtectedRoute component={Mainpage} />,
        // element: <Mainpage />,
      },
      {
        path: "/jobs",
        element: <ProtectedRoute component={JobListings} />,
        // element: <JobListings />,
      },
      {
        path: "/apply/:jobId",
        element: <ProtectedRoute component={Apply} />,
        // element: <Apply />,
      },
      {
        path: "/employer/dashboard",
        element: <ProtectedRoute component={EmployerDashboard} />,
      },
      {
        path: "/employer/postjob",
        element: <ProtectedRoute component={PostJob} />,
      },
      {
        path: "/employer/job/:id",
        element: <ProtectedRoute component={EmployerJob} />,
      },
      {
        path: "/employer/job/:id/edit",
        element: <ProtectedRoute component={EditJob} />,
      },
      {
        path: "/logout",
        element: <ProtectedRoute component={Logout} />,
      },
      {
        path: "/employer/profile",
        element: <ProtectedRoute component={EmployerProfile} />,
      },
      {
        path: "/jobseeker/profile",
        element: <ProtectedRoute component={JobSeekerProfile} />,
      },     

    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
