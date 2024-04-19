import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";
import "./index.css";
import ProtectedRoutes from "./utils/ProtectedRoutes.tsx";
import { Provider } from "react-redux";
import {store} from "./store/store.ts";
import CreatCarPooling from "./pages/CreatCarPooling.tsx";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [{ path: "/", element: <Home /> }],
  },
  {
    path: "/carpooling",
    element: <ProtectedRoutes />,
    children: [{ path: "/carpooling", element: <CreatCarPooling /> }],
  },
  {
    path: "*",
    element: <div>Not Found</div>,  
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
