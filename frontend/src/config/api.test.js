import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiFetch, API_BASE_URL } from './api'

class LocalStorageMock {
  constructor() {
    this.store = {}
  }
  clear() {
    this.store = {}
  }
  getItem(key) {
    return this.store[key] || null
  }
  setItem(key, value) {
    this.store[key] = String(value)
  }
  removeItem(key) {
    delete this.store[key]
  }
}

vi.stubGlobal('localStorage', new LocalStorageMock())

describe('apiFetch client utility', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('should call fetch with path appended to API_BASE_URL', async () => {
    const mockResponse = { success: true }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await apiFetch('/test-route')

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/test-route`, expect.objectContaining({
      headers: expect.objectContaining({
        'Content-Type': 'application/json'
      })
    }))
    expect(result).toEqual(mockResponse)
  })

  it('should inject Authorization Bearer header if token is in localStorage', async () => {
    localStorage.setItem('token', 'sample_auth_token')
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({})
    })
    vi.stubGlobal('fetch', fetchMock)

    await apiFetch('/private-route')

    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      headers: expect.objectContaining({
        'Authorization': 'Bearer sample_auth_token'
      })
    }))
  })

  it('should throw error with server message if the request is not ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Server authentication failed' })
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(apiFetch('/secure')).rejects.toThrow('Server authentication failed')
  })
})
