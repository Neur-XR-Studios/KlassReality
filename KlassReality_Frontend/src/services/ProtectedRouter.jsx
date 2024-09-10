import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
export const ProtectedRoutes = () => {
  const adminToken = useSelector((state) => state.admin.accessToken);
  let auth = { token: adminToken };
  return auth.token ? <Outlet /> : <Navigate to="/login" />;
};
