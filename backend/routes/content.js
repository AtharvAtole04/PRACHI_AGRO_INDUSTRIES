import express from 'express';
import SiteContent from '../models/SiteContent.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

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
  },
  aboutUs: {
    experienceBadge: { mr: '🌱 १५ वर्षांची साथ… समृद्ध शेतीची नवी वाट!', en: '🌱 15+ Years Supporting Progressive Farmers' },
    headline: { mr: 'शेतकऱ्यांच्या प्रगतीचा विश्वासू साथीदार!', en: 'Trusted Partner in Farmer Growth & Progress!' },
    story1: {
      mr: 'गेल्या १५ वर्षांपासून प्राची अॅग्रो इंडस्ट्रीज शेतकऱ्यांच्या गरजा समजून घेत, आधुनिक शेतीसाठी विश्वासार्ह आणि प्रभावी उपाय उपलब्ध करून देण्यासाठी सातत्याने कार्यरत आहे.',
      en: 'For over 15 years, Prachi Agro Industries has been dedicated to understanding farmer needs and providing proven agricultural solutions.'
    },
    story2: {
      mr: 'शेतकऱ्यांचा विश्वास, गुणवत्तेची बांधिलकी आणि शेतीतील आधुनिक तंत्रज्ञानाचा स्वीकार, या मूल्यांच्या बळावर आम्ही आज अनेक शेतकऱ्यांशी विश्वासाचे नाते निर्माण केले आहे.',
      en: 'Built on farmer trust, uncompromising quality, and modern agricultural science, we have formed long-lasting bonds with thousands of growers.'
    },
    story3: {
      mr: 'आजवर मिळालेली शेतकऱ्यांची साथ आमच्यासाठी प्रेरणादायी आहे. भविष्यातही अधिक चांगली उत्पादने, योग्य मार्गदर्शन आणि आधुनिक शेतीचे प्रभावी उपाय शेतकऱ्यांपर्यंत पोहोचवण्यासाठी आम्ही कटिबद्ध आहोत.',
      en: 'The trust and partnership of our farmers inspires us to continually deliver higher-grade tonics, fertilizers, and personalized advisory.'
    },
    badge1: { mr: '✨ १५ वर्षांचा अनुभव', en: '✨ 15+ Years Experience' },
    badge2: { mr: '🤝 शेतकऱ्यांचा विश्वास', en: '🤝 Trusted by Farmers' },
    badge3: { mr: '🏅 गुणवत्तेची बांधिलकी', en: '🏅 Quality Assurance' },
    value1Title: { mr: 'उत्कृष्ट गुणवत्ता', en: 'Quality Assurance' },
    value1Desc: {
      mr: 'आम्ही उत्पादनांच्या गुणवत्तेशी तडजोड करत नाही. प्रत्येक बॅच कडक सुरक्षा आणि गुणवत्तेच्या निकषांमधून जाते.',
      en: 'We prioritize product safety and efficacy above all. Our formulations go through rigorous quality checks to deliver reliable crop protection.'
    },
    value2Title: { mr: 'शेतकऱ्यांचा विश्वास', en: 'Farmer-Centric' },
    value2Desc: {
      mr: 'आमचा विकास हा शेतकऱ्यांच्या प्रगतीवर अवलंबून आहे. त्यांच्या गरजा समजून घेऊन आम्ही उत्पादने विकसित करतो.',
      en: 'We believe our growth is tied directly to the progress of the farmer. Our solutions are designed to address their specific challenges.'
    },
    value3Title: { mr: 'नवीन तंत्रज्ञान', en: 'Agronomic Innovation' },
    value3Desc: {
      mr: 'आम्ही पिकांच्या शाकीय वाढीसाठी आणि रोग नियंत्रणासाठी आधुनिक तंत्रज्ञानाचा वापर करतो.',
      en: 'We stay on top of agronomic developments, creating specialized tonics, biotic promoters, and soil health conditioners.'
    },
    calloutText: {
      mr: 'पिकांची वाढ आणि रोगांच्या नियंत्रणाविषयी आमच्या कृषी सल्लागारांशी थेट संपर्क साधा. आम्ही आपल्या सेवेत २४/७ आहोत.',
      en: 'Get customized suggestions for crop nutrition and crop protection. Chat with our agronomist experts today.'
    }
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
router.put('/', verifyAdminToken, async (req, res) => {
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
