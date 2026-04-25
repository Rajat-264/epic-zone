'use client'

import Link from 'next/link'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../../styles/home.css'

gsap.registerPlugin(ScrollTrigger)

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

export default function HomeLanding({ mediumPreview = [], mediumProfileUrl, topicGroups = [] }) {
  const logoRef = useRef(null)

  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(logoRef.current, {
        opacity: 0,
        y: 100,
      }, {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: 'bouncy',
      })

      gsap.fromTo(logoRef.current, {
        scale: 1,
        opacity: 1,
      }, {
        scale: 0.4,
        opacity: 0,
        stagger: 0.5,
        scrollTrigger: {
          trigger: logoRef.current,
          start: 'top 15%',
          end: 'top 0%',
          ease: 'bouncy',
          scrub: 3,
        },
      })
    }
  }, [])

  return (
    <div className="home-page">
      <section className="head-logo" ref={logoRef}>
        <p>Epic Zone</p>
      </section>

      <section className="hero">
        <h1>Helping Local Businesses Get Discovered</h1>
        <p>
          Epic Zone connects people with trusted local businesses,
          while also offering blogs, perspectives, and historical content.
        </p>
        <Link href="/business" className="hero-link">Explore Businesses</Link>
      </section>

      <section className="section">
        <h2>Featured Local Businesses</h2>

        <div className="business-grid">
          <div className="business-card">
            <h3>Shree Ganesh Bakery</h3>
            <p>Fresh bakery items & custom cakes.</p>
          </div>

          <div className="business-card">
            <h3>Patil Hardware</h3>
            <p>All construction & hardware materials.</p>
          </div>

          <div className="business-card">
            <h3>Om Mobile Store</h3>
            <p>Mobiles, accessories & repair services.</p>
          </div>
        </div>
      </section>

      <section className="section section-with-header">
        <div className="section-heading-row">
          <div>
            <h2>Latest Medium Writing</h2>
            <p className="section-subtitle">
              Three freshest posts from {mediumProfileUrl ? 'her Medium profile' : 'Medium'}.
            </p>
          </div>
          <Link href="/blogs" className="section-link">See all 30 posts</Link>
        </div>

        <div className="medium-preview-grid">
          {mediumPreview.map((post) => (
            <article key={post.id} className="medium-preview-card">
              <p className="medium-preview-date">{formatDate(post.publishedAt)}</p>
              <h3>{post.title}</h3>
              <p>{post.summary || 'Read the full story on Medium.'}</p>
              <div className="medium-preview-meta">
                <span>{post.topic}</span>
                <Link href={post.link} target="_blank" rel="noreferrer">Read on Medium</Link>
              </div>
            </article>
          ))}
        </div>

        {topicGroups.length > 0 ? (
          <div className="medium-topic-chips">
            {topicGroups.slice(0, 5).map((group) => (
              <span key={group.topic} className="medium-topic-chip">
                {group.topic} - {group.posts.length}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <section className="section">
        <h2>Explore More</h2>

        <div className="secondary-grid">
          <Link href="/blogs" className="secondary-card">
            <h3>Blogs</h3>
            <p>Latest Medium stories, summaries, and direct links.</p>
          </Link>

          <div className="secondary-card">
            <h3>POV</h3>
            <p>Opinions on politics and society.</p>
          </div>

          <div className="secondary-card">
            <h3>Shivaji Maharaj</h3>
            <p>History, forts, and legacy.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Own a Local Business?</h2>
        <p>Get featured on Epic Zone and reach more customers.</p>
        <Link href="/business/list" className="cta-link">List Your Business</Link>
      </section>
    </div>
  )
}
