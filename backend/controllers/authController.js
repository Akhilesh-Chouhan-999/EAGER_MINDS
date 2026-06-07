const { Resend } = require('resend')
const { getSupabaseClient } = require('../config/db')
const asyncHandler = require('../utils/asyncHandler')

// 1. Signup Route
exports.signup = asyncHandler(async (req, res) => {
  const { email, password, handle } = req.body
  const cleanHandle = handle.trim().toLowerCase()

  const supabase = getSupabaseClient()

  // Pre-check if handle is already taken in profiles table
  const { data: existingProfile, error: checkError } = await supabase
    .from('profiles')
    .select('handle')
    .eq('handle', cleanHandle)
    .maybeSingle()

  if (checkError) throw checkError
  if (existingProfile) {
    return res.status(400).json({ error: 'This @handle is already taken. Please choose another one.' })
  }

  // Call Supabase Auth signup
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

  // Send onboarding welcome email using Resend
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
            <p>Your public profile will be available at @${cleanHandle}.</p>
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
})

// 2. Login Route
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

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
})

// 3. Get User Details
exports.getMe = asyncHandler(async (req, res) => {
  const supabase = getSupabaseClient(req.token)
  
  // Get authenticated user object
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid or expired session token.' })
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) throw profileError

  res.json({ user, profile })
})
