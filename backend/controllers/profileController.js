const profileService = require('../services/profileService')
const asyncHandler = require('../utils/asyncHandler')

/**
 * Controller to route public profile requests.
 */
// 1. Get Public Profile details and shared bookmarks listing
exports.getPublicProfile = asyncHandler(async (req, res) => {
  const { handle } = req.params
  const data = await profileService.getPublicProfile(handle)
  res.json(data)
})
