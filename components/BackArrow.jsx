"use client"

import { useRouter } from 'next/navigation'

export default function BackArrow({ href, label }) {
  const router = useRouter()

  const handleClick = (e) => {
    e.preventDefault()
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <div className="back-nav">
      <button onClick={handleClick} className="back-link">
        ← {label || 'Back'}
      </button>
    </div>
  )
}
