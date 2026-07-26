"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import '../../styles/admin-articles.css'

export default function AdminDashboardClient() {
  const router = useRouter()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('')

  const fetchArticles = async () => {
    setLoading(true)
    const res = await fetch('/api/articles?status=all')
    const data = await res.json()
    setArticles(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const openArticle = (article) => {
    setSelected(article)
  }

  const publishArticle = async (id) => {
    const res = await fetch('/api/articles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'published' }),
    })
    if (res.ok) {
      setMessage('Article published')
      fetchArticles()
      setSelected(null)
    } else {
      const data = await res.json()
      setMessage(data.error || 'Unable to publish')
    }
  }

  return (
    <section className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="muted">Manage articles and drafts.</p>
        </div>
        <div className="admin-actions">
          <Link href="/admin/articles" className="submit-btn">New Article</Link>
          </div>
        </header>

        {message ? <p className="notice">{message}</p> : null}

        <div className="admin-columns">
          <aside className="article-list">
            <h2>All Articles</h2>
            {loading ? (
              <p>Loading…</p>
            ) : articles.length === 0 ? (
              <p className="muted">No articles yet.</p>
            ) : (
              <div className="admin-list">
                {articles.map((article) => (
                  <div key={article._id} className="admin-article-card" onClick={() => openArticle(article)} style={{ cursor: 'pointer' }}>
                    <h3>{article.title || 'Untitled'}</h3>
                    <p className="muted small">{article.excerpt}</p>
                    <div className="article-meta">
                      <span className={`status-pill ${article.status}`}>{article.status}</span>
                      <span className="muted">{article.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>

          <main className="article-details">
            <h2>Article Details</h2>
            {selected ? (
              <div className="details-card">
                <h3>{selected.title}</h3>
                {selected.featuredImage && (
                  <div className="details-image">
                    <img src={selected.featuredImage} alt="Featured" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }} />
                  </div>
                )}
                <p><strong>Author:</strong> {selected.author || '—'}</p>
                <p><strong>Category:</strong> {selected.category}</p>
                <p><strong>Tags:</strong> {(selected.tags || []).join(', ')}</p>
                <div className="details-content" dangerouslySetInnerHTML={{ __html: selected.content || '<p><em>No content</em></p>' }} />
                <div className="details-actions">
                  <button onClick={() => router.push(`/admin/articles?id=${selected._id}`)} className="submit-btn">Edit</button>
                  {selected.status === 'draft' && (
                    <button onClick={() => publishArticle(selected._id)} className="submit-btn">Publish</button>
                  )}
                  <button onClick={() => setSelected(null)} className="toggle-btn">Close</button>
                </div>
              </div>
            ) : (
              <p className="muted">Select an article to view its content.</p>
            )}
          </main>
        </div>
      </section>
    )
  }
