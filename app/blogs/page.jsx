import Link from 'next/link'
import Image from 'next/image'
import '../../styles/blogs.css'
import { getMediumPosts } from '@/lib/medium'

function formatDate(value) {
  if (!value) {
    return 'Recently published'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export default async function BlogsPage() {
  let posts = []
  let profileUrl = 'https://medium.com/@praagati'
  let topicGroups = []

  const data = await getMediumPosts()
  posts = data.posts
  profileUrl = data.profileUrl
  topicGroups = data.topicGroups

  return (
    <section className="blogs-page">
      <div className="blogs-header">
        <p className="blogs-eyebrow">Medium Stories</p>
        <h1>Top 30 Medium stories, fetched automatically</h1>
        <p className="blogs-intro">
          The page stays current by reading directly from the Medium profile RSS
          feed. Posts are grouped by Medium topics when that metadata exists.
        </p>
        <div className="blogs-stats">
          <span>{posts.length} posts</span>
          <span>{topicGroups.length || 1} topic sections</span>
        </div>
        <Link
          href={profileUrl}
          className="blogs-profile-link"
          target="_blank"
          rel="noreferrer"
        >
          Visit full Medium profile
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="blogs-empty">
          <h2>Medium feed unavailable</h2>
          <p>
            The site couldn’t reach Medium right now. Please try again in a bit.
          </p>
          {data.ok === false && data.error ? (
            <p style={{ marginTop: '0.75rem', color: '#b8b8b8' }}>
              {data.error}
            </p>
          ) : null}
        </div>
      ) : (
        topicGroups.map((group) => (
          <section key={group.topic} className="blogs-topic-section">
            <div className="blogs-topic-header">
              <h2>{group.topic}</h2>
              <p>{group.posts.length} posts</p>
            </div>

            <div className="blogs-grid">
              {group.posts.map((post) => (
                <article key={post.id} className="blog-card">
                  {post.thumbnail ? (
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      className="blog-card-image"
                      width={640}
                      height={360}
                    />
                  ) : (
                    <div className="blog-card-image blog-card-image-placeholder">
                      Medium
                    </div>
                  )}

                  <div className="blog-card-content">
                    <p className="blog-card-date">{formatDate(post.publishedAt)}</p>
                    <h3>{post.title}</h3>
                    <p>{post.summary || 'Read the full story on Medium.'}</p>
                    {post.categories?.length > 1 ? (
                      <div className="blog-card-tags">
                        {post.categories.slice(1, 4).map((category) => (
                          <span key={`${post.id}-${category}`} className="blog-card-tag">
                            {category}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <Link
                      href={post.link}
                      className="blog-card-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Read on Medium
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </section>
  )
}
