const authService = require('../services/authService')
const responseHelper = require('../utils/response')
const asyncHandler = require('../utils/asyncHandler')

/**
 * Controller to route authentication endpoints.
 */
// 1. Signup Route
exports.signup = asyncHandler(async (req, res) => {
  const { email, password, handle } = req.body
  const data = await authService.signup(email, password, handle)

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
  const data = await authService.login(email, password)
  return responseHelper.success(res, {
    session: data.session,
    user: data.user
  })
})

// 3. Get Authenticated User Profile Route
exports.getMe = asyncHandler(async (req, res) => {
  const data = await authService.getMe(req.token)
  return responseHelper.success(res, data)
})
