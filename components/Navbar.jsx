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
        <div className="logo">
          <img src="/logo.png" alt="Logo" className="logo-image" />
          <h1 className="logo-content">The Bharat Brief</h1>
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
        </div>
      </div>
    </nav>
  )
}
