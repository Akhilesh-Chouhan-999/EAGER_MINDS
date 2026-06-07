const userRepository = require('../repositories/userRepository')
const bookmarkRepository = require('../repositories/bookmarkRepository')
const AppError = require('../utils/AppError')

/**
 * Service layer to resolve username handles and retrieve public bookmark listings.
 */
class ProfileService {
  async getPublicProfile(handle) {
    const cleanHandle = handle.toLowerCase()

    // Guard against reserved routes
    const RESERVED = ['api', 'login', 'signup', 'dashboard']
    if (RESERVED.includes(cleanHandle)) {
      throw new AppError('Profile not found.', 404)
    }

    const profile = await userRepository.findProfileByHandle(cleanHandle)
    if (!profile) {
      throw new AppError('Profile not found.', 404)
    }

    const bookmarks = await bookmarkRepository.getPublicBookmarksByUserId(profile.id)
    return { profile, bookmarks }
  }
}

module.exports = new ProfileService()
