import mongoose from 'mongoose'

const BusinessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  city: { type: String, required: true },
  phone: { type: String, required: true },

  mainImage: String,          // 🖼 Shop image
  productImages: [String],   // 🧺 Max 3 images

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Business ||
  mongoose.model('Business', BusinessSchema)
