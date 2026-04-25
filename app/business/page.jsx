import '../../styles/business.css'
import BusinessCard from '../../components/cards/BusinessCard'
import Link from 'next/link'

async function getBusinesses() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/business`,
    { cache: 'no-store' }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch businesses')
  }

  return res.json()
}

export default async function BusinessPage() {
  const businesses = await getBusinesses()

  return (
    <section className="business-page">

      {/* HEADER */}
      <div className="business-header">
        <h1>Local Businesses</h1>
        <p>Discover trusted businesses around you</p>
      </div>

      <div className="business-layout">

        {/* MAIN LIST */}
        <div className="business-feed">
          {businesses.length === 0 && (
            <p style={{ color: '#bbb' }}>
              No businesses listed yet.
            </p>
          )}

          {businesses.map((business) => (
            <BusinessCard
              key={business._id}
              _id={business._id}
              name={business.name}
              category={business.category}
              city={business.city}
              mainImage={business.mainImage}
            />
          ))}
        </div>

        {/* SIDEBAR */}
        <aside className="business-sidebar">

          <div className="sidebar-block">
            <h3>Categories</h3>
            <ul>
              <li>Food</li>
              <li>Services</li>
              <li>Shops</li>
              <li>Education</li>
              <li>Health</li>
            </ul>
          </div>

          <div className="sidebar-block">
            <h3>Own a Business?</h3>
            <p>Get listed and reach local customers.</p>
            <Link href="/business/list" className="sidebar-btn">
              List Your Business
            </Link>
          </div>

        </aside>
      </div>
    </section>
  )
}
