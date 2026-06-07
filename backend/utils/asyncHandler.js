/**
 * A functional wrapper that catches errors in asynchronous Express route handlers
 * and forwards them to the global error handling middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = asyncHandler
