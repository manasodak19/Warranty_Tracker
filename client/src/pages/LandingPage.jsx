import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav.jsx';

const previewRows = [
  { name: 'Laptop', brand: 'Acer', expiry: 'Aug 18, 2027', status: 'Active' },
  { name: 'Headphones', brand: 'Sony', expiry: 'Nov 12, 2026', status: 'Expiring Soon' },
  { name: 'Monitor', brand: 'Dell', expiry: 'Jun 02, 2026', status: 'Active' },
];

export default function LandingPage() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="hero page-shell">
          <div className="hero-copy">
            <p className="eyebrow">Keep every purchase covered</p>
            <h1>Never Miss a Warranty Expiry Again.</h1>
            <p className="hero-description">
              Store your product details in one place, calculate warranty end dates, and see what needs your attention.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/register">Get Started</Link>
              <Link className="button button-outline" to="/login">Login</Link>
            </div>
          </div>
          <div className="preview-card" aria-label="Sample warranty dashboard preview">
            <div className="preview-top">
              <div><span className="preview-caption">Your warranties</span><strong>Product overview</strong></div>
              <span className="preview-count">3 products</span>
            </div>
            <div className="preview-stats">
              <div><span>Total products</span><strong>3</strong></div>
              <div><span>Expiring soon</span><strong>1</strong></div>
            </div>
            <div className="preview-list">
              {previewRows.map((row) => (
                <div className="preview-row" key={row.name}>
                  <div><strong>{row.name}</strong><span>{row.brand} · {row.expiry}</span></div>
                  <span className={`status status-${row.status.toLowerCase().replace(' ', '-')}`}>{row.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="page-shell">
            <div className="section-heading">
              <p className="eyebrow">Everything in one place</p>
              <h2>Warranty tracking, made straightforward.</h2>
            </div>
            <div className="feature-grid">
              <article className="feature-card">
                <h3>Product Management</h3>
                <p>Save product names, purchase dates, warranty durations, and notes in your account.</p>
              </article>
              <article className="feature-card">
                <h3>Expiry Tracking</h3>
                <p>See calculated expiry dates and quickly identify warranties nearing their end.</p>
              </article>
              <article className="feature-card">
                <h3>Warranty Overview</h3>
                <p>Review your product list and current warranty status from one simple dashboard.</p>
              </article>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="page-shell footer-inner">
          <span>Warranty Tracker</span>
          <span>Keep track. Stay covered.</span>
        </div>
      </footer>
    </>
  );
}
