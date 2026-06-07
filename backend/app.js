require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const bookmarkRoutes = require('./routes/bookmarkRoutes')
const profileRoutes = require('./routes/profileRoutes')

const app = express()

// Global Middlewares
app.use(cors())
app.use(express.json())

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
  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message })
  }
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong on the server.' })
})

module.exports = app
