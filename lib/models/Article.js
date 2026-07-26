import mongoose from 'mongoose'

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  excerpt: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['news', 'policy', 'finance', 'schemes', 'opportunities'],
  },
  author: { type: String, required: true, trim: true },
  tags: [String],
  featuredImage: String,
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published',
  },
  publishedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

ArticleSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  next()
})

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema)
