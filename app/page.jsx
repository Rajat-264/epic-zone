import '../styles/home.css'

export default function Home() {
  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero">
        <h1>Helping Local Businesses Get Discovered</h1>
        <p>
          Epic Zone connects people with trusted local businesses,
          while also offering blogs, perspectives, and historical content.
        </p>
        <button>Explore Businesses</button>
      </section>

      {/* FEATURED BUSINESSES */}
      <section className="section">
        <h2>Featured Local Businesses</h2>

        <div className="business-grid">
          <div className="business-card">
            <h3>Shree Ganesh Bakery</h3>
            <p>Fresh bakery items & custom cakes.</p>
          </div>

          <div className="business-card">
            <h3>Patil Hardware</h3>
            <p>All construction & hardware materials.</p>
          </div>

          <div className="business-card">
            <h3>Om Mobile Store</h3>
            <p>Mobiles, accessories & repair services.</p>
          </div>
        </div>
      </section>

      {/* SECONDARY CONTENT */}
      <section className="section">
        <h2>Explore More</h2>

        <div className="secondary-grid">
          <div className="secondary-card">
            <h3>Blogs</h3>
            <p>Thoughts, stories, and experiences.</p>
          </div>

          <div className="secondary-card">
            <h3>POV</h3>
            <p>Opinions on politics and society.</p>
          </div>

          <div className="secondary-card">
            <h3>Shivaji Maharaj</h3>
            <p>History, forts, and legacy.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Own a Local Business?</h2>
        <p>Get featured on Epic Zone and reach more customers.</p>
        <button>List Your Business</button>
      </section>
    </div>
  )
}
