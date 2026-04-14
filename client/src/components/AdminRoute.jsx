import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="text-center py-8">Chargement...</div>;
  
  return user && user.role === 'ADMIN' ? children : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;