import { connectDB } from '@/lib/mongodb'
import Article from '@/lib/models/Article'

export async function getPublishedArticles(category) {
  if (!process.env.MONGODB_URI) {
    return []
  }

  await connectDB()

  const query = { status: 'published' }
  if (category) {
    query.category = category
  }

  return Article.find(query)
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean()
}

export async function getArticleById(id) {
  if (!process.env.MONGODB_URI) {
    return null
  }

  await connectDB()

  return Article.findById(id).lean()
}
