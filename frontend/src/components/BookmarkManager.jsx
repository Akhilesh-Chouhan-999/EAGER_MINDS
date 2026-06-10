import { useState, useTransition, useMemo } from 'react'
import { apiFetch } from '../config/api'
import { formatDate } from '../utils/date'

// ── helpers ────────────────────────────────────────────────────────────────
function getFavicon(url) {
  try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32` }
  catch { return null }
}

function getDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, '') }
  catch { return url }
}

// ── Modal ──────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        animation: 'fadeIn 0.18s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel"
        style={{ width: '100%', maxWidth: '520px', padding: '32px', position: 'relative', animation: 'slideDown 0.2s ease' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.25rem' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Bookmark Form (shared by Add + Edit) ──────────────────────────────────
function BookmarkForm({ initial = {}, onSubmit, isPending, error, submitLabel }) {
  const [title, setTitle] = useState(initial.title || '')
  const [url, setUrl] = useState(initial.url || '')
  const [isPublic, setIsPublic] = useState(initial.is_public ?? false)
  const [tags, setTags] = useState((initial.tags || []).join(', '))

  const handleSubmit = (e) => {
    e.preventDefault()
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean)
    onSubmit({ title, url, isPublic, tags: tagArray })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {error && (
        <div className="alert alert-error" style={{ margin: 0 }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">URL *</label>
        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="form-input"
          required
          disabled={isPending}
          autoFocus
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Title (optional — auto-fetched if blank)</label>
        <input
          type="text"
          placeholder="e.g. React Documentation"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          disabled={isPending}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Tags (comma-separated, optional)</label>
        <input
          type="text"
          placeholder="e.g. react, frontend, tools"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="form-input"
          disabled={isPending}
        />
      </div>

      <div
        onClick={() => !isPending && setIsPublic(!isPublic)}
        style={{
          display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
          background: isPublic ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${isPublic ? 'rgba(16,185,129,0.2)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s ease',
          userSelect: 'none',
        }}
      >
        <div style={{
          width: '44px', height: '24px', borderRadius: '12px',
          background: isPublic ? '#10b981' : 'rgba(255,255,255,0.1)',
          position: 'relative', transition: 'background 0.2s ease', flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute', top: '3px',
            left: isPublic ? '23px' : '3px',
            width: '18px', height: '18px', borderRadius: '50%',
            background: 'white', transition: 'left 0.2s ease',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }} />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{isPublic ? 'Public bookmark' : 'Private bookmark'}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {isPublic ? 'Visible on your public profile page' : 'Only visible to you'}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={isPending}
        style={{ marginTop: '4px' }}
      >
        {isPending ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Saving…
          </span>
        ) : submitLabel}
      </button>
    </form>
  )
}

// ── Delete Confirm Dialog ─────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Modal title="Confirm Delete" onClose={onCancel}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={onCancel} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
        <button
          onClick={onConfirm}
          className="btn"
          style={{ flex: 1, background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          Delete
        </button>
      </div>
    </Modal>
  )
}

// ── Tag Pill ──────────────────────────────────────────────────────────────
function TagPill({ tag }) {
  return (
    <span style={{
      fontSize: '0.7rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 600,
      background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
      color: 'var(--accent-indigo)',
    }}>
      {tag}
    </span>
  )
}

// ── Main Component ────────────────────────────────────────────────────────
export default function BookmarkManager({ bookmarks, onMutation }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editBookmark, setEditBookmark] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [addError, setAddError] = useState(null)
  const [editError, setEditError] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibilityFilter, setVisibilityFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('list') // 'list' | 'grid'
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [showBulkConfirm, setShowBulkConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  // All unique tags across bookmarks
  const allTags = useMemo(() => {
    const set = new Set()
    bookmarks.forEach(b => (b.tags || []).forEach(t => set.add(t)))
    return [...set].sort()
  }, [bookmarks])

  // Filtered + sorted list
  const filteredBookmarks = useMemo(() => {
    let list = bookmarks.filter((b) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch = !q ||
        (b.title || '').toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        (b.description || '').toLowerCase().includes(q) ||
        (b.tags || []).some(t => t.toLowerCase().includes(q))
      const matchesVis =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'public' && b.is_public) ||
        (visibilityFilter === 'private' && !b.is_public)
      const matchesTag = !tagFilter || (b.tags || []).includes(tagFilter)
      return matchesSearch && matchesVis && matchesTag
    })
    if (sortBy === 'newest') list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    else if (sortBy === 'oldest') list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    else if (sortBy === 'az') list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    else if (sortBy === 'za') list.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
    return list
  }, [bookmarks, searchQuery, visibilityFilter, tagFilter, sortBy])

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleAdd = (fields) => {
    setAddError(null)
    startTransition(async () => {
      try {
        await apiFetch('/api/bookmarks', {
          method: 'POST',
          body: JSON.stringify({ title: fields.title, url: fields.url, isPublic: fields.isPublic, tags: fields.tags }),
        })
        setShowAddModal(false)
        onMutation()
      } catch (err) { setAddError(err.message) }
    })
  }

  const handleEdit = (fields) => {
    setEditError(null)
    startTransition(async () => {
      try {
        await apiFetch(`/api/bookmarks/${editBookmark.id}`, {
          method: 'PUT',
          body: JSON.stringify({ title: fields.title, url: fields.url, isPublic: fields.isPublic, tags: fields.tags }),
        })
        setEditBookmark(null)
        onMutation()
      } catch (err) { setEditError(err.message) }
    })
  }

  const handleDelete = (id) => {
    startTransition(async () => {
      try {
        await apiFetch(`/api/bookmarks/${id}`, { method: 'DELETE' })
        setDeleteTarget(null)
        onMutation()
      } catch (err) { alert(err.message) }
    })
  }

  const handleBulkDelete = () => {
    startTransition(async () => {
      try {
        await Promise.all([...selectedIds].map(id =>
          apiFetch(`/api/bookmarks/${id}`, { method: 'DELETE' })
        ))
        setSelectedIds(new Set())
        setShowBulkConfirm(false)
        onMutation()
      } catch (err) { alert(err.message) }
    })
  }

  const copyToClipboard = (id, url) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredBookmarks.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredBookmarks.map(b => b.id)))
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Top Bar: Add + Search + Filters ── */}
      <div className="glass-panel" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Add Button */}
          <button
            id="add-bookmark-btn"
            onClick={() => { setShowAddModal(true); setAddError(null) }}
            className="btn btn-primary"
            style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Bookmark
          </button>

          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: '340px' }}>
            <svg
              width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
            </svg>
            <input
              id="bookmark-search"
              type="text"
              placeholder="Search bookmarks…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px', fontSize: '0.88rem', marginBottom: 0 }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Visibility filter */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '2px' }}>
              {['all', 'public', 'private'].map((f) => (
                <button
                  key={f}
                  onClick={() => setVisibilityFilter(f)}
                  style={{
                    background: visibilityFilter === f ? 'rgba(99,102,241,0.15)' : 'transparent',
                    border: 'none',
                    color: visibilityFilter === f ? 'var(--accent-indigo)' : 'var(--text-muted)',
                    padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem',
                    fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize',
                  }}
                >{f}</button>
              ))}
            </div>

            {/* Tag filter */}
            {allTags.length > 0 && (
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="form-input"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '0.82rem', marginBottom: 0 }}
              >
                <option value="">All tags</option>
                {allTags.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            )}

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.82rem', marginBottom: 0 }}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
            </select>

            {/* View mode toggle */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '2px' }}>
              {[
                { mode: 'list', icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> },
                { mode: 'grid', icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
              ].map(({ mode, icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    background: viewMode === mode ? 'rgba(99,102,241,0.15)' : 'transparent',
                    border: 'none', color: viewMode === mode ? 'var(--accent-indigo)' : 'var(--text-muted)',
                    padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    transition: 'all 0.15s',
                  }}
                >{icon}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Results summary + bulk actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {filteredBookmarks.length} of {bookmarks.length} bookmarks
            {tagFilter && ` tagged "${tagFilter}"`}
          </span>
          {selectedIds.size > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--accent-indigo)', fontWeight: 600 }}>
                {selectedIds.size} selected
              </span>
              <button
                onClick={() => setShowBulkConfirm(true)}
                className="btn"
                style={{ width: 'auto', padding: '5px 14px', fontSize: '0.8rem', background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete selected
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Empty State ── */}
      {bookmarks.length === 0 && (
        <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔖</div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Your vault is empty</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '380px', margin: '0 auto 28px', lineHeight: 1.7 }}>
            Start saving links, articles, tools and resources. Click <strong>Add Bookmark</strong> above to get started.
          </p>
          <button
            onClick={() => { setShowAddModal(true); setAddError(null) }}
            className="btn btn-primary"
            style={{ width: 'auto', padding: '12px 28px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add your first bookmark
          </button>
        </div>
      )}

      {/* ── No results from filter ── */}
      {bookmarks.length > 0 && filteredBookmarks.length === 0 && (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔍</div>
          <p>No bookmarks match your filters.</p>
          <button onClick={() => { setSearchQuery(''); setVisibilityFilter('all'); setTagFilter('') }} style={{ marginTop: '12px', background: 'none', border: 'none', color: 'var(--accent-indigo)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
            Clear filters
          </button>
        </div>
      )}

      {/* ── Select all bar ── */}
      {filteredBookmarks.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            checked={selectedIds.size === filteredBookmarks.length}
            onChange={toggleSelectAll}
            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--accent-indigo)' }}
          />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={toggleSelectAll}>
            Select all
          </span>
        </div>
      )}

      {/* ── Bookmark List ── */}
      <div style={
        viewMode === 'grid'
          ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }
          : { display: 'flex', flexDirection: 'column', gap: '12px' }
      }>
        {filteredBookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            viewMode={viewMode}
            isSelected={selectedIds.has(bookmark.id)}
            onToggleSelect={toggleSelect}
            onEdit={() => { setEditBookmark(bookmark); setEditError(null) }}
            onDelete={() => setDeleteTarget(bookmark)}
            onCopy={copyToClipboard}
            copiedId={copiedId}
          />
        ))}
      </div>

      {/* ── Add Modal ── */}
      {showAddModal && (
        <Modal title="Add New Bookmark" onClose={() => setShowAddModal(false)}>
          <BookmarkForm
            onSubmit={handleAdd}
            isPending={isPending}
            error={addError}
            submitLabel="Save Bookmark"
          />
        </Modal>
      )}

      {/* ── Edit Modal ── */}
      {editBookmark && (
        <Modal title="Edit Bookmark" onClose={() => setEditBookmark(null)}>
          <BookmarkForm
            initial={editBookmark}
            onSubmit={handleEdit}
            isPending={isPending}
            error={editError}
            submitLabel="Save Changes"
          />
        </Modal>
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Bulk Delete Confirm ── */}
      {showBulkConfirm && (
        <ConfirmDialog
          message={`Are you sure you want to delete ${selectedIds.size} bookmark${selectedIds.size > 1 ? 's' : ''}? This cannot be undone.`}
          onConfirm={handleBulkDelete}
          onCancel={() => setShowBulkConfirm(false)}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── Bookmark Card ─────────────────────────────────────────────────────────
function BookmarkCard({ bookmark, viewMode, isSelected, onToggleSelect, onEdit, onDelete, onCopy, copiedId }) {
  const favicon = getFavicon(bookmark.url)
  const domain = getDomain(bookmark.url)
  const isCopied = copiedId === bookmark.id

  if (viewMode === 'grid') {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '20px',
          outline: isSelected ? '2px solid rgba(99,102,241,0.5)' : 'none',
          transition: 'all 0.2s ease',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" checked={isSelected} onChange={() => onToggleSelect(bookmark.id)}
              style={{ width: '15px', height: '15px', accentColor: 'var(--accent-indigo)', cursor: 'pointer' }} />
            {favicon && (
              <img src={favicon} alt="" onError={(e) => e.target.style.display = 'none'}
                style={{ width: '24px', height: '24px', borderRadius: '5px' }} />
            )}
          </div>
          <span style={{
            fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 700,
            background: bookmark.is_public ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
            color: bookmark.is_public ? '#10b981' : '#ef4444',
            border: `1px solid ${bookmark.is_public ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)'}`,
          }}>{bookmark.is_public ? 'Public' : 'Private'}</span>
        </div>

        {/* Title */}
        <div>
          <a href={bookmark.url} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}
            onMouseEnter={e => e.target.style.color = 'var(--accent-indigo)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-primary)'}
          >
            {bookmark.title || domain}
          </a>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{domain}</span>
        </div>

        {/* Description */}
        {bookmark.description && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {bookmark.description}
          </p>
        )}

        {/* Tags */}
        {(bookmark.tags || []).length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {bookmark.tags.map(t => <TagPill key={t} tag={t} />)}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatDate(bookmark.created_at)}</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <ActionBtn onClick={() => onCopy(bookmark.id, bookmark.url)} title="Copy link">
              {isCopied
                ? <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                : <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              }
            </ActionBtn>
            <ActionBtn onClick={onEdit} title="Edit">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M4 20h4l11-11a2.828 2.828 0 00-4-4L4 16v4z" />
              </svg>
            </ActionBtn>
            <ActionBtn onClick={onDelete} title="Delete" danger>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </ActionBtn>
          </div>
        </div>
      </div>
    )
  }

  // List view
  return (
    <div
      className="glass-panel"
      style={{
        padding: '16px 20px',
        outline: isSelected ? '2px solid rgba(99,102,241,0.4)' : 'none',
        transition: 'all 0.2s ease',
        display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
      }}
    >
      <input type="checkbox" checked={isSelected} onChange={() => onToggleSelect(bookmark.id)}
        style={{ width: '15px', height: '15px', flexShrink: 0, accentColor: 'var(--accent-indigo)', cursor: 'pointer' }} />

      {favicon && (
        <img src={favicon} alt="" onError={(e) => e.target.style.display = 'none'}
          style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }} />
      )}

      {/* Main info */}
      <div style={{ flex: 1, minWidth: '200px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
          <a href={bookmark.url} target="_blank" rel="noopener noreferrer"
            style={{ fontWeight: 700, fontSize: '0.97rem', color: 'var(--text-primary)', transition: 'color 0.15s' }}
            onMouseEnter={e => e.target.style.color = 'var(--accent-indigo)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-primary)'}
          >
            {bookmark.title || domain}
          </a>
          <span style={{
            fontSize: '0.65rem', padding: '1px 7px', borderRadius: '10px', fontWeight: 700,
            background: bookmark.is_public ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
            color: bookmark.is_public ? '#10b981' : '#ef4444',
            border: `1px solid ${bookmark.is_public ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)'}`,
          }}>{bookmark.is_public ? 'Public' : 'Private'}</span>
          {(bookmark.tags || []).map(t => <TagPill key={t} tag={t} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{domain}</span>
          {bookmark.description && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '300px' }}>
              {bookmark.description}
            </span>
          )}
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{formatDate(bookmark.created_at)}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        <ActionBtn onClick={() => onCopy(bookmark.id, bookmark.url)} title={isCopied ? 'Copied!' : 'Copy link'}>
          {isCopied
            ? <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            : <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          }
        </ActionBtn>
        <ActionBtn onClick={onEdit} title="Edit">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M4 20h4l11-11a2.828 2.828 0 00-4-4L4 16v4z" />
          </svg>
        </ActionBtn>
        <ActionBtn onClick={onDelete} title="Delete" danger>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </ActionBtn>
      </div>
    </div>
  )
}

function ActionBtn({ onClick, children, title, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: danger ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${danger ? 'rgba(239,68,68,0.15)' : 'var(--border-color)'}`,
        color: danger ? '#fca5a5' : 'var(--text-secondary)',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.1)'
        e.currentTarget.style.borderColor = danger ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.05)'
        e.currentTarget.style.borderColor = danger ? 'rgba(239,68,68,0.15)' : 'var(--border-color)'
      }}
    >
      {children}
    </button>
  )
}
