import { getArticleById } from '@/lib/articles'
import BackArrow from '../BackArrow'
import '../../styles/articles.css'

function formatDate(value) {
  if (!value) return 'Recently published'

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export default async function ArticleDetailPage({ params }) {
  const { id } = await params
  const article = await getArticleById(id)

  if (!article) {
    return (
      <section className="section-page">
        <div className="empty-state">
          <h2>Article not found</h2>
          <p>The article you're looking for doesn't exist.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section-page">
      <BackArrow href={`/${article.category}`} label={`Back to ${article.category}`} />

      <article className="article-detail">
        {article.featuredImage && (
          <div className="article-detail-image">
            <img src={article.featuredImage} alt={article.title} />
          </div>
        )}
        <div className="article-detail-header">
          <span className="article-category">{article.category}</span>
          <span className="article-date">{formatDate(article.publishedAt || article.createdAt)}</span>
        </div>
        
        <h1 className="article-detail-title">{article.title}</h1>
        <p className="article-detail-excerpt">{article.excerpt}</p>
        
        <div className="article-detail-content" dangerouslySetInnerHTML={{ __html: article.content }} />
        
        <div className="article-detail-footer">
          <div className="article-author">
            <span>By {article.author}</span>
          </div>
          {article.tags?.length ? (
            <div className="article-tags">
              {article.tags.map((tag) => (
                <span key={`${article._id}-${tag}`} className="article-tag">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </section>
  )
}
