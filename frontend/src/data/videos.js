import { apiUrl } from '../config';

const defaultVideos = [
  {
    id: "agrisulf-sulphur-benefits",
    title: {
      mr: "AGRISULF सल्फर २०% चे फायदे व पिकांवरील वापर - संपूर्ण माहिती",
      en: "AGRISULF Sulphur 20% Benefits and Application Guide for Crops"
    },
    crop: { mr: "सोयाबीन, कांदा व सर्व पिके", en: "Soybean, Onion & All Crops" },
    category: { mr: "उत्पादन माहिती", en: "Product Info" },
    duration: "08:15",
    youtubeUrl: "https://www.youtube.com/@prachiagroindustries03",
    embedId: "",
    thumbnail: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&q=80&w=600",
    views: "12.4K",
    uploaded: "1 month ago"
  },
  {
    id: "bio-fulvic-roots-growth",
    title: {
      mr: "BIO FULVIC ८०% - पांढऱ्या मुळीचा वेगवान विकास आणि जमिनीची सुपीकता",
      en: "BIO FULVIC 80% - Fast Feeder Root Growth & Soil Fertility"
    },
    crop: { mr: "सर्व पिके (All Crops)", en: "All Crops" },
    category: { mr: "पीक मार्गदर्शन", en: "Crop Guidance" },
    duration: "06:40",
    youtubeUrl: "https://www.youtube.com/@prachiagroindustries03",
    embedId: "",
    thumbnail: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600",
    views: "18.2K",
    uploaded: "2 months ago"
  },
  {
    id: "microdefence-slurry-kit",
    title: {
      mr: "MICRODEFENCE SLURRY KIT - सर्व अन्नद्रव्यांचा संपूर्ण डोस आणि पिकांचा जोम",
      en: "MICRODEFENCE SLURRY KIT - Complete Micronutrient Formulation"
    },
    crop: { mr: "ऊस, आले, हळद, भाजीपाला", en: "Sugarcane, Ginger, Turmeric" },
    category: { mr: "खत व्यवस्थापन", en: "Fertilizer Management" },
    duration: "11:20",
    youtubeUrl: "https://www.youtube.com/@prachiagroindustries03",
    embedId: "",
    thumbnail: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=600",
    views: "24.5K",
    uploaded: "3 weeks ago"
  },
  {
    id: "sugarcane-high-yield",
    title: {
      mr: "ऊस पिकाचे भरघोस उत्पादन - एकरी १०० टन ध्येय नियोजन व खत व्यवस्थापन",
      en: "Sugarcane High Yield - 100 Tons Per Acre Fertilizer & Growth Planning"
    },
    crop: { mr: "ऊस (Sugarcane)", en: "Sugarcane" },
    category: { mr: "शेतकरी मार्गदर्शन", en: "Farmer Guidance" },
    duration: "14:10",
    youtubeUrl: "https://www.youtube.com/@prachiagroindustries03",
    embedId: "",
    thumbnail: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=600",
    views: "35.1K",
    uploaded: "1 month ago"
  },
  {
    id: "humoil-98-soil-health",
    title: {
      mr: "HUMOIL ९८ - जमिनीचा पोत सुधारून खतांची कार्यक्षमता दुप्पट करा",
      en: "HUMOIL 98 - Improve Soil Aeration and Double Fertilizer Uptake"
    },
    crop: { mr: "कापूस, सोयाबीन, भाजीपाला", en: "Cotton, Soybean, Vegetables" },
    category: { mr: "उत्पादन माहिती", en: "Product Info" },
    duration: "07:35",
    youtubeUrl: "https://www.youtube.com/@prachiagroindustries03",
    embedId: "",
    thumbnail: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=600",
    views: "9.8K",
    uploaded: "2 weeks ago"
  },
  {
    id: "tomato-magic-gold-disease",
    title: {
      mr: "टोमॅटो पिकातील करपा व फुलगळ नियंत्रण - मॅजिक गोल्ड मार्गदर्शक",
      en: "Tomato Crop Disease & Flower Drop Control - Magic Gold Guide"
    },
    crop: { mr: "टोमॅटो (Tomato)", en: "Tomato" },
    category: { mr: "प्राची अॅग्रो उत्पादने", en: "Prachi Agro Products" },
    duration: "09:05",
    youtubeUrl: "https://www.youtube.com/@prachiagroindustries03",
    embedId: "",
    thumbnail: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=600",
    views: "15.6K",
    uploaded: "3 months ago"
  },
  {
    id: "chilli-thrips-dieback",
    title: {
      mr: "मिरची पिकातील बोकड्या (थ्रिप्स) व बुरशी नियंत्रणासाठी योग्य फवारणी वेळापत्रक",
      en: "Chilli Thrips & Dieback Fungal Control - Ideal Spray Schedule"
    },
    crop: { mr: "मिरची (Chilli)", en: "Chilli" },
    category: { mr: "कीड व रोग व्यवस्थापन", en: "Pest & Disease" },
    duration: "10:50",
    youtubeUrl: "https://www.youtube.com/@prachiagroindustries03",
    embedId: "",
    thumbnail: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=600",
    views: "21.3K",
    uploaded: "1 month ago"
  },
  {
    id: "top-10-seaweed-flowering",
    title: {
      mr: "फुलधारणा आणि फळांच्या फुगवणीसाठी TOP-१० सीवीड एक्सट्रॅक्टचा योग्य वापर",
      en: "Optimal Use of TOP-10 Seaweed Extract for Profuse Flowering & Fruit Sizing"
    },
    crop: { mr: "फळबागा व भाजीपाला", en: "Fruits & Vegetables" },
    category: { mr: "उत्पादन माहिती", en: "Product Info" },
    duration: "08:45",
    youtubeUrl: "https://www.youtube.com/@prachiagroindustries03",
    embedId: "",
    thumbnail: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600",
    views: "14.9K",
    uploaded: "4 weeks ago"
  },
  {
    id: "white-kill-whitefly-guide",
    title: {
      mr: "WHITE KILL - पांढरी माशी आणि रस शोषणाऱ्या किडींचा तात्काळ नायनाट",
      en: "WHITE KILL - Fast Knockdown of Whiteflies and Sucking Pests"
    },
    crop: { mr: "कापूस, मिरची, भाजीपाला", en: "Cotton, Chilli, Vegetables" },
    category: { mr: "कीड व रोग व्यवस्थापन", en: "Pest & Disease" },
    duration: "07:15",
    youtubeUrl: "https://www.youtube.com/@prachiagroindustries03",
    embedId: "",
    thumbnail: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600",
    views: "17.4K",
    uploaded: "2 months ago"
  },
  {
    id: "bhusavardhan-soil-aeration",
    title: {
      mr: "भूसंवर्धन - माती भुसभुशीत करून मुळांना ताकद देणारे आधुनिक तंत्रज्ञान",
      en: "BHUSAVARDHAN - Soil Conditioner for Deep Feeder Root Aeration"
    },
    crop: { mr: "द्राक्षे, डाळिंब, ऊस, केळी", en: "Grapes, Pomegranate, Sugarcane" },
    category: { mr: "पीक मार्गदर्शन", en: "Crop Guidance" },
    duration: "09:30",
    youtubeUrl: "https://www.youtube.com/@prachiagroindustries03",
    embedId: "",
    thumbnail: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600",
    views: "11.1K",
    uploaded: "3 weeks ago"
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

export const getVideos = async () => {
  try {
    const res = await fetch(apiUrl('/api/videos'));
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map(v => v.embedId === 'dQw4w9WgXcQ' ? { ...v, embedId: '' } : v);
      }
    }
  } catch (err) {
    console.warn("Backend offline. Falling back to default top 10 YouTube videos.");
  }
  const data = localStorage.getItem('prachi_videos');
  if (!data) {
    localStorage.setItem('prachi_videos', JSON.stringify(defaultVideos));
    return defaultVideos;
  }
  try {
    let parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      parsed = parsed.map(v => v.embedId === 'dQw4w9WgXcQ' ? { ...v, embedId: '' } : v);
      localStorage.setItem('prachi_videos', JSON.stringify(parsed));
      return parsed;
    }
    return defaultVideos;
  } catch {
    return defaultVideos;
  }
};

export const saveVideos = async (array) => {
  try {
    localStorage.setItem('prachi_videos', JSON.stringify(array));
  } catch (err) {}
};

export const addVideo = async (video) => {
  try {
    const res = await fetch(apiUrl('/api/videos'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(video)
    });
    if (res.ok) {
      return await getVideos();
    }
  } catch (err) {
    console.warn("Backend offline. Saving to localStorage.");
  }
  const list = await getVideos();
  const newVideo = {
    ...video,
    id: video.id || (video.title?.en || 'video').toLowerCase().replace(/\s+/g, '-'),
    embedId: video.embedId || extractEmbedId(video.youtubeUrl)
  };
  list.push(newVideo);
  await saveVideos(list);
  return list;
};

export const deleteVideo = async (id) => {
  try {
    const res = await fetch(apiUrl(`/api/videos/${id}`), {
      method: 'DELETE'
    });
    if (res.ok) {
      return await getVideos();
    }
  } catch (err) {
    console.warn("Backend offline. Saving to localStorage.");
  }
  const list = await getVideos();
  const filtered = list.filter(v => v.id !== id);
  await saveVideos(filtered);
  return filtered;
};

function extractEmbedId(url) {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11 && match[2] !== 'dQw4w9WgXcQ') ? match[2] : '';
}
