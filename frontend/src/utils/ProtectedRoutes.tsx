import { Navigate, Outlet } from "react-router-dom";
import Layout from "../components/Layout";

const ProtectedRoutes = () => {
  // TODO: Use authentication token
  const localStorageToken = localStorage.getItem("token");
  if (localStorageToken) {
    return (
        <Layout>
          <Outlet />
        </Layout>
    );
  }
  return <Navigate to="/login" />;
};

export default ProtectedRoutes;
