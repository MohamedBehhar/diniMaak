import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  if (token !== "undefined" && token !== null) {
    return <Outlet />;
  }

  return <Navigate to="/login" state={{ from: location }} />;
};

export default ProtectedRoutes;
