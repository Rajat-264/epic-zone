import { connectDB } from '@/lib/mongodb'
import Business from '@/lib/models/Business'

/* CREATE */
export async function POST(req) {
  await connectDB()
  const data = await req.json()

  if (data.productImages?.length > 3) {
    data.productImages = data.productImages.slice(0, 3)
  }

  await Business.create(data)
  return Response.json({ success: true })
}

export async function GET(req) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    // ✅ Fetch SINGLE approved business
    if (id) {
      const business = await Business.findOne({
        _id: id,
        status: 'approved'
      })

      if (!business) {
        return Response.json(
          { error: 'Business not found' },
          { status: 404 }
        )
      }

      return Response.json(business)
    }

    // ✅ Fetch ALL approved businesses
    const businesses = await Business.find({
      status: 'approved'
    }).sort({ createdAt: -1 })

    return Response.json(businesses)

  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
