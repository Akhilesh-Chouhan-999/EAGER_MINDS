const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profileController')

router.get('/:handle', profileController.getPublicProfile)

module.exports = router
