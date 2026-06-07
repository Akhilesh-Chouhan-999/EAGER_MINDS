'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchProfile() {
  const [handle, setHandle] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clean handle: remove leading '@' and trim whitespace
    let cleanHandle = handle.trim()
    if (cleanHandle.startsWith('@')) {
      cleanHandle = cleanHandle.substring(1)
    }
    cleanHandle = cleanHandle.toLowerCase()

    if (cleanHandle) {
      router.push(`/${cleanHandle}`)
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
        />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '0 24px' }}>
        View Profile
      </button>
    </form>
  )
}
