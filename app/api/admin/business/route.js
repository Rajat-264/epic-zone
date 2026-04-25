import { connectDB } from '@/lib/mongodb'
import Business from '@/lib/models/Business'

/**
 * GET → Fetch pending businesses
 * URL: /api/admin/business
 */
export async function GET() {
  try {
    await connectDB()

    const pendingBusinesses = await Business.find({
      status: 'pending'
    }).sort({ createdAt: -1 })

    return Response.json(pendingBusinesses)
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * PATCH → Approve / Reject business
 * body: { id, status }
 */
export async function PATCH(req) {
  try {
    await connectDB()

    const { id, status } = await req.json()

    if (!id || !status) {
      return Response.json(
        { error: 'Missing id or status' },
        { status: 400 }
      )
    }

    if (!['approved', 'rejected'].includes(status)) {
      return Response.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    await Business.findByIdAndUpdate(id, { status })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
