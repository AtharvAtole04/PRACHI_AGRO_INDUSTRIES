import express from 'express';
import Crop from '../models/Crop.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Pre-seeded default crops if database is empty
const defaultCrops = [
  { name: { mr: 'कांदा (Onion)', en: 'Onion' }, logo: '🧅', tag: { mr: 'कंद फुगवण व पातीचे पोषण', en: 'Bulb growth & foliage nutrition' } },
  { name: { mr: 'ऊस (Sugarcane)', en: 'Sugarcane' }, logo: '🎋', tag: { mr: 'कांडीची लांबी व वजन वाढ', en: 'Cane length & weight booster' } },
  { name: { mr: 'टोमॅटो (Tomato)', en: 'Tomato' }, logo: '🍅', tag: { mr: 'फुलधारणा व फळांची चमक', en: 'Flowering & fruit shine' } },
  { name: { mr: 'पपई (Papaya)', en: 'Papaya' }, logo: '🍈', tag: { mr: 'बुरशी रक्षण व फळांचा आकार', en: 'Fungus defense & fruit size' } },
  { name: { mr: 'मिरची (Chilli)', en: 'Chilli' }, logo: '🌶️', tag: { mr: 'चुरडा-मुरडा नियंत्रण व फुटवे', en: 'Leaf curl control & branching' } },
  { name: { mr: 'कापूस (Cotton)', en: 'Cotton' }, logo: '🌿', tag: { mr: 'पांढरी मुळी व बोंड वाढ', en: 'White root development & boll growth' } },
  { name: { mr: 'सोयाबीन (Soybean)', en: 'Soybean' }, logo: '🫘', tag: { mr: 'शेंगांची संख्या व दाणे भरणी', en: 'Pod formation & grain filling' } },
  { name: { mr: 'डाळिंब (Pomegranate)', en: 'Pomegranate' }, logo: '🍎', tag: { mr: 'तेल्या व बुरशी नियंत्रण', en: 'Bacterial blight & fungus defense' } },
  { name: { mr: 'केळी (Banana)', en: 'Banana' }, logo: '🍌', tag: { mr: 'घडाचे वजन व झाडाचा जोम', en: 'Bunch weight & plant vigor' } }
];

// GET /api/crops - List all crops
router.get('/', async (req, res) => {
  try {
    let crops = await Crop.find().sort({ createdAt: 1 });
    if (crops.length === 0) {
      crops = await Crop.insertMany(defaultCrops);
    }
    res.json(crops);
  } catch (err) {
    console.error('Error fetching crops:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/crops - Add new crop (Admin only)
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const { name, logo, tag } = req.body;
    if (!name || (!name.mr && !name.en)) {
      return res.status(400).json({ error: 'Crop name in Marathi or English is required.' });
    }

    const crop = new Crop({
      name: {
        mr: name.mr || name.en || '',
        en: name.en || name.mr || ''
      },
      logo: logo || '🌱',
      tag: {
        mr: tag?.mr || '',
        en: tag?.en || ''
      }
    });

    await crop.save();
    res.status(201).json({ success: true, crop });
  } catch (err) {
    console.error('Error adding crop:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/crops/:id - Delete crop (Admin only)
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) {
      return res.status(404).json({ error: 'Crop not found.' });
    }
    res.json({ success: true, message: 'Crop deleted successfully.' });
  } catch (err) {
    console.error('Error deleting crop:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
