import mongoose from 'mongoose';

const localizedStringSchema = new mongoose.Schema({
  mr: { type: String, default: '' },
  en: { type: String, default: '' }
}, { _id: false });

const categorySchema = new mongoose.Schema({
  id: { type: String, unique: true },
  slug: { type: String },
  title: { type: localizedStringSchema, required: true },
  subtitle: { type: localizedStringSchema, default: {} },
  image: { type: String, default: '/assets/categories/growth.svg' }
}, { timestamps: true });

categorySchema.pre('save', function(next) {
  if (!this.id) {
    this.id = this.slug || (this.title?.en ? this.title.en.toLowerCase().replace(/\s+/g, '-') : `cat-${Date.now()}`);
  }
  if (!this.slug) {
    this.slug = this.id;
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
