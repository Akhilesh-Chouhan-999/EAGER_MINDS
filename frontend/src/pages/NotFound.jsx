import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
    }} className="fade-in">
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '40px',
      }}>
        <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '16px' }} className="gradient-text">
          404
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Profile or Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.6' }}>
          The link vault profile you are trying to visit does not exist, or this URL is invalid.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </main>
  )
}
