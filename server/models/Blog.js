import mongoose from 'mongoose';

const localizedStringSchema = new mongoose.Schema({
  mr: { type: String, default: '' },
  en: { type: String, default: '' }
}, { _id: false });

const blogSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: localizedStringSchema, required: true },
  category: { type: localizedStringSchema, default: {} },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  readTime: { type: String, default: '5 min read' },
  image: { type: String, default: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=400' },
  excerpt: { type: localizedStringSchema, default: {} },
  content: { type: localizedStringSchema, default: {} }
}, { timestamps: true });

// Pre-save hook to generate ID from title
blogSchema.pre('save', function(next) {
  if (!this.id && this.title?.en) {
    this.id = this.title.en.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
