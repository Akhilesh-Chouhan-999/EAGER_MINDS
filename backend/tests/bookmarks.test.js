const request = require('supertest')
const app = require('../app')
const { getSupabaseClient } = require('../config/db')
const { scrapeMetadata } = require('../utils/metadataScraper')

// Mock config/db and utils/metadataScraper
jest.mock('../config/db')
jest.mock('../utils/metadataScraper')

describe('Bookmarks API Routes', () => {
  let mockSupabase

  beforeEach(() => {
    jest.clearAllMocks()

    mockSupabase = {
      auth: {
        getUser: jest.fn()
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn()
    }

    getSupabaseClient.mockReturnValue(mockSupabase)

    // Default authenticated user mock
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user_123' } },
      error: null
    })
  })

  describe('GET /api/bookmarks', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/api/bookmarks')
      expect(res.status).toBe(401)
    })

    it('should return a list of bookmarks belonging to the user', async () => {
      const mockBookmarks = [
        { id: '1', title: 'Bookmark 1', url: 'https://site1.com', user_id: 'user_123' },
        { id: '2', title: 'Bookmark 2', url: 'https://site2.com', user_id: 'user_123' }
      ]

      mockSupabase.order.mockResolvedValue({
        data: mockBookmarks,
        error: null
      })

      const res = await request(app)
        .get('/api/bookmarks')
        .set('Authorization', 'Bearer valid_jwt')

      expect(res.status).toBe(200)
      expect(res.body).toEqual(mockBookmarks)
      expect(mockSupabase.from).toHaveBeenCalledWith('bookmarks')
    })
  })

  describe('POST /api/bookmarks', () => {
    it('should create a new bookmark with scraped metadata', async () => {
      const mockScrapedData = {
        title: 'Scraped Website Title',
        description: 'Scraped Website Description',
        faviconUrl: 'https://site.com/favicon.png'
      }
      scrapeMetadata.mockResolvedValue(mockScrapedData)

      const mockInsertedBookmark = {
        id: 'new_bookmark_id',
        user_id: 'user_123',
        title: 'Scraped Website Title',
        url: 'https://site.com',
        description: mockScrapedData.description,
        favicon_url: mockScrapedData.faviconUrl,
        is_public: false
      }

      mockSupabase.single.mockResolvedValue({
        data: mockInsertedBookmark,
        error: null
      })

      const res = await request(app)
        .post('/api/bookmarks')
        .set('Authorization', 'Bearer valid_jwt')
        .send({ url: 'site.com' }) // Validation checks formats and sanitizes it

      expect(res.status).toBe(200)
      expect(res.body.id).toBe('new_bookmark_id')
      expect(res.body.url).toBe('https://site.com')
      expect(scrapeMetadata).toHaveBeenCalledWith('https://site.com')
      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user_123',
          url: 'https://site.com',
          description: mockScrapedData.description
        })
      )
    })
  })

  describe('PUT /api/bookmarks/:id', () => {
    it('should update and return success', async () => {
      scrapeMetadata.mockResolvedValue({
        title: 'Updated Title',
        description: 'Updated Desc',
        faviconUrl: 'https://site.com/fav.png'
      })

      mockSupabase.eq.mockResolvedValue({
        error: null
      })

      const res = await request(app)
        .put('/api/bookmarks/123')
        .set('Authorization', 'Bearer valid_jwt')
        .send({ url: 'https://site.com', title: 'User Updated Title', isPublic: true })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(mockSupabase.update).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'User Updated Title',
          url: 'https://site.com',
          is_public: true
        })
      )
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '123')
    })
  })

  describe('DELETE /api/bookmarks/:id', () => {
    it('should delete a bookmark and return success', async () => {
      mockSupabase.eq.mockResolvedValue({
        error: null
      })

      const res = await request(app)
        .delete('/api/bookmarks/123')
        .set('Authorization', 'Bearer valid_jwt')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(mockSupabase.delete).toHaveBeenCalled()
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '123')
    })
  })
})
