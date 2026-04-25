'use client'
import { useState } from 'react'
import '../../../styles/business-form.css'

export default function ListBusinessPage() {
  const [form, setForm] = useState({})
  const [mainImage, setMainImage] = useState(null)
  const [productImages, setProductImages] = useState([])

  const toBase64 = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(file)
    })

  const handleMainImage = async (e) => {
    setMainImage(await toBase64(e.target.files[0]))
  }

  const handleProductImages = async (e) => {
    const files = Array.from(e.target.files).slice(0, 3)
    const images = await Promise.all(files.map(toBase64))
    setProductImages(images)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await fetch('/api/business', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        mainImage,
        productImages
      })
    })

    alert('Business submitted for review')
  }

  return (
    <section className="business-form">
      <h1>List Your Business</h1>

      <form onSubmit={handleSubmit}>
        <input required placeholder="Business Name"
          onChange={e => setForm({ ...form, name: e.target.value })} />

        <input required placeholder="Category"
          onChange={e => setForm({ ...form, category: e.target.value })} />

        <input required placeholder="City"
          onChange={e => setForm({ ...form, city: e.target.value })} />

        <textarea placeholder="Short Description"
          onChange={e => setForm({ ...form, description: e.target.value })} />

        <input required placeholder="Phone Number"
          onChange={e => setForm({ ...form, phone: e.target.value })} />

        {/* MAIN IMAGE */}
        <label>Main Shop Image</label>
        <input type="file" accept="image/*" onChange={handleMainImage} />

        {/* PRODUCT IMAGES */}
        <label>Product Images (max 3)</label>
        <input type="file" accept="image/*" multiple onChange={handleProductImages} />

        <button type="submit">Submit</button>
      </form>
    </section>
  )
}
