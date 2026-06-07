const { getSupabaseClient } = require('../config/db')
const { scrapeMetadata } = require('../utils/metadataScraper')
const asyncHandler = require('../utils/asyncHandler')

// Pure helper function to sanitize URL formatting
const sanitizeUrl = (url) => {
  const trimmed = url.trim()
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

// 1. Get Bookmarks (wrapped in asyncHandler)
exports.getBookmarks = asyncHandler(async (req, res) => {
  const supabase = getSupabaseClient(req.token)
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized.' })
  }

  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  res.json(bookmarks)
})

// 2. Add Bookmark with Automatic Scraped Metadata
exports.addBookmark = asyncHandler(async (req, res) => {
  const { title, url, isPublic } = req.body

  const supabase = getSupabaseClient(req.token)
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized.' })
  }

  const formattedUrl = sanitizeUrl(url)

  // Fetch metadata asynchronously before database insert
  const metadata = await scrapeMetadata(formattedUrl)
  
  // Use user-supplied title if provided, otherwise fallback to scraped title
  const finalTitle = (title && title.trim()) ? title.trim() : (metadata.title || 'Untitled Bookmark')

  const { data: bookmark, error } = await supabase
    .from('bookmarks')
    .insert({
      user_id: user.id,
      title: finalTitle,
      url: formattedUrl,
      description: metadata.description,
      favicon_url: metadata.faviconUrl,
      is_public: !!isPublic
    })
    .select()
    .single()

  if (error) throw error
  res.json(bookmark)
})

// 3. Update Bookmark Details
exports.updateBookmark = asyncHandler(async (req, res) => {
  const { title, url, isPublic } = req.body
  const { id } = req.params

  const supabase = getSupabaseClient(req.token)

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized.' })
  }

  const formattedUrl = sanitizeUrl(url)

  // Rescrape metadata if URL has changed or just update what the user passed
  const metadata = await scrapeMetadata(formattedUrl)
  const finalTitle = (title && title.trim()) ? title.trim() : (metadata.title || 'Untitled Bookmark')

  const { error } = await supabase
    .from('bookmarks')
    .update({
      title: finalTitle,
      url: formattedUrl,
      description: metadata.description,
      favicon_url: metadata.faviconUrl,
      is_public: !!isPublic
    })
    .eq('id', id)

  if (error) throw error
  res.json({ success: true })
})

// 4. Delete Bookmark
exports.deleteBookmark = asyncHandler(async (req, res) => {
  const { id } = req.params
  const supabase = getSupabaseClient(req.token)

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized.' })
  }

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)

  if (error) throw error
  res.json({ success: true })
})
