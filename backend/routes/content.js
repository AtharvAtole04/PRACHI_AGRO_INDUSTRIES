import express from 'express';
import SiteContent from '../models/SiteContent.js';

const router = express.Router();

// Default CMS payload if DB is fresh
const defaultContent = {
  key: 'main_content',
  publicAnnouncement: {
    mr: '🌾 विशेष शेतकरी व डीलर सवलतींसाठी आजच लॉगिन करा! भरघोस उत्पादनाची हमी.',
    en: '🌾 Login now for exclusive Farmer seasonal offers and Dealer wholesale discounts!',
    isActive: true
  },
  farmerNotice: {
    mr: '👨‍🌾 शेतकरी विशेष ऑफर: टॉनिक व दाणेदार खतांच्या खरेदीवर अतिरिक्त ५% हंगामी सूट लागू!',
    en: '👨‍🌾 Farmer Special: Extra 5% seasonal discount applied on all tonics and fertilizers!',
    isActive: true
  },
  dealerNotice: {
    mr: '🏪 अधिकृत डीलर पोर्टल: नवीन होलसेल दरपत्रक आणि मोफत वाहतूक योजना उपलब्ध.',
    en: '🏪 Authorized Dealer Portal: New B2B wholesale rates and freight-free scheme active.',
    isActive: true
  },
  heroTag: {
    mr: 'दर्जेदार कृषी संजीवक व खते',
    en: 'Quality Bio-Stimulants & Fertilizers'
  },
  heroHeading: {
    mr: 'दर्जेदार कृषी टॉनिक आणि दाणेदार खते - भरघोस उत्पादनाची हमी!',
    en: 'Quality Agri Tonics & Granular Fertilizers - Guaranteed Bumper Harvest!'
  },
  heroSupporting: {
    mr: 'मुळांच्या जोमदार वाढीसाठी दाणेदार खते व पानांच्या विकासासाठी विशेष टॉनिक',
    en: 'Granular fertilizers for root development & specialized tonics for vegetative growth'
  }
};

// GET current CMS content
router.get('/', async (req, res) => {
  try {
    let content = await SiteContent.findOne({ key: 'main_content' });
    if (!content) {
      content = new SiteContent(defaultContent);
      await content.save();
    }
    res.json(content);
  } catch (err) {
    res.json(defaultContent);
  }
});

// UPDATE CMS content (Admin only)
router.put('/', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    const content = await SiteContent.findOneAndUpdate(
      { key: 'main_content' },
      { $set: updateData },
      { new: true, upsert: true }
    );
    res.json({ success: true, content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
