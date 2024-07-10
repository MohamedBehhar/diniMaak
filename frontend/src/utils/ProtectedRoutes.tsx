import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (token) {
    return <Outlet />;
  }

  return <Navigate to="/login" state={{ from: location }} />;
};

export default ProtectedRoutes;
