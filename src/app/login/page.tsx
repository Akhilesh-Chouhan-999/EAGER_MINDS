'use client'

import { useState, useTransition, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { login } from '@/app/auth/actions'

function LoginForm() {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  const [actionError, setActionError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const displayError = actionError || errorParam

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setActionError(null)

    const formData = new FormData(event.currentTarget)
    
    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) {
        setActionError(result.error)
      }
    })
  }

  return (
    <div className="glass-panel" style={{
      width: '100%',
      maxWidth: '450px',
      padding: '40px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
          Welcome Back to <span className="gradient-text">Bookmark Hub</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Please log in to manage your bookmarks.
        </p>
      </div>

      {displayError && (
        <div className="alert alert-error">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{displayError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
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
          {isPending ? 'Logging In...' : 'Log In'}
        </button>
      </form>

      <div style={{
        textAlign: 'center',
        marginTop: '24px',
        fontSize: '0.9rem',
        color: 'var(--text-secondary)'
      }}>
        Don&apos;t have an account?{' '}
        <Link href="/signup" style={{ fontWeight: '500' }}>
          Sign Up
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
    }}>
      <Suspense fallback={
        <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '40px', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  )
}
