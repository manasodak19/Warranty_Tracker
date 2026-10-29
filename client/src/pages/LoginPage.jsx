import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../services/api.js';

export default function LoginPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  function updateField(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      setUser(data.user);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="brand auth-brand" to="/">Warranty Tracker</Link>
        <h1>Welcome back</h1>
        <p className="muted">Log in to manage your warranties.</p>
        <form className="stacked-form" onSubmit={handleSubmit}>
          <label>Email
            <input autoComplete="email" name="email" onChange={updateField} required type="email" value={values.email} />
          </label>
          <label>Password
            <input autoComplete="current-password" name="password" onChange={updateField} required type="password" value={values.password} />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary button-full" disabled={loading} type="submit">{loading ? 'Logging in…' : 'Login'}</button>
        </form>
        <p className="auth-switch">New to Warranty Tracker? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  );
}
