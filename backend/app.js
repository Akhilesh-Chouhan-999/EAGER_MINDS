require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const bookmarkRoutes = require('./routes/bookmarkRoutes')
const profileRoutes = require('./routes/profileRoutes')

const app = express()

// Security: Request size limit
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ limit: '1mb', extended: true }))

// Security: CORS with specific origin (configurable)
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS not allowed'))
    }
  },
  credentials: true
}))

// Security: Essential security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  next()
})

// Health check endpoint for load balancers
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Mount API Routes
app.use('/api/auth', authRoutes)
app.use('/api/bookmarks', bookmarkRoutes)
app.use('/api/profiles', profileRoutes)

// Fallback Route Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' })
})

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  // Handle our custom operational errors (AppError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message })
  }
  // Handle Supabase AuthApiError and PostgrestError (they have a `status` property)
  if (err.status && typeof err.status === 'number') {
    return res.status(err.status).json({ error: err.message })
  }
  // Unknown/unexpected errors - log and return generic 500
  console.error('[Unhandled Error]', err.stack || err)
  res.status(500).json({ error: 'Something went wrong on the server.' })
})

module.exports = app
