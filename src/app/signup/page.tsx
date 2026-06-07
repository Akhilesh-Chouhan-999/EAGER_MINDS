'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { signup } from '@/app/auth/actions'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    const formData = new FormData(event.currentTarget)
    
    startTransition(async () => {
      const result = await signup(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(result.success)
      }
    })
  }

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '40px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
            Create your <span className="gradient-text">Bookmark Hub</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Claim your custom @handle and secure your bookmarks.
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="form-group">
              <label htmlFor="handle" className="form-label">
                Choose Handle
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  pointerEvents: 'none',
                }}>
                  @
                </span>
                <input
                  id="handle"
                  name="handle"
                  type="text"
                  placeholder="username"
                  className="form-input"
                  required
                  disabled={isPending}
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="form-input"
                required
                disabled={isPending}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="form-input"
                required
                disabled={isPending}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        )}

        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          Already have an account?{' '}
          <Link href="/login" style={{ fontWeight: '500' }}>
            Log In
          </Link>
        </div>
      </div>
    </main>
  )
}
