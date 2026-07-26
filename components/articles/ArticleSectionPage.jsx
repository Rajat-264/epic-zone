import { getPublishedArticles } from '@/lib/articles'
import Link from 'next/link'
import '../../styles/articles.css'

function formatDate(value) {
  if (!value) return 'Recently published'

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export default async function ArticleSectionPage({
  title,
  description,
  category,
  emptyMessage,
}) {
  const articles = await getPublishedArticles(category)

  return (
    <section className="section-page">
      <div className="section-hero">
        <p className="section-badge">{title}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      {articles.length === 0 ? (
        <div className="empty-state">
          <h2>No articles yet</h2>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="article-list">
          {articles.map((article) => (
            <Link key={article._id} href={`/${category}/${article._id}`} className="article-card-link">
              <article className="article-card">
                {article.featuredImage && (
                  <div className="article-image">
                    <img src={article.featuredImage} alt={article.title} />
                  </div>
                )}
                <div className="article-card-content">
                  <div className="article-card-top">
                    <span className="article-category">{article.category}</span>
                    <span className="article-date">{formatDate(article.publishedAt || article.createdAt)}</span>
                  </div>
                  <h2>{article.title}</h2>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <div className="article-footer">
                    <span>By {article.author}</span>
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
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
