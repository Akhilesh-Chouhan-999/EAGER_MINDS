const request = require('supertest')
const app = require('../app')
const { getSupabaseClient } = require('../config/db')

// Mock the Supabase client connection function
jest.mock('../config/db')

describe('Auth API Routes', () => {
  let mockSupabase

  beforeEach(() => {
    jest.clearAllMocks()

    // Base mock structure for database calls
    mockSupabase = {
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
        getUser: jest.fn(),
        signOut: jest.fn().mockResolvedValue({ error: null })
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(),
      single: jest.fn()
    }

    getSupabaseClient.mockReturnValue(mockSupabase)
  })

  describe('POST /api/auth/signup', () => {
    it('should return 400 if validation fails (missing fields)', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com' })

      expect(res.status).toBe(400)
      expect(res.body.error).toBeDefined()
    })

    it('should return 400 if the handle is already taken', async () => {
      // Mock db pre-check finding an existing profile
      mockSupabase.maybeSingle.mockResolvedValue({
        data: { handle: 'taken_handle' },
        error: null
      })

      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123',
          handle: 'taken_handle'
        })

      expect(res.status).toBe(400)
      expect(res.body.error).toBe('This @handle is already taken. Please choose another one.')
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
    })

    it('should register successfully if handle is available', async () => {
      // Mock db pre-check finding no profile (null)
      mockSupabase.maybeSingle.mockResolvedValue({
        data: null,
        error: null
      })

      // Mock Supabase Auth signup response
      mockSupabase.auth.signUp.mockResolvedValue({
        data: {
          user: { id: 'user_123', email: 'test@example.com' },
          session: null
        },
        error: null
      })

      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123',
          handle: 'new_handle'
        })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.message).toContain('Registration successful!')
      expect(mockSupabase.auth.signUp).toHaveBeenCalled()
    })
  })

  describe('POST /api/auth/login', () => {
    it('should return session and user details on successful authentication', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: {
          session: { access_token: 'fake_jwt_token' },
          user: { id: 'user_123', email: 'test@example.com' }
        },
        error: null
      })

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })

      expect(res.status).toBe(200)
      expect(res.body.session.access_token).toBe('fake_jwt_token')
      expect(res.body.user.id).toBe('user_123')
    })
  })

  describe('GET /api/auth/me', () => {
    it('should return 401 if Authorization header is missing', async () => {
      const res = await request(app).get('/api/auth/me')

      expect(res.status).toBe(401)
      expect(res.body.error).toBe('Access token is required. Please log in.')
    })

    it('should return user details and profile on valid token', async () => {
      // Mock user identification from auth header token
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user_123', email: 'test@example.com' } },
        error: null
      })

      // Mock profile fetch matching the authenticated user ID (uses maybeSingle internally)
      mockSupabase.maybeSingle.mockResolvedValue({
        data: { id: 'user_123', handle: 'my_handle', email: 'test@example.com' },
        error: null
      })

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer valid_jwt')

      expect(res.status).toBe(200)
      expect(res.body.user.id).toBe('user_123')
      expect(res.body.profile.handle).toBe('my_handle')
    })
  })

  describe('GET /api/auth/google', () => {
    it('should return Google OAuth redirect URL', async () => {
      mockSupabase.auth.signInWithOAuth = jest.fn().mockResolvedValue({
        data: { url: 'https://ggcqzqnsqbjkzqdnqpaj.supabase.co/auth/v1/authorize?provider=google' },
        error: null
      })

      const res = await request(app).get('/api/auth/google')

      expect(res.status).toBe(200)
      expect(res.body.url).toBe('https://ggcqzqnsqbjkzqdnqpaj.supabase.co/auth/v1/authorize?provider=google')
    })
  })

  describe('POST /api/auth/logout', () => {
    it('should return 401 if Authorization header is missing', async () => {
      const res = await request(app).post('/api/auth/logout')
      expect(res.status).toBe(401)
    })

    it('should return success and sign out on valid token', async () => {
      mockSupabase.auth.signOut = jest.fn().mockResolvedValue({ error: null })

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer valid_jwt')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
    })
  })
})

