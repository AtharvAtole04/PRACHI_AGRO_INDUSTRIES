import mongoose from 'mongoose';

const localizedStringSchema = new mongoose.Schema({
  mr: { type: String, default: '' },
  en: { type: String, default: '' }
}, { _id: false });

const packSizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // Slug-style string identifier (e.g. 'bactrikiller')
  name: { type: String, required: true },
  category: { type: String, required: true },
  tagline: { type: localizedStringSchema, default: {} },
  shortDescription: { type: localizedStringSchema, default: {} },
  description: { type: localizedStringSchema, default: {} },
  basePrice: { type: Number, required: true },
  originalPrice: { type: Number },
  packSizes: { type: [packSizeSchema], default: [] },
  image: { type: String, default: '/assets/products/placeholder.svg' },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 12 },
  crops: { type: localizedStringSchema, default: {} },
  benefits: {
    mr: { type: [String], default: [] },
    en: { type: [String], default: [] }
  },
  usage: { type: localizedStringSchema, default: {} }
}, { timestamps: true });

// Pre-save hook to auto-generate slug-id from name if missing
productSchema.pre('save', function(next) {
  if (!this.id && this.name) {
    this.id = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
