const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { authenticateToken } = require('../middlewares/auth')
const { validateSignup, validateLogin } = require('../middlewares/validation')

router.post('/signup', validateSignup, authController.signup)
router.post('/login', validateLogin, authController.login)
router.get('/me', authenticateToken, authController.getMe)
router.get('/google', authController.googleLogin)

module.exports = router
