/**
 * Unified logger utility with timestamp, severity levels, and structured output.
 */

const timestamp = () => new Date().toISOString()

const log = (level, message, data = null) => {
  const logEntry = {
    timestamp: timestamp(),
    level,
    message,
    ...(data && { data })
  }
  
  if (level === 'ERROR') {
    console.error(JSON.stringify(logEntry))
  } else {
    console.log(JSON.stringify(logEntry))
  }
}

const info = (message, data = null) => {
  log('INFO', message, data)
}

const warn = (message, data = null) => {
  log('WARN', message, data)
}

const error = (message, err = null) => {
  const errorData = err instanceof Error 
    ? { message: err.message, stack: err.stack }
    : err

  log('ERROR', message, errorData)
}

const debug = (message, data = null) => {
  if (process.env.DEBUG === 'true') {
    log('DEBUG', message, data)
  }
}

module.exports = { info, warn, error, debug, log }
