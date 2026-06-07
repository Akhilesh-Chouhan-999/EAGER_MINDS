const { getSupabaseClient } = require('../config/db')

/**
 * Repository layer to handle Database queries on bookmarks.
 */
class BookmarkRepository {
  async getBookmarks(token) {
    const supabase = getSupabaseClient(token)
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getPublicBookmarksByUserId(userId) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async createBookmark(bookmarkData, token) {
    const supabase = getSupabaseClient(token)
    const { data, error } = await supabase
      .from('bookmarks')
      .insert(bookmarkData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateBookmark(id, bookmarkData, token) {
    const supabase = getSupabaseClient(token)
    const { error } = await supabase
      .from('bookmarks')
      .update(bookmarkData)
      .eq('id', id)

    if (error) throw error
    return true
  }

  async deleteBookmark(id, token) {
    const supabase = getSupabaseClient(token)
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}

module.exports = new BookmarkRepository()
