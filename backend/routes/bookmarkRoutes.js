const express = require('express')
const router = express.Router()
const bookmarkController = require('../controllers/bookmarkController')
const { authenticateToken } = require('../middlewares/auth')

router.use(authenticateToken) // All bookmark operations require a valid token

router.get('/', bookmarkController.getBookmarks)
router.post('/', bookmarkController.addBookmark)
router.put('/:id', bookmarkController.updateBookmark)
router.delete('/:id', bookmarkController.deleteBookmark)

module.exports = router
