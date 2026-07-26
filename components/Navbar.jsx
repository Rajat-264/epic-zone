'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AiOutlineUser } from 'react-icons/ai'
import '../styles/navbar.css'

export default function Navbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginRole, setLoginRole] = useState('user')
  const [authForm, setAuthForm] = useState({ email: '', password: '' })
  const [authMessage, setAuthMessage] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const closeMenu = () => setDropdownOpen(false)
    window.addEventListener('click', closeMenu)
    return () => window.removeEventListener('click', closeMenu)
  }, [])

  const toggleDropdown = (event) => {
    event.stopPropagation()
    setDropdownOpen((current) => !current)
  }

  const openLoginModal = (role, event) => {
    event.stopPropagation()
    setLoginRole(role)
    setAuthForm({ email: '', password: '' })
    setAuthMessage('')
    setShowLoginModal(true)
    setDropdownOpen(false)
  }

  const handleAuthChange = (event) => {
    setAuthForm({ ...authForm, [event.target.name]: event.target.value })
  }

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    setAuthMessage('')

    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...authForm, role: loginRole }),
    })

    const data = await response.json()

    if (!response.ok) {
      setAuthMessage(data.error || 'Authentication failed')
      return
    }

    if (loginRole === 'admin') {
      localStorage.setItem('authUser', JSON.stringify({ email: authForm.email, role: 'admin' }))
      router.push('/admin')
      return
    }

    localStorage.setItem('authUser', JSON.stringify({ email: authForm.email, role: 'user' }))
    setAuthMessage('Logged in successfully')
    setShowLoginModal(false)
  }

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="logo">
          <img src="/logo.png" alt="Logo" className="logo-image" />
          <Link href="/" className="logo-content" textDecoration="none">The Bharat Brief</Link>
        </div>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        {/* Nav Links */}
        <div className={`nav-links ${open ? 'open' : ''}`}>
          <Link href="/news" className="nav-item news" onClick={() => setOpen(false)}>News</Link>
          <Link href="/policy" className="nav-item policy" onClick={() => setOpen(false)}>Policy</Link>
          <Link href="/finance" className="nav-item finance" onClick={() => setOpen(false)}>Finance</Link>
          <Link href="/founders" className="nav-item founders" onClick={() => setOpen(false)}>Founders</Link>
          <Link href="/schemes" className="nav-item schemes" onClick={() => setOpen(false)}>Schemes</Link>
          <Link href="/opportunities" className="nav-item opportunities" onClick={() => setOpen(false)}>Opportunities</Link>
          <button type="button" className="nav-item profile" onClick={toggleDropdown} aria-label="Profile">
            <AiOutlineUser size={20} />
          </button>
          {dropdownOpen && (
            <div className="profile-dropdown" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="dropdown-item" onClick={(event) => openLoginModal('user', event)}>
                Log in
              </button>
              <button type="button" className="dropdown-item" onClick={(event) => openLoginModal('admin', event)}>
                Log in as Admin
              </button>
            </div>
          )}
        </div>
        {showLoginModal && (
          <div className="login-modal" onClick={() => setShowLoginModal(false)}>
            <div className="login-panel" onClick={(event) => event.stopPropagation()}>
              <h3>{loginRole === 'admin' ? 'Admin Login' : 'Login'}</h3>
              <form onSubmit={handleAuthSubmit}>
                <label>
                  Email
                  <input type="email" name="email" required value={authForm.email} onChange={handleAuthChange} />
                </label>
                <label>
                  Password
                  <input type="password" name="password" required value={authForm.password} onChange={handleAuthChange} />
                </label>
                {authMessage ? <p className="auth-message">{authMessage}</p> : null}
                <button type="submit" className="submit-auth-btn">
                  Continue
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
