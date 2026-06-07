const { getSupabaseClient } = require('../config/db')
const asyncHandler = require('../utils/asyncHandler')
const { sendWelcomeEmail } = require('../utils/emailService')
const responseHelper = require('../utils/response')

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
    return responseHelper.error(res, 'This @handle is already taken. Please choose another one.', 400)
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

  // Send onboarding welcome email using our dedicated email service
  if (data.user) {
    await sendWelcomeEmail(email, cleanHandle)
  }

  const isConfirmed = data.user?.identities?.length === 0 || data.session !== null
  if (isConfirmed) {
    return responseHelper.success(res, { success: true, session: data.session, user: data.user })
  } else {
    return responseHelper.success(res, { success: true, message: 'Registration successful! Please check your email for verification.' })
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
