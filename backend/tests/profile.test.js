const request = require('supertest')
const app = require('../app')
const { getSupabaseClient } = require('../config/db')

jest.mock('../config/db')

describe('Public Profile API Routes', () => {
  let mockSupabase

  beforeEach(() => {
    jest.clearAllMocks()

    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn()
    }

    getSupabaseClient.mockReturnValue(mockSupabase)
  })

  describe('GET /api/profiles/:handle', () => {
    it('should return 404 if handle is a reserved routing keyword', async () => {
      const res = await request(app).get('/api/profiles/dashboard')

      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Profile not found.')
    })

    it('should return 404 if profile does not exist in the database', async () => {
      mockSupabase.maybeSingle.mockResolvedValue({
        data: null,
        error: null
      })

      const res = await request(app).get('/api/profiles/nonexistent_user')

      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Profile not found.')
    })

    it('should return user profile and only public bookmarks if profile is found', async () => {
      const mockProfile = { id: 'user_123', handle: 'valid_user', email: 'user@example.com' }
      const mockPublicBookmarks = [
        { id: '1', title: 'Public Link', url: 'https://site.com', is_public: true, user_id: 'user_123' }
      ]

      // First query finds the profile
      mockSupabase.maybeSingle.mockResolvedValue({
        data: mockProfile,
        error: null
      })

      // Second query retrieves bookmarks (order is called last)
      mockSupabase.order.mockResolvedValue({
        data: mockPublicBookmarks,
        error: null
      })

      const res = await request(app).get('/api/profiles/valid_user')

      expect(res.status).toBe(200)
      expect(res.body.profile).toEqual(mockProfile)
      expect(res.body.bookmarks).toEqual(mockPublicBookmarks)

      // Ensure it queried bookmarks with user_id matching profile id AND is_public = true
      expect(mockSupabase.eq).toHaveBeenCalledWith('handle', 'valid_user')
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user_123')
      expect(mockSupabase.eq).toHaveBeenCalledWith('is_public', true)
    })
  })
})
