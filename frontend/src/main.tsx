import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/CreateAccount.tsx";
import "./index.css";
import ProtectedRoutes from "./utils/ProtectedRoutes.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import CreatCarPooling from "./pages/CreatCarPooling.tsx";
import CarpoolingDetails from "./pages/CarpoolingDetails.tsx";
import CarpoolingHistory from "./pages/CarpoolingHistory.tsx";
import CarpoolingRequests from "./pages/CarpoolingRequests.tsx";
import AvailableCarpooling from "./pages/AvailableCarpooling.tsx";
import ManageYourCarpooling from "./pages/ManageYourCarpooling.tsx";
import Profile from "./pages/Profile.tsx";
import User from "./pages/User.tsx";
import Notifications from "./pages/Notifications.tsx";
import Chat from "./pages/Chat.tsx";
import Conversations from "./pages/Conversations.tsx";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },

  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/profile/:user_id",
        element: <Profile />,
      },
      {
        path: '/user/:user_id',
        element: <User />
      },
      {
        path: "/chat/:sender_id/:receiver_id/:carpooling_id",
        element: <Chat />,
      },
      {
        path: '/conversations/:user_id',
        element: <Conversations />
      },
      {
        path: "/notifications/:user_id",
        element: <Notifications />,
      }
    ],
  },
  {
    path: "/post-carpooling",
    element: <ProtectedRoutes />,
    children: [{ path: "/post-carpooling", element: <CreatCarPooling /> }],
  },
  {
    path: "/carpooling-details",
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/carpooling-details/:carpooling_id",
        element: <CarpoolingDetails />,
      },
    ],
  },
  {
    path: "/carpooling",
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/carpooling/history/:user_id",
        element: <CarpoolingHistory />,
      },
      {
        path: "/carpooling/published-carpooling/:user_id",
        element: <ManageYourCarpooling />,
      },
      {
        path: "/carpooling/requests/:user_id",
        element: <CarpoolingRequests />,
      },
      {
        path: "/carpooling/",
        element: <CarpoolingRequests />,
      },
      {
        path: "/carpooling/search",
        element: <AvailableCarpooling />,
      },
    ],
  },

  {
    path: "*",
    element: <div>Not Found</div>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
