const defaultVideos = [
  {
    id: "sugarcane-100-tons",
    title: {
      mr: "ऊस पिकाचे भरघोस उत्पादन - एकरी १०० टन ध्येय नियोजन व खत व्यवस्थापन",
      en: "Sugarcane Crop High Yield - 100 Tons Per Acre Fertilizer Planning"
    },
    crop: { mr: "ऊस (Sugarcane)", en: "Sugarcane" },
    category: { mr: "खत व्यवस्थापन", en: "Fertilizer Management" },
    duration: "10:45",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replaceable standard URL
    embedId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "tomato-magic-gold",
    title: {
      mr: "टोमॅटो पिकातील करपा व ठिपके नियंत्रण - मॅजिक गोल्ड मार्गदर्शक",
      en: "Tomato Crop Disease Control - How to use Magic Gold"
    },
    crop: { mr: "टोमॅटो (Tomato)", en: "Tomato" },
    category: { mr: "प्राची अॅग्रो उत्पादने", en: "Prachi Agro Products" },
    duration: "8:20",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    embedId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "bio-fulvic-roots",
    title: {
      mr: "मुळांच्या जोमदार विकासासाठी बायो फल्व्हिक (Bio Fulvic) चे फायदे आणि वापर",
      en: "Benefits and Application of Bio Fulvic for Vigorous Root Development"
    },
    crop: { mr: "सर्व पिके (All Crops)", en: "All Crops" },
    category: { mr: "पीक मार्गदर्शन", en: "Crop Guidance" },
    duration: "6:15",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    embedId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "top-10-seaweed",
    title: {
      mr: "फुलधारणा आणि फळांच्या फुगवणीसाठी टॉप-१० सीवीड एक्सट्रॅक्टचा योग्य वापर",
      en: "Correct Use of Top-10 Seaweed Extract for Flowering and Fruit Sizing"
    },
    crop: { mr: "फळभाज्या व फळे", en: "Fruits & Vegetables" },
    category: { mr: "उत्पादन माहिती", en: "Product Info" },
    duration: "9:30",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    embedId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=400"
  }
];

export const videoCategories = [
  { id: "all", title: { mr: "सर्व व्हिडिओ", en: "All Videos" } },
  { id: "crop-guidance", title: { mr: "पीक मार्गदर्शन", en: "Crop Guidance" } },
  { id: "product-info", title: { mr: "उत्पादन माहिती", en: "Product Info" } },
  { id: "farmer-guidance", title: { mr: "शेतकरी मार्गदर्शन", en: "Farmer Guidance" } },
  { id: "pest-disease", title: { mr: "कीड व रोग व्यवस्थापन", en: "Pest & Disease" } },
  { id: "fertilizer", title: { mr: "खत व्यवस्थापन", en: "Fertilizer Management" } },
  { id: "prachi-products", title: { mr: "प्राची अॅग्रो उत्पादने", en: "Prachi Agro Products" } }
];

export const getVideos = () => {
  const data = localStorage.getItem('prachi_videos');
  if (!data) {
    localStorage.setItem('prachi_videos', JSON.stringify(defaultVideos));
    return defaultVideos;
  }
  return JSON.parse(data);
};

export const saveVideos = (array) => {
  localStorage.setItem('prachi_videos', JSON.stringify(array));
};

export const addVideo = (video) => {
  const list = getVideos();
  const newVideo = {
    ...video,
    id: video.id || video.title.en.toLowerCase().replace(/\s+/g, '-'),
    embedId: video.embedId || extractEmbedId(video.youtubeUrl)
  };
  list.push(newVideo);
  saveVideos(list);
  return list;
};

export const deleteVideo = (id) => {
  const list = getVideos();
  const filtered = list.filter(v => v.id !== id);
  saveVideos(filtered);
  return filtered;
};

// Helper function to extract YouTube Embed ID
function extractEmbedId(url) {
  if (!url) return 'dQw4w9WgXcQ';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : 'dQw4w9WgXcQ';
}

export const videos = getVideos();
