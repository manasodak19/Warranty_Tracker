import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <main className="page-shell"><p className="muted" role="status">Checking your session…</p></main>;
  }
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
