import './globals.css'
import NavbarClient from '../components/NavbarClient'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Epic Zone',
  description: 'Blogs, business, politics and history',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavbarClient />
        <main className="container" style={{ minHeight: '80vh' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
