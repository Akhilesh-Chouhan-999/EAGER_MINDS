import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchProfile() {
  const [handle, setHandle] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    
    // Clean handle: strip leading '@' and trim space
    let cleanHandle = handle.trim()
    if (cleanHandle.startsWith('@')) {
      cleanHandle = cleanHandle.substring(1)
    }
    cleanHandle = cleanHandle.toLowerCase()

    if (cleanHandle) {
      navigate(`/${cleanHandle}`)
    }
  }

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', width: '100%' }}>
      <div style={{ position: 'relative', flex: 1 }}>
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
          type="text"
          placeholder="search-handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '32px', marginBottom: 0 }}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '0 24px' }}>
        View Profile
      </button>
    </form>
  )
}
