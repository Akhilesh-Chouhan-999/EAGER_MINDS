import { Component } from 'react'

/**
 * Error Boundary component to catch and display errors gracefully
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '500px',
            padding: '40px'
          }}>
            <h2 style={{ color: 'var(--error)', marginBottom: '16px' }}>
              ⚠️ Something Went Wrong
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <details style={{
              background: 'rgba(239, 68, 68, 0.05)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px',
              textAlign: 'left',
              color: 'var(--text-muted)',
              fontSize: '0.85rem'
            }}>
              <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                Error Details
              </summary>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {this.state.error?.toString()}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
