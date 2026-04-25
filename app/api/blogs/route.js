import { getMediumPosts } from '@/lib/medium'

export async function GET() {
  try {
    const data = await getMediumPosts()
    if (data.ok === false) {
      return Response.json(data, { status: 502 })
    }
    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: error.message || 'Failed to load Medium posts' },
      { status: 502 }
    )
  }
}
