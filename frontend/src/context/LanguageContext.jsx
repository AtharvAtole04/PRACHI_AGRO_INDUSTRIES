import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  mr: {
    home: "मुख्यपृष्ठ",
    products: "उत्पादने",
    categories: "श्रेणी",
    blog: "ब्लॉग",
    videos: "व्हिडिओ",
    reviews: "शेतकरी अभिप्राय",
    aboutUs: "आमच्याबद्दल",
    contactUs: "आमच्या नेटवर्कमध्ये सहभागी व्हा",
    joinNetwork: "आमच्या नेटवर्कमध्ये सहभागी व्हा",
    myAccount: "माझे खाते",
    myOrders: "माझ्या ऑर्डर्स",
    searchPlaceholder: "उत्पादने शोधा...",
    whatsAppOrder: "WhatsApp वर ऑर्डर करा",
    whatsAppContact: "WhatsApp वर संपर्क करा",
    addToCart: "कार्टमध्ये जोडा",
    viewDetails: "तपशील पहा",
    popularProducts: "लोकप्रिय उत्पादने",
    newProducts: "नवीन उत्पादने",
    specialOffers: "विशेष ऑफर्स",
    farmerTrust: "शेतकऱ्यांचा विश्वास",
    agriVideos: "नवीन व्हिडिओ",
    viewAllVideos: "सर्व व्हिडिओ पहा",
    viewAllBlogs: "शेती मार्गदर्शन ब्लॉग",
    readMore: "अधिक वाचा",
    tagline: "शेतकऱ्यांच्या प्रगतीचा विश्वासू साथीदार!",
    positioning: "शेतकऱ्यांच्या प्रगतीचा विश्वासू साथीदार!",
    heroHeading: "उत्तम पीक वाढ आणि भरघोस उत्पादनासाठी!",
    heroSupporting: "दर्जेदार कृषी टॉनिक | दाणेदार खते | संपूर्ण पीक पोषण व संरक्षण",
    allProductsBtn: "सर्व उत्पादने पहा",
    searchBtn: "शोधा",
    cartTitle: "तुमचे कार्ट",
    cartEmpty: "तुमचे कार्ट रिकामे आहे.",
    cartTotal: "एकूण किंमत",
    checkout: "ऑर्डर पूर्ण करा",
    packSize: "पॅक आकार",
    quantity: "प्रमाण",
    backToProducts: "उत्पादनांकडे परत",
    relatedProducts: "संबंधित उत्पादने",
    benefits: "फायदे",
    usageInstructions: "वापरण्याची पद्धत",
    suitableCrops: "योग्य पिके",
    reviewsLabel: "ग्राहक अभिप्राय",
    todayOffers: "विशेष ऑफर्स",
    quickLinks: "द्रुत लिंक्स",
    company: "कंपनी",
    support: "ग्राहक व डीलर सेवा",
    allRightsReserved: "सर्व हक्क सुरक्षित."
  },
  en: {
    home: "Home",
    products: "Products",
    categories: "Categories",
    blog: "Blog",
    videos: "Videos",
    reviews: "Farmer Reviews",
    aboutUs: "About Us",
    contactUs: "Join Our Network",
    joinNetwork: "Join Our Network",
    myAccount: "My Account",
    myOrders: "My Orders",
    searchPlaceholder: "Search products...",
    whatsAppOrder: "Order on WhatsApp",
    whatsAppContact: "Contact on WhatsApp",
    addToCart: "Add to Cart",
    viewDetails: "View Details",
    popularProducts: "Popular Products",
    newProducts: "New Products",
    specialOffers: "Special Offers",
    farmerTrust: "Farmer's Trust",
    agriVideos: "Latest Videos",
    viewAllVideos: "View All Videos",
    viewAllBlogs: "Farming Guidance Blogs",
    readMore: "Read More",
    tagline: "Trusted Partner in Farmer's Progress!",
    positioning: "Trusted Partner in Farmer's Progress!",
    heroHeading: "For Superior Crop Growth & Bumper Yields!",
    heroSupporting: "Quality Plant Tonics | Granular Fertilizers | Complete Crop Nutrition",
    allProductsBtn: "View All Products",
    searchBtn: "Search",
    cartTitle: "Your Cart",
    cartEmpty: "Your cart is empty.",
    cartTotal: "Total Amount",
    checkout: "Proceed to Checkout",
    packSize: "Pack Size",
    quantity: "Quantity",
    backToProducts: "Back to Products",
    relatedProducts: "Related Products",
    benefits: "Benefits",
    usageInstructions: "How to Use",
    suitableCrops: "Suitable Crops",
    reviewsLabel: "Customer Reviews",
    todayOffers: "Special Offers",
    quickLinks: "Quick Links",
    company: "Company",
    support: "Customer & Dealer Support",
    allRightsReserved: "All Rights Reserved."
  }
};

export const LanguageProvider = ({ children }) => {
  // Try to load saved language from localStorage, default to 'mr' (Marathi)
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('prachi_language');
    return saved === 'en' ? 'en' : 'mr';
  });

  useEffect(() => {
    localStorage.setItem('prachi_language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'mr' ? 'en' : 'mr'));
  };

  // Translation helper function
  const t = (key) => {
    if (!key) return '';
    // If it's a localized object e.g. { mr: "मुख्यपृष्ठ", en: "Home" }
    if (typeof key === 'object') {
      return key[language] || key['mr'] || '';
    }
    // If it's a string, look up in translations dictionary
    return translations[language]?.[key] || translations['mr']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
