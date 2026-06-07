const { getSupabaseClient } = require('../config/db')

// Helper to clean URL prefix
function cleanUrl(url) {
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

exports.getBookmarks = async (req, res) => {
  try {
    const supabase = getSupabaseClient(req.token)
    
    // Verify auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return res.status(401).json({ error: 'Unauthorized.' })

    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(bookmarks)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.addBookmark = async (req, res) => {
  const { title, url, isPublic } = req.body

  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required.' })
  }

  try {
    const supabase = getSupabaseClient(req.token)
    
    // Get user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return res.status(401).json({ error: 'Unauthorized.' })

    const formattedUrl = cleanUrl(url)

    const { data: bookmark, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: user.id,
        title: title.trim(),
        url: formattedUrl,
        is_public: !!isPublic
      })
      .select()
      .single()

    if (error) throw error
    res.json(bookmark)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.updateBookmark = async (req, res) => {
  const { title, url, isPublic } = req.body
  const { id } = req.params

  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required.' })
  }

  try {
    const supabase = getSupabaseClient(req.token)

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return res.status(401).json({ error: 'Unauthorized.' })

    const formattedUrl = cleanUrl(url)

    const { error } = await supabase
      .from('bookmarks')
      .update({
        title: title.trim(),
        url: formattedUrl,
        is_public: !!isPublic
      })
      .eq('id', id)

    if (error) throw error
    res.json({ success: true })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.deleteBookmark = async (req, res) => {
  const { id } = req.params

  try {
    const supabase = getSupabaseClient(req.token)

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return res.status(401).json({ error: 'Unauthorized.' })

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (error) throw error
    res.json({ success: true })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
