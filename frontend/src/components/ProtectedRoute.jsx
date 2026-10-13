import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
