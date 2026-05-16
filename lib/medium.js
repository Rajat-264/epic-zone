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
    process.env.MEDIUM_PROFILE_URL ||
      process.env.NEXT_PUBLIC_MEDIUM_PROFILE_URL
  )
}

export function getMediumFeedUrl(
  profileUrl = getMediumProfileUrl()
) {
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

function extractThumbnail(value = '') {
  const mediaMatch = value.match(
    /<media:content[^>]*url="([^"]+)"/i
  )

  if (mediaMatch?.[1]) {
    return mediaMatch[1]
  }

  const imageMatch = value.match(
    /<img[^>]*src="([^"]+)"/i
  )

  return imageMatch?.[1] || null
}

function sortPostsByDate(posts) {
  return [...posts].sort((left, right) => {
    const leftDate = left.publishedAt
      ? new Date(left.publishedAt).getTime()
      : 0

    const rightDate = right.publishedAt
      ? new Date(right.publishedAt).getTime()
      : 0

    return rightDate - leftDate
  })
}

export function groupPostsByTopic(posts) {
  const grouped = new Map()

  posts.forEach((post) => {
    const topic = inferTopic(post)

    const current = grouped.get(topic) || []

    current.push({
      ...post,
      topic,
    })

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

    return TOPIC_RULES.some(
      (rule) =>
        rule.topic.toLowerCase() === normalized ||
        rule.keywords.includes(normalized)
    )
  })

  if (explicitCategory) {
    return (
      TOPIC_RULES.find((rule) => {
        const normalized = explicitCategory.toLowerCase()

        return (
          rule.topic.toLowerCase() === normalized ||
          rule.keywords.includes(normalized)
        )
      })?.topic || explicitCategory
    )
  }

  const matchedRule = TOPIC_RULES.find((rule) =>
    rule.keywords.some((keyword) =>
      post.searchableText.includes(keyword)
    )
  )

  if (matchedRule) {
    return matchedRule.topic
  }

  return post.categories?.[0] || 'Latest Stories'
}

export async function getMediumPosts(limit = 30) {
  const profileUrl = getMediumProfileUrl()

  const feedUrl = getMediumFeedUrl(profileUrl)

  try {
    console.log('[Medium] Fetching feed from:', feedUrl)

    // RSS to JSON proxy
    const rss2jsonUrl =
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`

    const response = await fetch(rss2jsonUrl, {
      headers: {
        Accept: 'application/json',
      },

      cache: 'no-store',

      next: {
        revalidate: 1800,
      },
    })

    console.log(
      '[Medium] Response status:',
      response.status
    )

    if (!response.ok) {
      throw new Error(
        `RSS proxy failed with status ${response.status}`
      )
    }

    const data = await response.json()

    if (data.status !== 'ok') {
      throw new Error(
        data.message || 'Invalid RSS response'
      )
    }

    const posts = (data.items || [])
      .map((item, index) => {
        const categories = item.categories || []

        const searchableText = [
          item.title || '',
          item.description || '',
          categories.join(' '),
        ]
          .join(' ')
          .toLowerCase()

        return {
          id:
            item.guid ||
            item.link ||
            `${item.title}-${index}`,

          title: stripHtml(item.title || ''),

          summary: truncate(
            stripHtml(item.description || ''),
            220
          ),

          link: item.link,

          thumbnail:
            item.thumbnail ||
            extractThumbnail(item.description || ''),

          publishedAt: item.pubDate || null,

          categories,

          searchableText,
        }
      })
      .filter((post) => post.title && post.link)

    const sortedPosts = sortPostsByDate(posts)
      .map((post) => ({
        ...post,
        topic: inferTopic(post),
      }))
      .slice(0, limit)

    const topicGroups = groupPostsByTopic(sortedPosts)

    console.log(
      '[Medium] Parsed posts:',
      sortedPosts.length
    )

    return {
      ok: true,
      profileUrl,
      feedUrl,
      posts: sortedPosts,
      topicGroups,
    }
  } catch (error) {
    console.error('[Medium] Fetch error:', {
      message: error?.message,
      fullError: error,
    })

    return {
      ok: false,
      error:
        error?.message ||
        'Failed to fetch Medium feed',

      profileUrl,
      feedUrl,
      posts: [],
      topicGroups: [],
    }
  }
}