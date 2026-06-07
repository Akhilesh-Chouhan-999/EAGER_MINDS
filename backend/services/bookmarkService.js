const bookmarkRepository = require('../repositories/bookmarkRepository')
const { scrapeMetadata } = require('../utils/metadataScraper')
const { getSupabaseClient } = require('../config/db')

const sanitizeUrl = (url) => {
  const trimmed = url.trim()
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

/**
 * Service layer to handle bookmark operations and metadata scraping logic.
 */
class BookmarkService {
  async getBookmarks(token) {
    return await bookmarkRepository.getBookmarks(token)
  }

  async addBookmark(title, url, isPublic, token) {
    const supabase = getSupabaseClient(token)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized.')
    }

    const formattedUrl = sanitizeUrl(url)
    const metadata = await scrapeMetadata(formattedUrl)
    const finalTitle = (title && title.trim()) ? title.trim() : (metadata.title || 'Untitled Bookmark')

    const bookmarkData = {
      user_id: user.id,
      title: finalTitle,
      url: formattedUrl,
      description: metadata.description,
      favicon_url: metadata.faviconUrl,
      is_public: !!isPublic
    }

    return await bookmarkRepository.createBookmark(bookmarkData, token)
  }

  async updateBookmark(id, title, url, isPublic, token) {
    const formattedUrl = sanitizeUrl(url)
    const metadata = await scrapeMetadata(formattedUrl)
    const finalTitle = (title && title.trim()) ? title.trim() : (metadata.title || 'Untitled Bookmark')

    const bookmarkData = {
      title: finalTitle,
      url: formattedUrl,
      description: metadata.description,
      favicon_url: metadata.faviconUrl,
      is_public: !!isPublic
    }

    return await bookmarkRepository.updateBookmark(id, bookmarkData, token)
  }

  async deleteBookmark(id, token) {
    return await bookmarkRepository.deleteBookmark(id, token)
  }
}

module.exports = new BookmarkService()
