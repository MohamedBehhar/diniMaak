import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";
import "./index.css";
import ProtectedRoutes from "./utils/ProtectedRoutes.tsx";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: '/signup', element: <SignUp /> },
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [{ path: "/", element: <Home /> }],
  },

]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
