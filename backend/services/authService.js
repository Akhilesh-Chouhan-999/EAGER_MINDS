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
        },
        emailRedirectTo: process.env.FRONTEND_URL || 'http://localhost:5173/dashboard'
      }
    })

    if (error) throw new AppError(error.message, 400)

    if (data.user) {
      // Fire welcome email but don't block signup if it fails
      await sendWelcomeEmail(email, cleanHandle).catch((emailErr) => {
        console.error('Welcome email failed (non-fatal):', emailErr.message)
      })
    }

    return data
  }

  async login(email, password) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw new AppError(error.message, 401)
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

  async getGoogleOAuthUrl() {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: process.env.FRONTEND_URL || 'http://localhost:5173/dashboard'
      }
    })

    if (error) throw new AppError(error.message, 500)
    return data.url
  }
}

module.exports = new AuthService()
