import { Navigate } from 'react-router-dom';
import { UserSession } from '../../services/api';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = UserSession.isLoggedIn();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}; 