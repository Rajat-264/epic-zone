const DEFAULT_MEDIUM_PROFILE_URL = 'https://medium.com/@praagati'
const TOPIC_RULES = [
  {
    topic: 'Politics',
    keywords: ['politics', 'political', 'government', 'election', 'policy', 'democracy'],
  },
  {
    topic: 'Shivaji Maharaj',
    keywords: ['shivaji', 'maharaj', 'maratha', 'fort', 'swarajya'],
  },
  {
    topic: 'History',
    keywords: ['history', 'historical', 'civilization', 'empire', 'past', 'heritage'],
  },
  {
    topic: 'Scientists & Researchers',
    keywords: ['scientist', 'science', 'research', 'researcher', 'discovery', 'innovation'],
  },
  {
    topic: 'Podcasts',
    keywords: ['podcast', 'episode', 'listened', 'audio conversation'],
  },
  {
    topic: 'POVs',
    keywords: ['pov', 'opinion', 'perspective', 'society', 'culture'],
  },
  {
    topic: 'Mindset & Growth',
    keywords: ['mindset', 'growth', 'motivation', 'healing', 'rest', 'mental', 'calm', 'life'],
  },
]

function normalizeMediumProfileUrl(value) {
  if (!value) {
    return DEFAULT_MEDIUM_PROFILE_URL
  }

  const trimmed = value.trim()

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.replace(/\/$/, '')
  }

  if (trimmed.startsWith('@')) {
    return `https://medium.com/${trimmed}`
  }

  return `https://medium.com/@${trimmed.replace(/^@/, '')}`
}

export function getMediumProfileUrl() {
  return normalizeMediumProfileUrl(
    process.env.MEDIUM_PROFILE_URL || process.env.NEXT_PUBLIC_MEDIUM_PROFILE_URL
  )
}

export function getMediumFeedUrl(profileUrl = getMediumProfileUrl()) {
  const normalizedUrl = normalizeMediumProfileUrl(profileUrl)
  const url = new URL(normalizedUrl)

  if (url.pathname.startsWith('/feed/')) {
    return normalizedUrl
  }

  if (url.hostname.endsWith('.medium.com') && url.pathname === '/') {
    return `${url.origin}/feed`
  }

  return `${url.origin}/feed${url.pathname}`
}

function decodeXml(value = '') {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function stripHtml(value = '') {
  return decodeXml(value)
    .replace(/<figure[\s\S]*?<\/figure>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(value, maxLength = 180) {
  if (!value || value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength).trimEnd()}...`
}

function extractTagValue(block, tagName) {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'i')
  return block.match(regex)?.[1]?.trim() || ''
}

function extractThumbnail(block) {
  const mediaMatch = block.match(/<media:content[^>]*url="([^"]+)"/i)
  if (mediaMatch?.[1]) {
    return mediaMatch[1]
  }

  const imageMatch = block.match(/<img[^>]*src="([^"]+)"/i)
  return imageMatch?.[1] || null
}

function extractTagValues(block, tagName) {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'gi')
  return Array.from(block.matchAll(regex))
    .map((match) => stripHtml(match[1] || ''))
    .filter(Boolean)
}

function parseMediumFeed(xml) {
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/gi) || []

  return itemMatches.map((item, index) => {
    const title = stripHtml(extractTagValue(item, 'title'))
    const link = decodeXml(extractTagValue(item, 'link'))
    const pubDate = extractTagValue(item, 'pubDate')
    const descriptionHtml = extractTagValue(item, 'description')
    const encodedHtml = extractTagValue(item, 'content:encoded')
    const summarySource = encodedHtml || descriptionHtml
    const summary = truncate(stripHtml(summarySource), 220)
    const thumbnail = extractThumbnail(encodedHtml || descriptionHtml || item)
    const categories = extractTagValues(item, 'category')

    const searchableText = [title, summary, categories.join(' ')].join(' ').toLowerCase()

    return {
      id: extractTagValue(item, 'guid') || link || `${title}-${index}`,
      title,
      summary,
      link,
      thumbnail,
      publishedAt: pubDate || null,
      categories,
      searchableText,
    }
  })
}

function sortPostsByDate(posts) {
  return [...posts].sort((left, right) => {
    const leftDate = left.publishedAt ? new Date(left.publishedAt).getTime() : 0
    const rightDate = right.publishedAt ? new Date(right.publishedAt).getTime() : 0
    return rightDate - leftDate
  })
}

export function groupPostsByTopic(posts) {
  const grouped = new Map()

  posts.forEach((post) => {
    const topic = inferTopic(post)
    const current = grouped.get(topic) || []
    current.push({ ...post, topic })
    grouped.set(topic, current)
  })

  return Array.from(grouped.entries())
    .map(([topic, topicPosts]) => ({
      topic,
      posts: sortPostsByDate(topicPosts),
    }))
    .sort((left, right) => right.posts.length - left.posts.length)
}

function inferTopic(post) {
  const explicitCategory = post.categories?.find((category) => {
    const normalized = category.toLowerCase()
    return TOPIC_RULES.some((rule) =>
      rule.topic.toLowerCase() === normalized ||
      rule.keywords.includes(normalized)
    )
  })

  if (explicitCategory) {
    return TOPIC_RULES.find((rule) => {
      const normalized = explicitCategory.toLowerCase()
      return rule.topic.toLowerCase() === normalized || rule.keywords.includes(normalized)
    })?.topic || explicitCategory
  }

  const matchedRule = TOPIC_RULES.find((rule) =>
    rule.keywords.some((keyword) => post.searchableText.includes(keyword))
  )

  if (matchedRule) {
    return matchedRule.topic
  }

  return post.categories?.[0] || 'Latest Stories'
}

export async function getMediumPosts(limit = 30) {
  const profileUrl = getMediumProfileUrl()
  const feedUrl = getMediumFeedUrl(profileUrl)
  const abortController = new AbortController()
  const timeoutId = setTimeout(() => abortController.abort(), 9000)

  try {
    const response = await fetch(feedUrl, {
      next: { revalidate: 1800 },
      signal: abortController.signal,
      headers: {
        Accept: 'application/rss+xml, application/xml, text/xml',
        // Medium sometimes rejects requests without a UA. This is server-side.
        'User-Agent': 'Mozilla/5.0 (compatible; EpicZone/1.0; +https://medium.com)',
      },
    })

    if (!response.ok) {
      return {
        ok: false,
        error: `Medium feed request failed: ${response.status}`,
        profileUrl,
        feedUrl,
        posts: [],
        topicGroups: [],
      }
    }

    const xml = await response.text()
    const posts = sortPostsByDate(
      parseMediumFeed(xml).filter((post) => post.title && post.link)
    ).slice(0, limit)
    const topicGroups = groupPostsByTopic(posts)

    return {
      ok: true,
      profileUrl,
      feedUrl,
      posts,
      topicGroups,
    }
  } catch (error) {
    const message = error?.cause?.message || error?.message || 'fetch failed'
    return {
      ok: false,
      error: `Medium feed fetch error: ${message}`,
      profileUrl,
      feedUrl,
      posts: [],
      topicGroups: [],
    }
  } finally {
    clearTimeout(timeoutId)
  }
}
