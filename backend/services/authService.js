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
    const supabase = getSupabaseClient()
    // Pass token directly to getUser() — correct way to verify a JWT server-side in Supabase JS v2
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      throw new AppError('Invalid or expired session token.', 401)
    }

    let profile = await userRepository.findProfileById(user.id)

    // Auto-create profile for Google OAuth users if trigger didn't fire
    if (!profile) {
      // Use the user's token so PostgREST sees auth.uid() = user.id and RLS INSERT policy passes
      const supabaseAdmin = getSupabaseClient(token)
      let rawHandle = (
        user.user_metadata?.handle ||
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        'user'
      ).toLowerCase().replace(/[^a-z0-9_]/g, '')

      if (rawHandle.length < 3) rawHandle = rawHandle + 'usr'

      let finalHandle = rawHandle
      let suffix = 1
      while (await userRepository.findProfileByHandle(finalHandle)) {
        finalHandle = rawHandle + suffix
        suffix++
      }

      const { data: newProfile, error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert({ id: user.id, email: user.email, handle: finalHandle })
        .select()
        .single()

      if (insertError) throw new AppError(insertError.message, 500)
      profile = newProfile
    }

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

  /**
   * Invalidates the user session in Supabase by signing out server-side.
   * Uses the user's own token to call signOut, which revokes the refresh token.
   */
  async logout(token) {
    try {
      const supabase = getSupabaseClient(token)
      await supabase.auth.signOut()
    } catch (err) {
      // Non-fatal: client-side token removal is the primary logout mechanism
      console.error('[logout] Supabase signOut failed (non-fatal):', err.message)
    }
  }
}

module.exports = new AuthService()
