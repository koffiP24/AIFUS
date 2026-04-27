import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ParticipantRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="py-8 text-center">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ParticipantRoute;
