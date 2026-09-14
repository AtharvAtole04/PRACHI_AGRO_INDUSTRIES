import { apiUrl } from '../config';

export const defaultSiteContent = {
  key: 'main_content',
  publicAnnouncement: {
    mr: '🌾 विशेष शेतकरी व डीलर सवलतींसाठी आजच ऑर्डर करा! भरघोस उत्पादनाची हमी.',
    en: '🌾 Order now for exclusive Farmer seasonal offers and Dealer wholesale discounts!',
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
      mr: 'गेल्या १५ वर्षांपासून प्राची ॲग्रो इंडस्ट्रीज शेतकऱ्यांच्या गरजा समजून घेत, आधुनिक शेतीसाठी विश्वासार्ह आणि प्रभावी उपाय उपलब्ध करून देण्यासाठी सातत्याने कार्यरत आहे.',
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
  },
  joinNetwork: {
    bannerBadge: { mr: 'डीलरशिप व वितरण व्यवस्था', en: 'Dealership & Distribution Network' },
    bannerHeadline: { mr: 'आमच्या नेटवर्कमध्ये सहभागी व्हा', en: 'Join Our Growth Network' },
    bannerSubtitle: {
      mr: 'कृषी सेवा केंद्र, डीलरशिप, वितरण व्यवस्था आणि तज्ज्ञ कृषी सल्ल्यासाठी आजच प्राची ॲग्रो कुटुंबाशी जोडा.',
      en: 'Partner with Prachi Agro Industries for Authorized Dealership, Bulk Supply, and Agronomic Guidance.'
    },
    benefit1: { mr: 'अधिकृत डीलरशिप', en: 'Authorized Dealership' },
    benefit2: { mr: 'आकर्षक मार्जिन', en: 'Attractive Margins' },
    benefit3: { mr: 'दर्जेदार उत्पादने', en: 'Premium Quality' },
    benefit4: { mr: 'पूर्ण विक्री सहाय्य', en: 'Sales Support' },
    mapTitle: { mr: 'आमचे डीलर व वितरण नेटवर्क', en: 'Our Dealer & Distribution Network' },
    mapSubtitle: { mr: 'तुमच्या जवळचे अधिकृत कृषी केंद्र शोधा', en: 'Find authorized agri retail centers near you' },
    isMapVisible: true,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.265588856342!2d73.91454!3d18.52043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMxJzEzLjYiTiA3M8KwNTQnNTIuNCJF!5e0!3m2!1sen!2sin!4v1234567890',
    regionTag: { mr: '६+ प्रमुख जिल्हे', en: '6+ Key Districts' },
    regionsList: {
      mr: 'पुणे (Pune), नाशिक (Nashik), छ. संभाजीनगर (Aurangabad), सोलापूर (Solapur), कोल्हापूर (Kolhapur), नागपूर (Nagpur)',
      en: 'Pune, Nashik, Chh. Sambhajinagar, Solapur, Kolhapur, Nagpur'
    },
    directPhone: '9021605160',
    directEmail: 'info@prachiagroindustries.in',
    directWhatsapp: '9021605160'
  }
};

export const getSiteContent = async () => {
  try {
    const res = await fetch(apiUrl('/api/content'));
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.publicAnnouncement) {
        const merged = {
          ...defaultSiteContent,
          ...data,
          aboutUs: {
            ...defaultSiteContent.aboutUs,
            ...(data.aboutUs || {})
          },
          joinNetwork: {
            ...defaultSiteContent.joinNetwork,
            ...(data.joinNetwork || {})
          }
        };
        localStorage.setItem('prachi_site_content', JSON.stringify(merged));
        return merged;
      }
    }
  } catch (err) {
    console.warn('Backend content endpoint offline, using local site content.');
  }

  const saved = localStorage.getItem('prachi_site_content');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...defaultSiteContent,
        ...parsed,
        aboutUs: {
          ...defaultSiteContent.aboutUs,
          ...(parsed.aboutUs || {})
        },
        joinNetwork: {
          ...defaultSiteContent.joinNetwork,
          ...(parsed.joinNetwork || {})
        }
      };
    } catch {}
  }

  return defaultSiteContent;
};

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('prachi_auth_token') : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const updateSiteContent = async (newContent) => {
  let savedContent = newContent;
  try {
    const res = await fetch(apiUrl('/api/content'), {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(newContent)
    });

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      savedContent = data.content || newContent;
    }
  } catch (err) {
    console.warn('[SiteContent API Warning - Update Content]: Offline fallback used.', err);
  }

  localStorage.setItem('prachi_site_content', JSON.stringify(savedContent));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('prachi_site_content_updated'));
  }
  return savedContent;
};
