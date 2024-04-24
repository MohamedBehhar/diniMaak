
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  // TODO: Use authentication token
  const localStorageToken = localStorage.getItem("token");
  if (localStorageToken) {
    return <Outlet />;
  }
  return <Navigate to="/login" />;
};

export default ProtectedRoutes;
