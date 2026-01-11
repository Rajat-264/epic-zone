'use client'
import { useState } from 'react'
import Link from 'next/link'
import '../styles/navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')


  return (
    <nav className="navbar">
      <div className="nav-content">
        <h1 className="logo">Epic Zone</h1>

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
          <Link href="/" className="nav-item home" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/business" className="nav-item business" onClick={() => setOpen(false)}>Business</Link>
          <Link href="/blogs" className="nav-item blogs" onClick={() => setOpen(false)}>Blogs</Link>
          <Link href="/shivajimaharaj" className="nav-item shivaji" onClick={() => setOpen(false)}>Shivaji Maharaj</Link>
          <Link href="/pov" className="nav-item pov" onClick={() => setOpen(false)}>POV</Link>
          <div className="nav-item search">
            <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Link href="/contact" className="nav-item contact" onClick={() => setOpen(false)}>Contact Us</Link>
        </div>
      </div>
    </nav>
  )
}
