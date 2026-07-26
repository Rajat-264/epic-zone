import { promises as fs } from 'fs'
import { join } from 'path'

const DATA_DIR = process.cwd()
const SUB_FILE = join(DATA_DIR, 'data', 'subscribers.json')

async function ensureDataFile() {
  try {
    await fs.mkdir(join(DATA_DIR, 'data'), { recursive: true })
    await fs.access(SUB_FILE)
  } catch (err) {
    await fs.writeFile(SUB_FILE, '[]', 'utf8')
  }
}

export async function POST(req) {
  try {
    await ensureDataFile()

    let email = ''
    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      let body
      try {
        body = await req.json()
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      }
      email = (body?.email || '').toString().trim().toLowerCase()
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await req.text()
      const params = new URLSearchParams(text)
      email = (params.get('email') || '').trim().toLowerCase()
    } else {
      const text = await req.text()
      try {
        const body = JSON.parse(text)
        email = (body?.email || '').toString().trim().toLowerCase()
      } catch {
        return new Response(JSON.stringify({ error: 'Unsupported or malformed request body' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      }
    }

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const raw = await fs.readFile(SUB_FILE, 'utf8')
    let arr = []
    try { arr = JSON.parse(raw) } catch (e) { arr = [] }

    if (arr.includes(email)) {
      return new Response(JSON.stringify({ success: true, message: 'Already subscribed' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    arr.push(email)
    await fs.writeFile(SUB_FILE, JSON.stringify(arr, null, 2), 'utf8')

    return new Response(JSON.stringify({ success: true, message: 'Subscribed — check your inbox.' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('Subscribe error', err)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

export async function GET() {
  try {
    await ensureDataFile()
    const raw = await fs.readFile(SUB_FILE, 'utf8')
    const arr = JSON.parse(raw || '[]')
    return new Response(JSON.stringify({ count: arr.length }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}
