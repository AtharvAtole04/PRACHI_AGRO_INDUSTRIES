import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  name: {
    mr: { type: String, required: true },
    en: { type: String, required: true }
  },
  logo: {
    type: String,
    required: true,
    default: '🌱'
  },
  tag: {
    mr: { type: String, default: '' },
    en: { type: String, default: '' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Crop = mongoose.model('Crop', cropSchema);
export default Crop;
