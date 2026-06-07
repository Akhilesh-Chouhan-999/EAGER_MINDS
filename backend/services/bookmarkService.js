const bookmarkRepository = require('../repositories/bookmarkRepository')
const { scrapeMetadata } = require('../utils/metadataScraper')
const { getSupabaseClient } = require('../config/db')
const AppError = require('../utils/AppError')

const sanitizeString = (str) => {
  if (!str) return ''
  return String(str)
    .trim()
    .replace(/[<>]/g, '') // Remove dangerous characters
    .substring(0, 500) // Max length
}

const sanitizeUrl = (url) => {
  const trimmed = url.trim()
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

/**
 * Service layer to handle bookmark operations and metadata scraping logic.
 */
class BookmarkService {
  async getBookmarks(token, page = null, limit = null) {
    const result = await bookmarkRepository.getBookmarks(token, page, limit)
    // Return result directly if it's an array (for backward compatibility)
    return result
  }

  async addBookmark(title, url, isPublic, token) {
    const supabase = getSupabaseClient(token)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new AppError('Unauthorized.', 401)
    }

    const formattedUrl = sanitizeUrl(url)
    const metadata = await scrapeMetadata(formattedUrl)
    const sanitizedTitle = sanitizeString(title || metadata.title || 'Untitled Bookmark')
    const sanitizedDesc = sanitizeString(metadata.description || '')

    const bookmarkData = {
      user_id: user.id,
      title: sanitizedTitle,
      url: formattedUrl,
      description: sanitizedDesc || null,
      favicon_url: metadata.faviconUrl,
      is_public: !!isPublic
    }

    return await bookmarkRepository.createBookmark(bookmarkData, token)
  }

  async updateBookmark(id, title, url, isPublic, token) {
    const formattedUrl = sanitizeUrl(url)
    const metadata = await scrapeMetadata(formattedUrl)
    const sanitizedTitle = sanitizeString(title || metadata.title || 'Untitled Bookmark')
    const sanitizedDesc = sanitizeString(metadata.description || '')

    const bookmarkData = {
      title: sanitizedTitle,
      url: formattedUrl,
      description: sanitizedDesc || null,
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
