export const dynamic = 'force-dynamic'

export default function GlobalError() {
  return (
    <html>
      <body>
        <div style={{ padding: '3rem', fontFamily: 'sans-serif' }}>
          <h1>Something went wrong</h1>
          <p>We're unable to render this page at the moment.</p>
        </div>
      </body>
    </html>
  )
}
