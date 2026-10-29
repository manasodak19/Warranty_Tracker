import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../services/api.js';

export default function RegisterPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
    if (values.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
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
        <h1>Create your account</h1>
        <p className="muted">Start keeping your product warranties organized.</p>
        <form className="stacked-form" onSubmit={handleSubmit}>
          <label>Full name
            <input autoComplete="name" name="name" onChange={updateField} required maxLength="100" value={values.name} />
          </label>
          <label>Email
            <input autoComplete="email" name="email" onChange={updateField} required type="email" value={values.email} />
          </label>
          <label>Password
            <input autoComplete="new-password" name="password" onChange={updateField} required minLength="8" maxLength="128" type="password" value={values.password} />
          </label>
          <label>Confirm password
            <input autoComplete="new-password" name="confirmPassword" onChange={updateField} required minLength="8" maxLength="128" type="password" value={values.confirmPassword} />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary button-full" disabled={loading} type="submit">{loading ? 'Creating account…' : 'Create account'}</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
      </section>
    </main>
  );
}
