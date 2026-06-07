const express = require('express')
const router = express.Router()
const bookmarkController = require('../controllers/bookmarkController')
const { authenticateToken } = require('../middlewares/auth')
const { validateBookmark } = require('../middlewares/validation')

router.use(authenticateToken) // All bookmark operations require a valid token

router.get('/', bookmarkController.getBookmarks)
router.post('/', validateBookmark, bookmarkController.addBookmark)
router.put('/:id', validateBookmark, bookmarkController.updateBookmark)
router.delete('/:id', bookmarkController.deleteBookmark)

module.exports = router
