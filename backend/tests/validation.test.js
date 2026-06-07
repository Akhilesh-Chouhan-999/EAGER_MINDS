const { validateSignup, validateLogin, validateBookmark } = require('../middlewares/validation')

describe('Validation Middleware', () => {
  let req
  let res
  let next

  beforeEach(() => {
    req = { body: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    next = jest.fn()
  })

  describe('validateSignup', () => {
    it('should call next if validation passes', () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123',
        handle: 'my_handle'
      }

      validateSignup(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(res.status).not.toHaveBeenCalled()
    })

    it('should return 400 if email is missing', () => {
      req.body = {
        password: 'password123',
        handle: 'my_handle'
      }

      validateSignup(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Email is required.' })
      expect(next).not.toHaveBeenCalled()
    })

    it('should return 400 if email format is invalid', () => {
      req.body = {
        email: 'invalid-email',
        password: 'password123',
        handle: 'my_handle'
      }

      validateSignup(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email address format.' })
    })

    it('should return 400 if password is less than 6 chars', () => {
      req.body = {
        email: 'test@example.com',
        password: 'pass',
        handle: 'my_handle'
      }

      validateSignup(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Password must be at least 6 characters long.' })
    })

    it('should return 400 if handle has invalid characters', () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123',
        handle: 'invalid-handle!'
      }

      validateSignup(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Handle can only contain lowercase letters, numbers, and underscores.'
      })
    })

    it('should return 400 if handle is less than 3 characters', () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123',
        handle: 'hi'
      }

      validateSignup(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Handle must be at least 3 characters long.' })
    })
  })

  describe('validateLogin', () => {
    it('should call next if validation passes', () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      }

      validateLogin(req, res, next)

      expect(next).toHaveBeenCalled()
    })

    it('should return 400 if email is invalid', () => {
      req.body = {
        email: 'bad-email',
        password: 'password123'
      }

      validateLogin(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email address format.' })
    })

    it('should return 400 if password is missing', () => {
      req.body = {
        email: 'test@example.com'
      }

      validateLogin(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Password is required.' })
    })
  })

  describe('validateBookmark', () => {
    it('should call next if URL is valid', () => {
      req.body = { url: 'https://google.com' }

      validateBookmark(req, res, next)

      expect(next).toHaveBeenCalled()
    })

    it('should call next even if URL misses http prefix (since parser corrects it)', () => {
      req.body = { url: 'google.com' }

      validateBookmark(req, res, next)

      expect(next).toHaveBeenCalled()
    })

    it('should return 400 if URL is malformed', () => {
      req.body = { url: 'not a valid url' }

      validateBookmark(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid URL format.' })
    })
  })
})
