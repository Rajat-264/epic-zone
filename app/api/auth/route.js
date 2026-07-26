const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(req) {
  try {
    const { email, password, role } = await req.json()

    if (!email || !password || !role) {
      return Response.json({ error: 'Missing credentials' }, { status: 400 })
    }

    if (role === 'admin') {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        return Response.json({ success: true, role: 'admin' })
      }

      return Response.json({ error: 'Invalid admin credentials' }, { status: 401 })
    }

    return Response.json({ success: true, role: 'user' })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
