const { Resend } = require('resend')
const { getSupabaseClient } = require('../config/db')

// Helper to validate handle format
function validateHandle(handle) {
  const clean = handle.trim().toLowerCase()
  if (clean.length < 3) return 'Handle must be at least 3 characters long.'
  if (!/^[a-z0-9_]+$/.test(clean)) return 'Handle can only contain lowercase letters, numbers, and underscores.'
  return null
}

exports.signup = async (req, res) => {
  const { email, password, handle } = req.body

  if (!email || !password || !handle) {
    return res.status(400).json({ error: 'Email, password, and handle are required.' })
  }

  const cleanHandle = handle.trim().toLowerCase()
  const handleErr = validateHandle(cleanHandle)
  if (handleErr) {
    return res.status(400).json({ error: handleErr })
  }

  try {
    const supabase = getSupabaseClient()

    // 1. Check if handle is already taken in the public profiles table
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('handle')
      .eq('handle', cleanHandle)
      .maybeSingle()

    if (checkError) throw checkError
    if (existingProfile) {
      return res.status(400).json({ error: 'This @handle is already taken. Please choose another one.' })
    }

    // 2. Call Supabase Auth signup
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          handle: cleanHandle
        }
      }
    })

    if (signUpError) throw signUpError

    // 3. Send onboarding welcome email using Resend
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey && data.user) {
      try {
        const resend = new Resend(resendApiKey)
        await resend.emails.send({
          from: 'EagerMinds Bookmarks <onboarding@resend.dev>',
          to: email,
          subject: 'Welcome to EagerMinds Bookmarks!',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <h2 style="color: #2563eb;">Welcome to EagerMinds Bookmarks!</h2>
              <p>Hi there,</p>
              <p>Thank you for signing up for your personal bookmarks manager! Your handle is officially registered.</p>
              <p>Your public profile is set to be at @${cleanHandle}.</p>
              <p>If you haven't confirmed your email yet, please check your inbox for a verification email to activate your account.</p>
              <br/>
              <p>Best regards,<br/>The EagerMinds Team</p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('Failed to send onboarding email:', emailErr)
      }
    }

    const isConfirmed = data.user?.identities?.length === 0 || data.session !== null
    if (isConfirmed) {
      res.json({ success: true, session: data.session, user: data.user })
    } else {
      res.json({ success: true, message: 'Registration successful! Please check your email for verification.' })
    }

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    res.json({
      session: data.session,
      user: data.user
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.getMe = async (req, res) => {
  try {
    const supabase = getSupabaseClient(req.token)
    
    // Get authenticated user object from the token
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired session token.' })
    }

    // Get user profile matching user ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError

    res.json({ user, profile })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
