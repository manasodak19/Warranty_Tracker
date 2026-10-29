import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../services/api.js';

export default function SiteNav({ dashboard = false }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Unable to log out:', error);
    }
  }

  if (dashboard) {
    return (
      <header className="topbar">
        <div className="topbar-inner">
          <Link className="brand" to="/">Warranty Tracker</Link>
          <div className="nav-actions">
            <span className="nav-user">{user?.name}</span>
            <button className="button button-outline button-small" onClick={handleLogout} type="button">Log out</button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="brand" to="/">Warranty Tracker</Link>
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <a href="/#features">Features</a>
          {user ? <Link to="/dashboard">Dashboard</Link> : <Link to="/login">Login</Link>}
          {user
            ? <button className="nav-link-button" onClick={handleLogout} type="button">Log out</button>
            : <Link className="button button-primary button-small" to="/register">Get Started</Link>}
        </nav>
      </div>
    </header>
  );
}
