import mongoose from 'mongoose';

const localizedStringSchema = new mongoose.Schema({
  mr: { type: String, default: '' },
  en: { type: String, default: '' }
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  crop: { type: localizedStringSchema, default: {} },
  rating: { type: Number, default: 5 },
  photo: { type: String, default: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=100' },
  review: { type: localizedStringSchema, required: true }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
