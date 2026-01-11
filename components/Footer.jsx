import '../styles/footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Epic Zone. All rights reserved.</p>
      </div>
    </footer>
  )
}
