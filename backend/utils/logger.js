/**
 * Unified logger utility to format standard output messages.
 */

const info = (msg) => {
  console.log(`[INFO] ${new Date().toISOString()}: ${msg}`)
}

const error = (msg, err = '') => {
  console.error(`[ERROR] ${new Date().toISOString()}: ${msg}`, err)
}

module.exports = { info, error }
