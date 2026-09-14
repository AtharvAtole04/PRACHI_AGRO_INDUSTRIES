import { apiUrl, adminApiUrl } from '../config';

export const extractEmbedId = (url) => {
  if (!url) return '1gLO6UqqpwM';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '1gLO6UqqpwM';
};

const defaultVideos = [
  {
    id: "kanda",
    title: {
      mr: "कांदा (Kanda) पीक मार्गदर्शन व व्यवस्थापन",
      en: "Onion (Kanda) Crop Guidance & Management"
    },
    crop: { mr: "कांदा (Kanda)", en: "Onion (Kanda)" },
    category: { mr: "पीक मार्गदर्शन", en: "Crop Guidance" },
    duration: "05:00",
    youtubeUrl: "https://youtu.be/1gLO6UqqpwM?si=80jWj5TjjzOtdJ1Z",
    embedId: "1gLO6UqqpwM",
    thumbnail: "https://i.ytimg.com/vi/1gLO6UqqpwM/hqdefault.jpg",
    views: "15.4K",
    uploaded: "Recent"
  }
];

export const videoCategories = [
  { id: "all", title: { mr: "सर्व व्हिडिओ", en: "All Videos" } },
  { id: "crop-guidance", title: { mr: "पीक मार्गदर्शन", en: "Crop Guidance" } },
  { id: "product-info", title: { mr: "उत्पादन माहिती", en: "Product Info" } },
  { id: "farmer-guidance", title: { mr: "शेतकरी मार्गदर्शन", en: "Farmer Guidance" } },
  { id: "pest-disease", title: { mr: "कीड व रोग व्यवस्थापन", en: "Pest & Disease" } },
  { id: "fertilizer", title: { mr: "खत व्यवस्थापन", en: "Fertilizer Management" } },
  { id: "prachi-products", title: { mr: "प्राची ॲग्रो उत्पादने", en: "Prachi Agro Products" } }
];

export const getLocalVideos = () => {
  const data = localStorage.getItem('prachi_videos');
  if (!data) return defaultVideos;
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (e) {}
  return defaultVideos;
};

export const getVideos = async () => {
  try {
    const res = await fetch(apiUrl('/api/videos'));
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      const rawList = Array.isArray(data) ? data : (Array.isArray(data?.videos) ? data.videos : []);
      if (rawList.length > 0) {
        const formatted = rawList.map(v => ({
          ...v,
          embedId: v.embedId || v.id || v.videoId || extractEmbedId(v.youtubeUrl),
          youtubeUrl: v.youtubeUrl || (v.id ? `https://www.youtube.com/watch?v=${v.id}` : 'https://www.youtube.com/@prachiagroindustries03')
        }));
        saveVideos(formatted);
        return formatted;
      }
    }
  } catch (err) {
    console.warn("Backend offline. Falling back to default videos.");
  }
  return getLocalVideos();
};

export const saveVideos = async (array) => {
  try {
    localStorage.setItem('prachi_videos', JSON.stringify(array));
  } catch (err) {}
};

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('prachi_auth_token') : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const addVideo = async (video) => {
  let res;
  try {
    res = await fetch(adminApiUrl('/api/videos'), {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(video)
    });
  } catch (err) {
    console.error('[Video API Error - Add Video]:', err);
    throw new Error('Unable to connect to the backend server. Please try again.');
  }

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok || !contentType.includes('application/json')) {
    const errData = contentType.includes('application/json') ? await res.json().catch(() => ({})) : {};
    throw new Error(errData.message || errData.error || `Failed to add video (HTTP ${res.status})`);
  }

  return await getVideos();
};

export const deleteVideo = async (id) => {
  let res;
  try {
    const cleanId = encodeURIComponent(id);
    res = await fetch(adminApiUrl(`/api/videos/${cleanId}`), {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders()
      }
    });
  } catch (err) {
    console.error('[Video API Error - Delete Video]:', err);
    throw new Error('Unable to connect to the backend server. Please try again.');
  }

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok || !contentType.includes('application/json')) {
    const errData = contentType.includes('application/json') ? await res.json().catch(() => ({})) : {};
    throw new Error(errData.message || errData.error || `Failed to delete video (HTTP ${res.status})`);
  }

  return await getVideos();
};
