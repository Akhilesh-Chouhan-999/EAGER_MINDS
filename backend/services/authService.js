const { getSupabaseClient } = require('../config/db')
const userRepository = require('../repositories/userRepository')
const { sendWelcomeEmail } = require('../utils/emailService')
const AppError = require('../utils/AppError')

/**
 * Service layer to handle authentication and session retrieval.
 */
class AuthService {
  async signup(email, password, handle) {
    const cleanHandle = handle.trim().toLowerCase()

    // precheck handle
    const existingProfile = await userRepository.findProfileByHandle(cleanHandle)
    if (existingProfile) {
      throw new AppError('This @handle is already taken. Please choose another one.', 400)
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          handle: cleanHandle
        }
      }
    })

    if (error) throw error

    if (data.user) {
      await sendWelcomeEmail(email, cleanHandle)
    }

    return data
  }

  async login(email, password) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  async getMe(token) {
    const supabase = getSupabaseClient(token)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new AppError('Invalid or expired session token.', 401)
    }

    const profile = await userRepository.findProfileById(user.id, token)
    return { user, profile }
  }
}

module.exports = new AuthService()
