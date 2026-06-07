import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../config/api'
import BookmarkManager from '../components/BookmarkManager'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { profile, loading: authLoading, logout } = useAuth()
  const [bookmarks, setBookmarks] = useState([])
  const [loadingBookmarks, setLoadingBookmarks] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    if (authLoading) return

    if (!profile) {
      navigate('/login')
      return
    }

    const fetchBookmarks = async () => {
      try {
        const response = await apiFetch('/api/bookmarks?limit=50')
        // Handle both array and paginated response formats
        const bookmarksData = Array.isArray(response) ? response : response.data || []
        setBookmarks(bookmarksData)
        setError(null)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoadingBookmarks(false)
      }
    }

    fetchBookmarks()
  }, [profile, authLoading, navigate])

  const handleLogout = () => {
    logout(navigate)
  }

  // Callback to refresh bookmarks list after mutations
  const refreshBookmarks = async () => {
    try {
      const response = await apiFetch('/api/bookmarks?limit=50')
      const bookmarksData = Array.isArray(response) ? response : response.data || []
      setBookmarks(bookmarksData)
      setError(null)
    } catch (err) {
      console.error('Failed to refresh bookmarks:', err)
      setError(err.message)
    }
  }

  const isLoading = authLoading || loadingBookmarks

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Loading your vault..." />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header style={{
        padding: '20px 40px',
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
        <Link to="/" style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          <span className="gradient-text">Bookmark Hub</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {profile && (
            <Link 
              to={`/${profile.handle}`} 
              className="fade-in"
              style={{ 
                fontSize: '0.9rem', 
                color: 'var(--text-secondary)',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontWeight: 500,
              }}
            >
              Public Profile: <strong style={{ color: 'var(--accent-indigo)' }}>@{profile.handle}</strong> ↗
            </Link>
          )}
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', width: 'auto' }}>
            Log Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{
        flex: 1,
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        padding: '40px 20px',
      }} className="fade-in">
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>Your Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your personal bookmarks. Private bookmarks are only visible to you.
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '24px' }}>
            <span>⚠️ {error}</span>
          </div>
        )}

        {bookmarks.length === 0 && !error ? (
          <EmptyState
            title="No bookmarks yet"
            description="Start adding bookmarks to build your personal vault. Click the button below to add your first one."
          />
        ) : (
          /* Bookmark Manager Component (Client CRUD) */
          <BookmarkManager 
            bookmarks={bookmarks} 
            onMutation={refreshBookmarks}
          />
        )}
      </main>
    </div>
  )
}
