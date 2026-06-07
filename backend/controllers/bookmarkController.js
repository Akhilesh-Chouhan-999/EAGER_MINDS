const bookmarkService = require('../services/bookmarkService')
const asyncHandler = require('../utils/asyncHandler')

/**
 * Controller to route bookmark management CRUD operations.
 */
// 1. Get Bookmarks list
exports.getBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await bookmarkService.getBookmarks(req.token)
  res.json(bookmarks)
})

// 2. Add New Bookmark
exports.addBookmark = asyncHandler(async (req, res) => {
  const { title, url, isPublic } = req.body
  const bookmark = await bookmarkService.addBookmark(title, url, isPublic, req.token)
  res.json(bookmark)
})

// 3. Update Existing Bookmark Details
exports.updateBookmark = asyncHandler(async (req, res) => {
  const { title, url, isPublic } = req.body
  const { id } = req.params
  await bookmarkService.updateBookmark(id, title, url, isPublic, req.token)
  res.json({ success: true })
})

// 4. Delete Bookmark
exports.deleteBookmark = asyncHandler(async (req, res) => {
  const { id } = req.params
  await bookmarkService.deleteBookmark(id, req.token)
  res.json({ success: true })
})
