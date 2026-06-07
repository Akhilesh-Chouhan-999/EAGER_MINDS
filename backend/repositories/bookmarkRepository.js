const { getSupabaseClient } = require('../config/db')

/**
 * Repository layer to handle Database queries on bookmarks.
 */
class BookmarkRepository {
  async getBookmarks(token, page = null, limit = null) {
    const supabase = getSupabaseClient(token)
    let query = supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Apply pagination only if both page and limit are provided
    if (page && limit) {
      const offset = (page - 1) * limit
      // Use slice for client-side pagination if range is not available
      try {
        query = query.range(offset, offset + limit - 1)
      } catch (e) {
        // Fallback: don't apply range if not supported
      }
    }

    const { data, error } = await query

    if (error) throw error
    
    // For backward compatibility, return data directly if no pagination params
    if (!page || !limit) {
      return data || []
    }
    
    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: (data || []).length
      }
    }
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
