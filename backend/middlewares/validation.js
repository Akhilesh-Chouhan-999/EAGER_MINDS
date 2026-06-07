/**
 * Input validation middlewares for authentication and bookmarks.
 */

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return 'Email is required.'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) return 'Invalid email address format.'
  return null
}

const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return 'Password is required.'
  if (password.length < 6) return 'Password must be at least 6 characters long.'
  return null
}

const validateHandle = (handle) => {
  if (!handle || typeof handle !== 'string') return 'Handle is required.'
  const clean = handle.trim().toLowerCase()
  if (clean.length < 3) return 'Handle must be at least 3 characters long.'
  if (!/^[a-z0-9_]+$/.test(clean)) {
    return 'Handle can only contain lowercase letters, numbers, and underscores.'
  }
  return null
}

const validateUrl = (url) => {
  if (!url || typeof url !== 'string') return 'URL is required.'
  try {
    const trimmed = url.trim()
    const formatted = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    new URL(formatted)
  } catch (err) {
    return 'Invalid URL format.'
  }
  return null
}

exports.validateSignup = (req, res, next) => {
  const { email, password, handle } = req.body

  const emailErr = validateEmail(email)
  if (emailErr) return res.status(400).json({ error: emailErr })

  const passErr = validatePassword(password)
  if (passErr) return res.status(400).json({ error: passErr })

  const handleErr = validateHandle(handle)
  if (handleErr) return res.status(400).json({ error: handleErr })

  next()
}

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body

  const emailErr = validateEmail(email)
  if (emailErr) return res.status(400).json({ error: emailErr })

  if (!password) {
    return res.status(400).json({ error: 'Password is required.' })
  }

  next()
}

exports.validateBookmark = (req, res, next) => {
  const { url } = req.body

  const urlErr = validateUrl(url)
  if (urlErr) return res.status(400).json({ error: urlErr })

  next()
}
