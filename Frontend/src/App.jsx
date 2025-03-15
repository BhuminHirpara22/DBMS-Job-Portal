import { Home } from "./components/home/Home";
import { Role } from "./components/home/Role";
import { Login } from "./components/login/Login";
import { JobSeekerSignup } from "./components/signup/JSignup";
import { EmployerSignup } from "./components/signup/ESignup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup/jobseeker",
    element: <JobSeekerSignup />,
  },
  {
    path: "/signup/employer",
    element: <EmployerSignup />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
