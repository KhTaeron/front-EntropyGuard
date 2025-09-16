import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  // if authenticated -> ok , if not : redirect to login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
