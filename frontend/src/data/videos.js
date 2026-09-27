import { apiUrl, adminApiUrl } from '../config';

export const extractEmbedId = (url) => {
  if (!url) return '1gLO6UqqpwM';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '1gLO6UqqpwM';
};

export const videoCategories = [
  { id: "all", title: { mr: "सर्व व्हिडिओ", en: "All Videos" } },
  { id: "crop-guidance", title: { mr: "पीक मार्गदर्शन", en: "Crop Guidance" } },
  { id: "product-info", title: { mr: "उत्पादन माहिती", en: "Product Info" } },
  { id: "farmer-guidance", title: { mr: "शेतकरी मार्गदर्शन", en: "Farmer Guidance" } },
  { id: "pest-disease", title: { mr: "कीड व रोग व्यवस्थापन", en: "Pest & Disease" } },
  { id: "fertilizer", title: { mr: "खत व्यवस्थापन", en: "Fertilizer Management" } },
  { id: "prachi-products", title: { mr: "प्राची ॲग्रो उत्पादने", en: "Prachi Agro Products" } }
];

export const getLocalVideos = () => [];

export const getVideos = async (forceFresh = false) => {
  try {
    const url = forceFresh ? apiUrl(`/api/videos?t=${Date.now()}`) : apiUrl('/api/videos');
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      const rawList = Array.isArray(data) ? data : (Array.isArray(data?.videos) ? data.videos : []);
      return rawList.map(v => ({
        ...v,
        id: v.id || v._id,
        _id: v._id || v.id,
        embedId: v.embedId || v.id || v.videoId || extractEmbedId(v.youtubeUrl),
        youtubeUrl: v.youtubeUrl || (v.id ? `https://www.youtube.com/watch?v=${v.id}` : 'https://www.youtube.com/@prachiagroindustries03')
      }));
    }
  } catch (err) {
    console.warn("API Error fetching videos:", err.message);
  }
  return [];
};

export const saveVideos = async (array) => {};

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
        'Cache-Control': 'no-cache',
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

  return await getVideos(true);
};

export const updateVideo = async (id, video) => {
  let res;
  try {
    const cleanId = encodeURIComponent(id);
    res = await fetch(adminApiUrl(`/api/videos/${cleanId}`), {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        ...getAuthHeaders()
      },
      body: JSON.stringify(video)
    });
  } catch (err) {
    console.error('[Video API Error - Update Video]:', err);
    throw new Error('Unable to connect to the backend server. Please try again.');
  }

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok || !contentType.includes('application/json')) {
    const errData = contentType.includes('application/json') ? await res.json().catch(() => ({})) : {};
    throw new Error(errData.message || errData.error || `Failed to update video (HTTP ${res.status})`);
  }

  return await getVideos(true);
};

export const deleteVideo = async (id) => {
  let res;
  try {
    const cleanId = encodeURIComponent(id);
    res = await fetch(adminApiUrl(`/api/videos/${cleanId}`), {
      method: 'DELETE',
      headers: {
        'Cache-Control': 'no-cache',
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

  return await getVideos(true);
};
