import fs from 'fs'
import path from 'path'

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || ''

    // Handle multipart/form-data via formData() (file upload)
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      const file = form.get('file')

      if (!file) {
        return Response.json({ error: 'Missing file' }, { status: 400 })
      }

      // file is a Blob-like File
      const filename = form.get('filename') || file.name || 'upload'
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

      const safeName = `${Date.now()}-${String(filename).replace(/[^a-z0-9.\-_]/gi, '-')}`
      const filepath = path.join(uploadsDir, safeName)
      fs.writeFileSync(filepath, buffer)
      const url = `/uploads/${safeName}`
      return Response.json({ success: true, url })
    }

    // Fallback: accept JSON with dataUrl
    const payload = await req.json()
    const { filename, dataUrl } = payload

    if (!filename || !dataUrl) {
      return Response.json({ error: 'Missing filename or dataUrl' }, { status: 400 })
    }

    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/)
    if (!matches) {
      return Response.json({ error: 'Invalid dataUrl' }, { status: 400 })
    }

    const [, mime, base64] = matches
    const buffer = Buffer.from(base64, 'base64')

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

    const safeName = `${Date.now()}-${filename.replace(/[^a-z0-9.\-_]/gi, '-')}`
    const filepath = path.join(uploadsDir, safeName)

    fs.writeFileSync(filepath, buffer)

    const url = `/uploads/${safeName}`

    return Response.json({ success: true, url })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

