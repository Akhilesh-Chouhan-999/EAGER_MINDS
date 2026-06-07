/**
 * EmptyState component for displaying when no data is available
 */
export default function EmptyState({ title, description, action = null }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      textAlign: 'center',
      minHeight: '300px'
    }} className="fade-in">
      <div style={{
        fontSize: '3rem',
        marginBottom: '20px',
        opacity: 0.5
      }}>
        📭
      </div>
      <h3 style={{
        fontSize: '1.3rem',
        marginBottom: '8px',
        color: 'var(--text-primary)'
      }}>
        {title}
      </h3>
      <p style={{
        color: 'var(--text-secondary)',
        marginBottom: '24px',
        maxWidth: '400px'
      }}>
        {description}
      </p>
      {action && (
        <div style={{ display: 'flex', gap: '12px' }}>
          {action}
        </div>
      )}
    </div>
  )
}
