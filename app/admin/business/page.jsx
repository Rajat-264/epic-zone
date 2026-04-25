'use client'

import { useEffect, useState } from 'react'
import '../../../styles/admin-business.css'

export default function AdminBusinessPage() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPending = async () => {
    const res = await fetch('/api/admin/business')
    const data = await res.json()
    setBusinesses(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchPending()
  }, [])

  const updateStatus = async (id, status) => {
    await fetch('/api/admin/business', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    })

    // Remove from list after action
    setBusinesses(prev => prev.filter(b => b._id !== id))
  }

  if (loading) {
    return <p style={{ color: '#fff', padding: '2rem' }}>Loading…</p>
  }

  return (
    <section className="admin-business">
      <h1>Pending Business Approvals</h1>

      {businesses.length === 0 && (
        <p className="empty">No pending submissions 🎉</p>
      )}

      <div className="admin-list">
        {businesses.map(b => (
          <div key={b._id} className="admin-card">

            {/* Shop image */}
            {b.mainImage && (
              <img
                src={b.mainImage}
                alt={b.name}
                className="admin-image"
              />
            )}

            <div className="admin-info">
              <h3>{b.name}</h3>
              <p><strong>Category:</strong> {b.category}</p>
              <p><strong>City:</strong> {b.city}</p>
              <p><strong>Phone:</strong> {b.phone}</p>
              <p className="desc">{b.description}</p>
            </div>

            <div className="admin-actions">
              <button
                className="approve"
                onClick={() => updateStatus(b._id, 'approved')}
              >
                Approve
              </button>

              <button
                className="reject"
                onClick={() => updateStatus(b._id, 'rejected')}
              >
                Reject
              </button>
            </div>

          </div>
        ))}
      </div>
    </section>
  )
}
