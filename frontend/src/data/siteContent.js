import { apiUrl } from '../config';

export const defaultSiteContent = {
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

export const getSiteContent = async () => {
  try {
    const res = await fetch(apiUrl('/api/content'));
    if (res.ok) {
      const data = await res.json();
      if (data && data.publicAnnouncement) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend content endpoint offline, using local site content.');
  }

  const saved = localStorage.getItem('prachi_site_content');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }

  return defaultSiteContent;
};

export const updateSiteContent = async (newContent) => {
  try {
    const res = await fetch(apiUrl('/api/content'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContent)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.content) {
        localStorage.setItem('prachi_site_content', JSON.stringify(data.content));
        return data.content;
      }
    }
  } catch (err) {
    console.warn('Backend offline, saving content locally.');
  }

  localStorage.setItem('prachi_site_content', JSON.stringify(newContent));
  return newContent;
};
