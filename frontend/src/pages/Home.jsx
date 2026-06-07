import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SearchProfile from '../components/SearchProfile'
import { apiFetch } from '../config/api'

export default function Home() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token')
    }
    return false
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    apiFetch('/api/auth/me')
      .then((data) => {
        setUser(data.user)
        setProfile(data.profile)
      })
      .catch((err) => {
        console.error('Failed to verify token:', err)
        localStorage.removeItem('token')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header style={{
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(8, 11, 17, 0.5)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <Link to="/" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          <span className="gradient-text">Bookmark Hub</span>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {loading ? (
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Loading...</span>
          ) : user ? (
            <>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                Hi, <strong style={{ color: 'var(--text-primary)' }}>@{profile?.handle || 'user'}</strong>
              </span>
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Log In
              </Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem', width: 'auto' }}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Body */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
      }} className="fade-in">
        <div className="glass-panel" style={{
          padding: '8px 16px',
          borderRadius: '50px',
          fontSize: '0.85rem',
          color: 'var(--accent-indigo)',
          fontWeight: 600,
          border: '1px solid rgba(99, 102, 241, 0.2)',
          marginBottom: '24px',
          display: 'inline-block',
        }}>
          ✨ A Minimalist &ldquo;Linktree meets Pocket&rdquo; App
        </div>

        <h1 style={{
          fontSize: '3.5rem',
          lineHeight: '1.1',
          marginBottom: '20px',
          fontWeight: 900,
        }}>
          Organize & Share Your <br/>
          <span className="gradient-text">Digital Bookmarks</span>
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.2rem',
          maxWidth: '600px',
          marginBottom: '40px',
          lineHeight: '1.6',
        }}>
          Save your links, tag them as public or private, and claim a personalized public profile to share your best finds with the world.
        </p>

        {/* Search Input Widget */}
        <div style={{ width: '100%', maxWidth: '500px', marginBottom: '60px' }}>
          <SearchProfile />
        </div>

        {/* Mock bookmark cards demo */}
        <div className="glass-panel" style={{
          width: '100%',
          maxWidth: '550px',
          padding: '24px',
          textAlign: 'left',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', opacity: 0.5 }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', opacity: 0.5 }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', opacity: 0.5 }}></span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>demo_preview</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Next.js Documentation</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>nextjs.org/docs</p>
              </div>
              <span style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                Public
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.8 }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Supabase Dashboard</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>supabase.com/dashboard</p>
              </div>
              <span style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '20px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                Private
              </span>
            </div>
          </div>
        </div>
      </main>

      <footer style={{
        padding: '30px 20px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
      }}>
        &copy; {new Date().getFullYear()} Bookmark Hub. Powered by Express & Supabase.
      </footer>
    </div>
  )
}
