import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import BookmarkManager from '@/components/BookmarkManager'
import { logout } from '@/app/auth/actions'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile (specifically handle)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch all bookmarks owned by this user
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(8, 11, 17, 0.5)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <Link href="/" style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          <span className="gradient-text">Bookmark Hub</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {profile && (
            <Link 
              href={`/${profile.handle}`} 
              target="_blank"
              style={{ 
                fontSize: '0.9rem', 
                color: 'var(--text-secondary)',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontWeight: 500,
              }}
            >
              Public Profile: <strong style={{ color: 'var(--accent-indigo)' }}>@{profile.handle}</strong> ↗
            </Link>
          )}
          <form action={logout}>
            <button type="submit" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Log Out
            </button>
          </form>
        </div>
      </header>

      {/* Main Container */}
      <main style={{
        flex: 1,
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        padding: '40px 20px',
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>Your Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your personal bookmarks. Private bookmarks are only visible to you.
          </p>
        </div>

        {/* Bookmark Manager Component (Client side CRUD) */}
        <BookmarkManager 
          initialBookmarks={bookmarks || []} 
        />
      </main>
    </div>
  )
}
