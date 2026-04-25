import '../../../styles/business-details.css'
import { headers } from 'next/headers'

async function getBusiness(id) {
  // ✅ Await headers in Next.js 16
  const headersList = await headers()

  const host = headersList.get('host')
  const protocol =
    process.env.NODE_ENV === 'development' ? 'http' : 'https'

  const url = `${protocol}://${host}/api/business?id=${id}`

  const res = await fetch(url, { cache: 'no-store' })

  if (!res.ok) {
    console.error('Fetch failed:', res.status)
    return null
  }

  return res.json()
}

export default async function BusinessDetails({ params }) {
  const { id } = await params   // required in Next 16

  const business = await getBusiness(id)

  if (!business) {
    return (
      <p style={{ color: '#fff', padding: '2rem' }}>
        Business not found
      </p>
    )
  }

  return (
    <section className="business-details">

      {business.mainImage && (
        <img
          src={business.mainImage}
          alt={business.name}
          className="details-main-image"
        />
      )}

      <div className="details-content">
        <h1>{business.name}</h1>
        <span className="details-category">{business.category}</span>

        <p className="details-description">
          {business.description}
        </p>

        <div className="details-meta">
          <p><strong>City:</strong> {business.city}</p>
          <p><strong>Phone:</strong> {business.phone}</p>
        </div>
      </div>

      {business.productImages?.length > 0 && (
        <div className="details-products">
          <h2>Products</h2>
          <div className="product-gallery">
            {business.productImages.map((img, i) => (
              <img key={i} src={img} alt="product" />
            ))}
          </div>
        </div>
      )}

    </section>
  )
}
