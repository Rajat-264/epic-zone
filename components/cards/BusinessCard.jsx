import Link from 'next/link'
import '../../styles/business.css'

export default function BusinessCard({
  _id,
  name,
  category,
  city,
  mainImage
}) {
  return (
    <article className="business-card">

      <Link href={`/business/${_id}`} className="business-card-link">

        {/* SHOP IMAGE – ALWAYS RENDER TAG */}
        <img
          src={mainImage || '/placeholder.jpg'}
          alt={name}
          className="business-main-image"
        />

        <div className="business-card-content">
          <span className="business-category">{category}</span>
          <h2>{name}</h2>
          <small>{city}</small>
        </div>

      </Link>

    </article>
  )
}
