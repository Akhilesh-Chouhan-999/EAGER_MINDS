import { useState, useEffect } from 'react'
import { apiFetch } from '../config/api'

/**
 * Custom React hook to manage user session details and verification.
 */
export function useAuth() {
  // Extract OAuth access token from redirect hash if present (runs synchronously on initial call)
  const hash = window.location.hash
  if (hash) {
    // replace '#' with '?' to parse as search parameters easily
    const params = new URLSearchParams(hash.replace(/^#/, '?'))
    const accessToken = params.get('access_token')
    if (accessToken) {
      localStorage.setItem('token', accessToken)
      // Clean URL by removing the hash fragment
      window.history.replaceState(null, null, window.location.pathname)
    }
  }

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setLoading(false)
      return
    }

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

  const logout = (navigateCallback) => {
    localStorage.removeItem('token')
    setUser(null)
    setProfile(null)
    if (navigateCallback) navigateCallback('/login')
  }

  return {
    user,
    profile,
    loading,
    logout,
    setProfile,
    setUser
  }
}
