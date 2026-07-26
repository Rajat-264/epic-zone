"use client"
import '../styles/footer.css'
import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    const trimmed = (email || '').trim()
    if (!trimmed) {
      setMessage({ type: 'error', text: 'Please enter your email.' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Subscription failed')
      setMessage({ type: 'success', text: data?.message || 'Subscribed — check your inbox.' })
      setEmail('')
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Subscription failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Menu</h3>
          <div className="footer-links">
          <Link href="/news">News</Link>
          <Link href="/policy">Policy</Link>
          <Link href="/finance">Finance</Link>
          <Link href="/founders">Founders</Link>
          <Link href="/schemes">Schemes</Link>
          <Link href="/opportunities">Opportunities</Link>
        </div>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <ul className="social-links">
            <li><a href="https://www.instagram.com/the.bharatbrief_/" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="https://www.linkedin.com/company/the-bharat-briefs/" target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a href="https://www.threads.com/@the.bharatbrief_" target="_blank" rel="noreferrer">Threads</a></li>
            <li><a href="mailto:admin@thebharatbrief.co">Email</a></li>
            <li><a href="https://medium.com/@praagati" target="_blank" rel="noreferrer">Medium</a></li>
          </ul>
        </div>

        <div className="footer-section subscribe-section">
          <h4>Subscribe to Newsletter</h4>
          <p>Get weekly updates and top stories delivered to your inbox.</p>
          <form className="subscribe-form" onSubmit={handleSubmit} aria-label="Subscribe to newsletter">
            <label htmlFor="subscribe-email" className="sr-only">Email address</label>
            <div className="subscribe-row">
              <input
                id="subscribe-email"
                type="email"
                name="email"
                placeholder="you@domain.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button type="submit" className="subscribe-btn" disabled={loading} aria-disabled={loading}>
                {loading ? 'Subscribing…' : 'Subscribe'}
              </button>
            </div>
            <p className="subscribe-note">No spam — unsubscribe anytime.</p>
            {message && (
              <div className={`subscribe-message ${message.type === 'error' ? 'error' : 'success'}`} role="status">
                {message.text}
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Epic Zone. All rights reserved.</p>
      </div>
    </footer>
  )
}
