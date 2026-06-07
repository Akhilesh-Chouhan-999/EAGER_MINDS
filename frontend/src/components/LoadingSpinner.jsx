/**
 * Loading spinner component for async operations
 */
export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      gap: '16px'
    }} className="fade-in">
      <div style={{
        width: '40px',
        height: '40px',
        border: '2px solid var(--border-color)',
        borderTop: '2px solid var(--accent-indigo)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: 'var(--text-secondary)' }}>{message}</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
