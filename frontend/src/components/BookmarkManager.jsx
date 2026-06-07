import { useState, useTransition } from 'react'
import { apiFetch } from '../config/api'

export default function BookmarkManager({ bookmarks, onMutation }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  // Add Form state
  const [addTitle, setAddTitle] = useState('')
  const [addUrl, setAddUrl] = useState('')
  const [addIsPublic, setAddIsPublic] = useState(false)
  const [addError, setAddError] = useState(null)

  // Edit Form state
  const [editTitle, setEditTitle] = useState('')
  const [editUrl, setEditUrl] = useState('')
  const [editIsPublic, setEditIsPublic] = useState(false)
  const [editError, setEditError] = useState(null)

  // Copy success indicator state
  const [copiedId, setCopiedId] = useState(null)

  const [isPending, startTransition] = useTransition()

  // Toggle Add Form view
  const handleToggleAddForm = () => {
    setShowAddForm(!showAddForm)
    setAddError(null)
    setAddTitle('')
    setAddUrl('')
    setAddIsPublic(false)
  }

  // Submit new bookmark
  const handleAddSubmit = (e) => {
    e.preventDefault()
    setAddError(null)

    startTransition(async () => {
      try {
        await apiFetch('/api/bookmarks', {
          method: 'POST',
          body: JSON.stringify({
            title: addTitle,
            url: addUrl,
            isPublic: addIsPublic
          })
        })
        
        // Reset and trigger refresh
        setAddTitle('')
        setAddUrl('')
        setAddIsPublic(false)
        setShowAddForm(false)
        onMutation()
      } catch (err) {
        setAddError(err.message)
      }
    })
  }

  // Open inline edit mode
  const startEditing = (bookmark) => {
    setEditingId(bookmark.id)
    setEditTitle(bookmark.title)
    setEditUrl(bookmark.url)
    setEditIsPublic(bookmark.is_public)
    setEditError(null)
  }

  // Submit edited bookmark details
  const handleEditSubmit = (e, id) => {
    e.preventDefault()
    setEditError(null)

    startTransition(async () => {
      try {
        await apiFetch(`/api/bookmarks/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: editTitle,
            url: editUrl,
            isPublic: editIsPublic
          })
        })
        
        setEditingId(null)
        onMutation()
      } catch (err) {
        setEditError(err.message)
      }
    })
  }

  // Delete bookmark
  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) {
      return
    }

    startTransition(async () => {
      try {
        await apiFetch(`/api/bookmarks/${id}`, {
          method: 'DELETE'
        })
        onMutation()
      } catch (err) {
        alert(err.message)
      }
    })
  }

  // Copy to clipboard helper
  const copyToClipboard = (id, url) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Add Bookmark form trigger and container */}
      <div>
        <button 
          onClick={handleToggleAddForm}
          className="btn btn-primary"
          style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}
        >
          {showAddForm ? (
            <>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add New Bookmark
            </>
          )}
        </button>

        {showAddForm && (
          <div className="glass-panel fade-in" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Add Bookmark Details</h3>
            
            {addError && (
              <div className="alert alert-error">
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="add-title" className="form-label">Title</label>
                  <input 
                    id="add-title"
                    type="text" 
                    placeholder="e.g. Next.js Documentation" 
                    value={addTitle}
                    onChange={(e) => setAddTitle(e.target.value)}
                    className="form-input"
                    required
                    disabled={isPending}
                  />
                </div>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="add-url" className="form-label">URL</label>
                  <input 
                    id="add-url"
                    type="text" 
                    placeholder="e.g. nextjs.org/docs" 
                    value={addUrl}
                    onChange={(e) => setAddUrl(e.target.value)}
                    className="form-input"
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <input 
                  id="add-is-public"
                  type="checkbox" 
                  checked={addIsPublic}
                  onChange={(e) => setAddIsPublic(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  disabled={isPending}
                />
                <label htmlFor="add-is-public" style={{ fontSize: '0.95rem', userSelect: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                  <strong>Make bookmark public</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Anyone will be able to see this on your public profile.
                  </span>
                </label>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: 'auto', alignSelf: 'flex-start', marginTop: '10px' }}
                disabled={isPending}
              >
                {isPending ? 'Saving...' : 'Save Bookmark'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bookmarks List */}
      <div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Your Saved Bookmarks ({bookmarks.length})</h3>
        
        {bookmarks.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>You haven&apos;t saved any bookmarks yet. Click &ldquo;Add New Bookmark&rdquo; above to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookmarks.map((bookmark) => {
              const isEditing = editingId === bookmark.id

              return (
                <div key={bookmark.id} className="glass-panel" style={{ padding: '20px', transition: 'all 0.2s ease' }}>
                  {isEditing ? (
                    // Inline Edit Form
                    <form onSubmit={(e) => handleEditSubmit(e, bookmark.id)}>
                      <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--accent-indigo)' }}>Editing Bookmark</h4>
                      
                      {editError && (
                        <div className="alert alert-error" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                          <span>{editError}</span>
                        </div>
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Title</label>
                          <input 
                            type="text" 
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="form-input"
                            required
                            disabled={isPending}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">URL</label>
                          <input 
                            type="text" 
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            className="form-input"
                            required
                            disabled={isPending}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input 
                            id={`edit-public-${bookmark.id}`}
                            type="checkbox" 
                            checked={editIsPublic}
                            onChange={(e) => setEditIsPublic(e.target.checked)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                            disabled={isPending}
                          />
                          <label htmlFor={`edit-public-${bookmark.id}`} style={{ fontSize: '0.9rem', cursor: 'pointer', userSelect: 'none' }}>
                            Public bookmark
                          </label>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button 
                            type="button" 
                            onClick={() => setEditingId(null)} 
                            className="btn btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
                            disabled={isPending}
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="btn btn-primary" 
                            style={{ padding: '6px 16px', fontSize: '0.85rem', width: 'auto' }}
                            disabled={isPending}
                          >
                            {isPending ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                     // Display details
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flex: 1, minWidth: '280px' }}>
                        {/* Website Favicon */}
                        <img 
                          src={bookmark.favicon_url || `https://www.google.com/s2/favicons?domain=${(() => {
                            try { return new URL(bookmark.url).hostname } catch { return '' }
                          })()}&sz=32`} 
                          alt="" 
                          onError={(e) => { e.target.style.display = 'none' }}
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '3px',
                            border: '1px solid var(--border-color)',
                            marginTop: '4px',
                            flexShrink: 0
                          }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{bookmark.title}</h4>
                            <span style={{ 
                              fontSize: '0.7rem', 
                              padding: '2px 8px', 
                              borderRadius: '12px', 
                              background: bookmark.is_public ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: bookmark.is_public ? '#10b981' : '#ef4444',
                              border: `1px solid ${bookmark.is_public ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                              fontWeight: 600,
                            }}>
                              {bookmark.is_public ? 'Public' : 'Private'}
                            </span>
                          </div>
                          <a 
                            href={bookmark.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}
                          >
                            {bookmark.url.replace(/^https?:\/\/(www\.)?/, '')}
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          {bookmark.description && (
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                              {bookmark.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Copy Link Button */}
                        <button 
                          onClick={() => copyToClipboard(bookmark.id, bookmark.url)}
                          className="btn btn-secondary"
                          style={{ padding: '8px 12px', width: 'auto', fontSize: '0.8rem', display: 'inline-flex', gap: '4px' }}
                          title="Copy Link"
                        >
                          {copiedId === bookmark.id ? (
                            <>
                              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              <span style={{ color: '#10b981' }}>Copied!</span>
                            </>
                          ) : (
                            <>
                              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                              Copy
                            </>
                          )}
                        </button>

                        {/* Edit Button */}
                        <button 
                          onClick={() => startEditing(bookmark)}
                          className="btn btn-secondary"
                          style={{ padding: '8px 12px', width: 'auto', fontSize: '0.8rem', display: 'inline-flex', gap: '4px' }}
                        >
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M18.364 4.982a8.813 8.813 0 00-1.414-1.414m0 0L8 11.828V14h2.172l7.77-7.758z" />
                          </svg>
                          Edit
                        </button>

                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDelete(bookmark.id)}
                          className="btn btn-secondary"
                          style={{ padding: '8px 12px', width: 'auto', fontSize: '0.8rem', display: 'inline-flex', gap: '4px', borderColor: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}
                          disabled={isPending}
                        >
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
