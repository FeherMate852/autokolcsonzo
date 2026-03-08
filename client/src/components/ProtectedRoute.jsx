import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, reverse = false }) => {
  const token = localStorage.getItem("token");

  if (reverse) {
    return token ? <Navigate to="/" replace /> : children;
  }

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
