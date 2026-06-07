const { getSupabaseClient } = require('../config/db')

exports.getPublicProfile = async (req, res) => {
  const handle = req.params.handle.toLowerCase()

  // Guard against reserved endpoints
  const RESERVED = ['api', 'login', 'signup', 'dashboard']
  if (RESERVED.includes(handle)) {
    return res.status(404).json({ error: 'Profile not found.' })
  }

  try {
    const supabase = getSupabaseClient()

    // 1. Get profile matching handle
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('handle', handle)
      .maybeSingle()

    if (profileError) throw profileError
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' })
    }

    // 2. Get public bookmarks only
    const { data: bookmarks, error: bookmarksError } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', profile.id)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (bookmarksError) throw bookmarksError

    res.json({ profile, bookmarks })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
