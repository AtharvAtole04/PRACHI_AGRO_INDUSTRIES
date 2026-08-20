import mongoose from 'mongoose';

const localizedStringSchema = new mongoose.Schema({
  mr: { type: String, default: '' },
  en: { type: String, default: '' }
}, { _id: false });

const videoSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: localizedStringSchema, required: true },
  crop: { type: localizedStringSchema, default: {} },
  category: { type: localizedStringSchema, default: {} },
  duration: { type: String, default: '5:00' },
  youtubeUrl: { type: String, required: true },
  embedId: { type: String, required: true },
  thumbnail: { type: String, default: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&q=80&w=400' }
}, { timestamps: true });

// Pre-save hook to extract embedId and generate ID
videoSchema.pre('save', function(next) {
  if (!this.id && this.title?.en) {
    this.id = this.title.en.toLowerCase().replace(/\s+/g, '-');
  }
  if (!this.embedId && this.youtubeUrl) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = this.youtubeUrl.match(regExp);
    this.embedId = (match && match[2].length === 11) ? match[2] : 'dQw4w9WgXcQ';
  }
  next();
});

const Video = mongoose.model('Video', videoSchema);
export default Video;
