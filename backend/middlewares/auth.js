/**
 * Authentication middleware to verify presence of a Bearer token
 * in the Authorization header.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token is required. Please log in.' })
  }

  req.token = token
  next()
}

module.exports = { authenticateToken }
