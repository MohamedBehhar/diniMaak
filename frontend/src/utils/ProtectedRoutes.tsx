import { Navigate, Outlet, useLocation } from "react-router-dom";
import Layout from "../components/Layout";

const ProtectedRoutes = () => {
  const location = useLocation();
  const localStorageToken = localStorage.getItem("token");

  if (localStorageToken) {
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  }

  return <Navigate to="/login" state={{ from: location }} />;
};

export default ProtectedRoutes;
