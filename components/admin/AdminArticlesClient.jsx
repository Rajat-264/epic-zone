"use client"

import { useEffect, useState } from 'react'
import '../../styles/admin-articles.css'
import AdminEditor from './AdminEditor'

const categories = ['news', 'policy', 'finance', 'schemes', 'opportunities']

const initialForm = {
  title: '',
  excerpt: '',
  content: '',
  category: 'news',
  author: '',
  tags: '',
  featuredImage: '',
  status: 'published',
}

export default function AdminArticlesClient({ articleId }) {
  const [form, setForm] = useState(initialForm)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [draftId, setDraftId] = useState(null)
  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

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

  useEffect(() => {
    if (articleId) {
      loadArticle(articleId)
    }
  }, [articleId])

  const loadArticle = async (id) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/articles?status=all`)
      const data = await res.json()
      const article = Array.isArray(data) ? data.find(a => a._id === id) : null
      
      if (article) {
        setForm({
          title: article.title || '',
          excerpt: article.excerpt || '',
          content: article.content || '',
          category: article.category || 'news',
          author: article.author || '',
          tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
          featuredImage: article.featuredImage || '',
          status: article.status || 'published',
        })
        setDraftId(article._id)
        setIsEditing(true)
      } else {
        setMessage('Article not found')
      }
    } catch (err) {
      setMessage('Failed to load article')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm(initialForm)
    setDraftId(null)
    setIsEditing(false)
    setMessage('')
  }

  // mark dirty when form changes
  useEffect(() => {
    setDirty(true)
  }, [form.title, form.excerpt, form.content, form.category, form.author, form.tags, form.featuredImage, form.status])

  // autosave after 3s of inactivity
  useEffect(() => {
    if (!dirty) return
    const t = setTimeout(() => {
      autosaveDraft()
    }, 3000)

    return () => clearTimeout(t)
  }, [form, dirty])

  const autosaveDraft = async () => {
    try {
      setSaving(true)
      setMessage('')

      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        status: 'draft',
      }

      if (draftId) {
        const res = await fetch('/api/articles', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: draftId, ...payload }),
        })

        if (res.ok) {
          setMessage('Draft auto-saved')
          setLastSavedAt(Date.now())
          setDirty(false)
        }
      } else {
        const res = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await res.json()
        if (res.ok && data.article) {
          setDraftId(data.article._id)
          setMessage('Draft auto-saved')
          setLastSavedAt(Date.now())
          setDirty(false)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const getPlainText = (html) => {
    if (!html) return ''
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  const wordCount = () => {
    const text = getPlainText(form.content).trim()
    if (!text) return 0
    return text.split(/\s+/).length
  }

  const charCount = () => {
    return getPlainText(form.content).length
  }

  const readTime = () => {
    const w = wordCount()
    return Math.max(1, Math.ceil(w / 200))
  }

  const clearContent = () => setForm({ ...form, content: '' })

  const insertTemplate = () => {
    const template = '<h2>Intro</h2><p>Write an engaging intro here...</p><h3>Details</h3><p>Expand with facts and sources.</p>'
    setForm({ ...form, content: template })
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file size (max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      setMessage('Image size must be less than 3MB')
      return
    }

    // Check file类型
    if (!file.type.startsWith('image/')) {
      setMessage('Please upload an image file')
      return
    }

    setImageUploading(true)
    setMessage('')

    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        setForm({ ...form, featuredImage: base64String })
        setImageUploading(false)
        setMessage('Image uploaded successfully')
      }
      reader.onerror = () => {
        setMessage('Failed to upload image')
        setImageUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setMessage('Failed to upload image')
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        status: 'published',
      }

      if (draftId) {
        const res = await fetch('/api/articles', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: draftId, ...payload }),
        })

        const data = await res.json()
        if (!res.ok) {
          setMessage(data.error || 'Unable to publish article')
          return
        }
      } else {
        const res = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await res.json()
        if (!res.ok) {
          setMessage(data.error || 'Unable to publish article')
          return
        }
      }

      setMessage(isEditing ? 'Article updated successfully' : 'Article published successfully')
      setForm(initialForm)
      setDraftId(null)
      setIsEditing(false)
      fetchArticles()
    } catch (err) {
      setMessage('Publish failed')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveDraft = async (e) => {
    e && e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await autosaveDraft()
      setMessage('Draft saved')
      fetchArticles()
    } catch (err) {
      setMessage('Unable to save draft')
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (id, status) => {
    const res = await fetch('/api/articles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })

    const data = await res.json()
    if (res.ok) {
      setArticles((prev) => prev.map((item) => (item._id === id ? { ...item, status } : item)))
    } else {
      setMessage(data.error || 'Unable to update article')
    }
  }

  return (
    <section className="admin-articles-page">
      <h1>Publish Articles</h1>
      <p style={{ marginTop: '-0.7rem', color: '#cfd0d2' }}>
        Create content for News, Policy, Finance, Schemes, and Opportunities.
      </p>

      {message ? <p style={{ color: '#ffde79' }}>{message}</p> : null}
      <div style={{ marginTop: 6, marginBottom: 6, color: '#8a6f58', fontSize: 12 }}>
        {dirty ? <span style={{ color: '#ffb86b' }}>Unsaved changes</span> : null}
        {lastSavedAt ? (
          <span style={{ marginLeft: dirty ? 10 : 0 }}>Last saved: {new Date(lastSavedAt).toLocaleString()}</span>
        ) : null}
      </div>

      <div className="admin-panel">
        <form onSubmit={handleSubmit} className="admin-form">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>{isEditing ? 'Edit Article' : 'New Article'}</h2>
            {isEditing && (
              <button type="button" className="toggle-btn" onClick={resetForm}>Cancel</button>
            )}
          </div>

          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label>
            Excerpt
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} required />
          </label>

          <div className="editor-label">
            <label>Content</label>
            <div className="write-tools">
              <div className="stat">Words: {wordCount()}</div>
              <div className="stat">Chars: {charCount()}</div>
              <div className="stat">Read: {readTime()} min</div>
              <button type="button" className="secondary-btn" onClick={() => setPreview((p) => !p)}>{preview ? 'Hide Preview' : 'Preview'}</button>
              <button type="button" className="secondary-btn" onClick={clearContent}>Clear</button>
              <button type="button" className="secondary-btn" onClick={insertTemplate}>Insert Template</button>
            </div>
            <AdminEditor key={isEditing ? `edit-${draftId}` : 'new'} value={form.content} onChange={(value) => setForm((current) => ({ ...current, content: value }))} />
            {preview && (
              <div className="preview-area" dangerouslySetInnerHTML={{ __html: form.content || '<p>No content</p>' }} />
            )}
          </div>

          <label>
            Category
            <select name="category" value={form.category} onChange={handleChange}>
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            Author
            <input name="author" value={form.author} onChange={handleChange} required />
          </label>

          <label>
            Tags (comma separated)
            <input name="tags" value={form.tags} onChange={handleChange} />
          </label>

          <label>
            Featured Image
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                disabled={imageUploading}
                style={{ flex: 1 }}
              />
              {imageUploading && <span style={{ fontSize: '0.85rem', color: '#ffb86b' }}>Uploading...</span>}
            </div>
            {form.featuredImage && (
              <div style={{ marginTop: '0.5rem' }}>
                <img 
                  src={form.featuredImage} 
                  alt="Preview" 
                  style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <button 
                  type="button" 
                  onClick={() => setForm({ ...form, featuredImage: '' })}
                  style={{ marginLeft: '0.5rem', padding: '0.3rem 0.6rem', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            )}
            <input 
              name="featuredImage" 
              value={form.featuredImage} 
              onChange={handleChange}
              placeholder="Or paste image URL..."
              style={{ marginTop: '0.5rem' }}
            />
          </label>

          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="submit-btn" type="submit" disabled={saving}>
              {saving ? (isEditing ? 'Updating…' : 'Publishing…') : (isEditing ? 'Update Article' : 'Publish Article')}
            </button>
            <button type="button" className="submit-btn draft" onClick={handleSaveDraft} disabled={saving}>
              {saving ? 'Saving…' : 'Save as Draft'}
            </button>
          </div>
        </form>
        {/* Existing articles list moved to /admin dashboard */}
      </div>
    </section>
  )
}
