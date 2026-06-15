import { useState, useEffect } from 'react'
import { apiFetch } from '../config/api'

/**
 * Custom React hook to manage user session details and verification.
 */
export function useAuth() {
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

  /**
   * Logs out the user: calls the server-side logout endpoint to invalidate
   * the Supabase session, then clears local state.
   */
  const logout = async (navigateCallback) => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' })
    } catch (err) {
      // Non-fatal: server may be unreachable; we still clear local state
      console.error('Server logout failed (non-fatal):', err.message)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      setProfile(null)
      if (navigateCallback) navigateCallback('/login')
    }
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
