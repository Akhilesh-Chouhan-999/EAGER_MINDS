import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiFetch } from '../config/api'
import NotFound from './NotFound'

export default function Profile() {
  const { handle } = useParams()
  const [profile, setProfile] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [prevHandle, setPrevHandle] = useState(handle)
  if (handle !== prevHandle) {
    setPrevHandle(handle)
    setLoading(true)
    setNotFound(false)
  }

  useEffect(() => {
    apiFetch(`/api/profiles/${handle}`)
      .then((data) => {
        setProfile(data.profile)
        setBookmarks(data.bookmarks)
      })
      .catch((err) => {
        console.error(err)
        setNotFound(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [handle])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading profile...</p>
      </div>
    )
  }

  if (notFound) {
    return <NotFound />
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      
      {/* Profile Header */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        textAlign: 'center',
        marginBottom: '40px',
      }} className="fade-in">
        {/* Avatar badge */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--accent-gradient)',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          fontWeight: 800,
          color: 'white',
          boxShadow: 'var(--accent-glow)',
        }}>
          {profile?.handle?.substring(0, 2).toUpperCase()}
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
          @{profile?.handle}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Welcome to my shared link vault
        </p>
      </div>

      {/* Bookmarks container */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }} className="fade-in">
        {!bookmarks || bookmarks.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>No public bookmarks shared yet.</p>
          </div>
        ) : (
          bookmarks.map((bookmark) => (
            <a 
              key={bookmark.id}
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel"
              style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                {/* Website Favicon */}
                <img 
                  src={bookmark.favicon_url || `https://www.google.com/s2/favicons?domain=${(() => {
                    try { return new URL(bookmark.url).hostname } catch { return '' }
                  })()}&sz=32`} 
                  alt="" 
                  onError={(e) => { e.target.style.display = 'none' }}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '3px',
                    border: '1px solid var(--border-color)',
                    marginTop: '2px',
                    flexShrink: 0
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {bookmark.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {bookmark.url.replace(/^https?:\/\/(www\.)?/, '')}
                  </p>
                  {bookmark.description && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                      {bookmark.description}
                    </p>
                  )}
                </div>
              </div>

              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </a>
          ))
        )}
      </div>

      {/* Footer Link */}
      <div style={{ marginTop: '60px', textAlign: 'center' }}>
        <Link to="/" style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: 600,
        }}>
          Powered by <span className="gradient-text" style={{ fontWeight: 800 }}>Bookmark Hub</span>
        </Link>
      </div>

    </div>
  )
}
