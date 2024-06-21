import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const ProtectedRoutes = () => {
  const userInfo = useSelector((state: RootState) => state.user.user);

  const location = useLocation();

  if (userInfo.isAuth) {
    return (
        <Outlet />
    );
  }

  return <Navigate to="/login" state={{ from: location }} />;
};

export default ProtectedRoutes;
