const cleanHtmlText = (text) => 
  text
    ? text
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .trim()
    : ''

const extractMeta = (html, propertyOrName) => {
  const regex = new RegExp(
    `<meta\\s+(?:[^>]*?\\s+)?(?:property|name)=["']${propertyOrName}["']\\s+(?:[^>]*?\\s+)?content=["']([^"']*)["']`,
    'i'
  )
  const match = html.match(regex)
  if (match) return cleanHtmlText(match[1])

  // Try standard alternative parameter order (content first)
  const regexReverse = new RegExp(
    `<meta\\s+(?:[^>]*?\\s+)?content=["']([^"']*)["']\\s+(?:[^>]*?\\s+)?(?:property|name)=["']${propertyOrName}["']`,
    'i'
  )
  const matchReverse = html.match(regexReverse)
  return matchReverse ? cleanHtmlText(matchReverse[1]) : null
}

const extractTitle = (html) => {
  const match = html.match(/<title>([^<]*)<\/title>/i)
  return match ? cleanHtmlText(match[1]) : null
}

const extractFavicon = (html, baseUrl) => {
  const regex = /<link\s+[^>]*?rel=["'](?:shortcut\s+)?icon["'][^>]*?href=["']([^"']*)["']/i
  const match = html.match(regex)
  if (!match) return null

  const href = match[1].trim()
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return href
  }

  try {
    const url = new URL(baseUrl)
    if (href.startsWith('//')) {
      return `${url.protocol}${href}`
    }
    if (href.startsWith('/')) {
      return `${url.origin}${href}`
    }
    return `${url.origin}/${href}`
  } catch {
    return null
  }
}

/**
 * Scrapes metadata (title, description, faviconUrl) from a URL.
 * Designed with functional composition and timeout safeguards.
 */
const scrapeMetadata = async (url) => {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(3000), // Timeout after 3 seconds
    })

    if (!response.ok) {
      throw new Error(`Response status code: ${response.status}`)
    }

    let html = ''
    if (response.body && typeof response.body.getReader === 'function') {
      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let done = false
      const maxBytes = 128 * 1024 // 128KB limit
      let bytesRead = 0

      while (!done && bytesRead < maxBytes) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          bytesRead += value.length
          html += decoder.decode(value, { stream: !done })
          if (html.toLowerCase().includes('</head>')) {
            break
          }
        }
      }
      if (!done) {
        try {
          await reader.cancel()
        } catch (err) {
          // ignore stream cancellation error
        }
      }
    } else {
      html = await response.text()
    }
    const parsedTitle = extractMeta(html, 'og:title') || extractTitle(html)
    const description = extractMeta(html, 'og:description') || extractMeta(html, 'description') || ''
    const faviconUrl = extractFavicon(html, url) || `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`

    return {
      title: parsedTitle ? parsedTitle.trim() : null,
      description: description.trim(),
      faviconUrl,
    }
  } catch (error) {
    console.error(`Metadata scraping failed for ${url}:`, error.message)
    // Functional fallback based on URL structure
    try {
      const hostname = new URL(url).hostname
      return {
        title: hostname,
        description: '',
        faviconUrl: `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`,
      }
    } catch {
      return {
        title: 'New Bookmark',
        description: '',
        faviconUrl: null,
      }
    }
  }
}

module.exports = { scrapeMetadata }
