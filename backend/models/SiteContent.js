import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'main_content'
  },
  // What Guest / Public visitors see before login
  publicAnnouncement: {
    mr: {
      type: String,
      default: '🌾 विशेष शेतकरी व डीलर सवलतींसाठी आजच लॉगिन करा! भरघोस उत्पादनाची हमी.'
    },
    en: {
      type: String,
      default: '🌾 Login now for exclusive Farmer seasonal offers and Dealer wholesale discounts!'
    },
    isActive: { type: Boolean, default: true }
  },
  // What Logged-in Farmers (Customer) see
  farmerNotice: {
    mr: {
      type: String,
      default: '👨‍🌾 शेतकरी विशेष ऑफर: टॉनिक व दाणेदार खतांच्या खरेदीवर अतिरिक्त ५% हंगामी सूट लागू!'
    },
    en: {
      type: String,
      default: '👨‍🌾 Farmer Special: Extra 5% seasonal discount applied on all tonics and fertilizers!'
    },
    isActive: { type: Boolean, default: true }
  },
  // What Logged-in Dealers see
  dealerNotice: {
    mr: {
      type: String,
      default: '🏪 अधिकृत डीलर पोर्टल: नवीन होलसेल दरपत्रक आणि मोफत डिलिव्हरी स्कीम उपलब्ध.'
    },
    en: {
      type: String,
      default: '🏪 Authorized Dealer Portal: New B2B wholesale rates and freight-free scheme active.'
    },
    isActive: { type: Boolean, default: true }
  },
  // Hero Tagline & Headlines
  heroTag: {
    mr: { type: String, default: 'दर्जेदार कृषी संजीवक व खते' },
    en: { type: String, default: 'Quality Bio-Stimulants & Fertilizers' }
  },
  heroHeading: {
    mr: { type: String, default: 'दर्जेदार कृषी टॉनिक आणि दाणेदार खते - भरघोस उत्पादनाची हमी!' },
    en: { type: String, default: 'Quality Agri Tonics & Granular Fertilizers - Guaranteed Bumper Harvest!' }
  },
  heroSupporting: {
    mr: { type: String, default: 'मुळांच्या जोमदार वाढीसाठी दाणेदार खते व पानांच्या विकासासाठी विशेष टॉनिक' },
    en: { type: String, default: 'Granular fertilizers for root development & specialized tonics for vegetative growth' }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const SiteContent = mongoose.model('SiteContent', siteContentSchema);
export default SiteContent;
