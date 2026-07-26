import { connectDB } from '@/lib/mongodb'
import Article from '@/lib/models/Article'

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function GET(req) {
  try {
    if (!process.env.MONGODB_URI) {
      return Response.json([])
    }

    await connectDB()

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'published'

    const query = status && status !== 'all' ? { status } : {}
    if (category) query.category = category

    const articles = await Article.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean()

    return Response.json(articles)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    if (!process.env.MONGODB_URI) {
      return Response.json({ error: 'MongoDB is not configured yet' }, { status: 503 })
    }

    await connectDB()

    const payload = await req.json()
    const { title, excerpt, content, category, author, tags, featuredImage, status = 'published' } = payload

    console.log('POST /api/articles payload:', payload)

    // Allow partial saves for drafts
    if (status !== 'draft') {
      if (!title || !excerpt || !content || !category || !author) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 })
      }
    }

    const article = await Article.create({
      title: title || '',
      slug: `${slugify(title || 'untitled')}-${Date.now()}`,
      excerpt: excerpt || '',
      content: content || '',
      category: category || 'news',
      author: author || 'admin',
      tags: Array.isArray(tags) ? tags : [],
      featuredImage: featuredImage || '',
      status,
    })

    return Response.json({ success: true, article })
  } catch (error) {
    console.error('POST /api/articles error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    if (!process.env.MONGODB_URI) {
      return Response.json({ error: 'MongoDB is not configured yet' }, { status: 503 })
    }

    await connectDB()

    const body = await req.json()
    const { id, status, ...updates } = body

    if (!id) {
      return Response.json({ error: 'Missing id' }, { status: 400 })
    }

    // If status is provided, include it in the update
    const updatePayload = { ...(updates || {}) }
    if (status) updatePayload.status = status

    const article = await Article.findByIdAndUpdate(id, updatePayload, { new: true })
    return Response.json({ success: true, article })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
