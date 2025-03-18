import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout/Layout"; // ✅ Wrapper for Navbar & BottomNav
import { Home } from "./components/home/Home";
import { Role } from "./components/home/Role";
import { Login } from "./components/login/Login";
import { JobSeekerSignup } from "./components/signup/JSignup";
import { EmployerSignup } from "./components/signup/ESignup";
import Mainpage from "./components/mainpage/mainpage";
import NotFound from "./components/NotFound/notfound";
import JobListings from "./components/jobListing/JobListings";
import Apply from "./components/Apply/apply";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // ✅ Wrap all routes inside Layout
    children: [
      { path: "/", element: <Home /> },
      { path: "/role", element: <Role /> },
      { path: "/login", element: <Login /> },
      { path: "/signup/jobseeker", element: <JobSeekerSignup /> },
      { path: "/signup/employer", element: <EmployerSignup /> },
      { path: "/mainpage", element: <Mainpage /> },
      { path: "/jobs", element: <JobListings /> },
      { path: "/apply/:jobId", element: <Apply /> },
      { path: "*", element: <NotFound /> }, // 404 Page
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
