import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../config/api'
import BookmarkManager from '../components/BookmarkManager'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { user, profile, loading: authLoading, logout } = useAuth()
  const [bookmarks, setBookmarks] = useState([])
  const [loadingBookmarks, setLoadingBookmarks] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    if (authLoading) return
    if (!profile) { navigate('/login'); return }

    apiFetch('/api/bookmarks')
      .then((res) => {
        const data = Array.isArray(res) ? res : res.data || []
        setBookmarks(data)
        setError(null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingBookmarks(false))
  }, [profile, authLoading, navigate])

  const refreshBookmarks = () => {
    apiFetch('/api/bookmarks')
      .then((res) => {
        const data = Array.isArray(res) ? res : res.data || []
        setBookmarks(data)
        setError(null)
      })
      .catch((err) => setError(err.message))
  }

  if (authLoading || loadingBookmarks) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Loading your vault..." />
      </div>
    )
  }

  const publicCount = bookmarks.filter(b => b.is_public).length
  const privateCount = bookmarks.filter(b => !b.is_public).length

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <header style={{
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(10, 14, 23, 0.7)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          <span className="gradient-text">EagerMinds</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {profile && (
            <Link
              to={`/${profile.handle}`}
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              @{profile.handle}
            </Link>
          )}
          <button
            onClick={() => logout(navigate)}
            className="btn btn-secondary"
            style={{ padding: '7px 16px', fontSize: '0.85rem', width: 'auto' }}
          >
            Log Out
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '40px 20px' }} className="fade-in">

        {/* Welcome bar */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>
            Welcome back{profile?.handle ? `, ` : ''}<span className="gradient-text">@{profile?.handle}</span> 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage, organise and share your bookmarks from your personal vault.
          </p>
        </div>

        {/* ── Stats Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          {[
            {
              label: 'Total Bookmarks',
              value: bookmarks.length,
              icon: (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              ),
              color: '#6366f1',
            },
            {
              label: 'Public',
              value: publicCount,
              icon: (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              ),
              color: '#10b981',
            },
            {
              label: 'Private',
              value: privateCount,
              icon: (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ),
              color: '#f59e0b',
            },
            {
              label: 'Your Handle',
              value: `@${profile?.handle || '…'}`,
              icon: (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ),
              color: '#a855f7',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-panel"
              style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div style={{
                width: '42px', height: '42px', borderRadius: '10px',
                background: `${stat.color}18`, border: `1px solid ${stat.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: stat.color,
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '24px' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* ── Bookmark Manager — always visible ── */}
        <BookmarkManager
          bookmarks={bookmarks}
          onMutation={refreshBookmarks}
        />
      </main>
    </div>
  )
}
