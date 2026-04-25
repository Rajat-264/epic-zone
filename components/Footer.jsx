import '../styles/footer.css'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Epic Zone</h3>
          <p>Helping local businesses get discovered.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/business">Business</Link></li>
            <li><Link href="/blogs">Blogs</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <ul className="social-links">
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a href="https://threads.net" target="_blank" rel="noreferrer">Threads</a></li>
            <li><a href="mailto:contact@epiczone.com">Email</a></li>
            <li><a href="https://medium.com/@praagati" target="_blank" rel="noreferrer">Medium</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Epic Zone. All rights reserved.</p>
      </div>
    </footer>
  )
}
