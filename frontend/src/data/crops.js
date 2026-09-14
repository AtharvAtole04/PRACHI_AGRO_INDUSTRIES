import { apiUrl } from '../config';

export const defaultCrops = [
  { id: 'onion', name: { mr: 'कांदा (Onion)', en: 'Onion' }, logo: '🧅', tag: { mr: 'कंद फुगवण व पातीचे पोषण', en: 'Bulb growth & foliage nutrition' } },
  { id: 'sugarcane', name: { mr: 'ऊस (Sugarcane)', en: 'Sugarcane' }, logo: '🎋', tag: { mr: 'कांडीची लांबी व वजन वाढ', en: 'Cane length & weight booster' } },
  { id: 'tomato', name: { mr: 'टोमॅटो (Tomato)', en: 'Tomato' }, logo: '🍅', tag: { mr: 'फुलधारणा व फळांची चमक', en: 'Flowering & fruit shine' } },
  { id: 'papaya', name: { mr: 'पपई (Papaya)', en: 'Papaya' }, logo: '🍈', tag: { mr: 'बुरशी रक्षण व फळांचा आकार', en: 'Fungus defense & fruit size' } },
  { id: 'chilli', name: { mr: 'मिरची (Chilli)', en: 'Chilli' }, logo: '🌶️', tag: { mr: 'चुरडा-मुरडा नियंत्रण व फुटवे', en: 'Leaf curl control & branching' } },
  { id: 'cotton', name: { mr: 'कापूस (Cotton)', en: 'Cotton' }, logo: '🌿', tag: { mr: 'पांढरी मुळी व बोंड वाढ', en: 'White root development & boll growth' } },
  { id: 'soybean', name: { mr: 'सोयाबीन (Soybean)', en: 'Soybean' }, logo: '🫘', tag: { mr: 'शेंगांची संख्या व दाणे भरणी', en: 'Pod formation & grain filling' } },
  { id: 'pomegranate', name: { mr: 'डाळिंब (Pomegranate)', en: 'Pomegranate' }, logo: '🍎', tag: { mr: 'तेल्या व बुरशी नियंत्रण', en: 'Bacterial blight & fungus defense' } },
  { id: 'banana', name: { mr: 'केळी (Banana)', en: 'Banana' }, logo: '🍌', tag: { mr: 'घडाचे वजन व झाडाचा जोम', en: 'Bunch weight & plant vigor' } }
];

export const getLocalCrops = () => {
  try {
    const saved = localStorage.getItem('prachi_crops_list');
    return saved ? JSON.parse(saved) : defaultCrops;
  } catch {
    return defaultCrops;
  }
};

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('prachi_auth_token') : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getCrops = async () => {
  try {
    const res = await fetch(apiUrl('/api/crops'));
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem('prachi_crops_list', JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend crops endpoint offline, using local crops data.');
  }

  return getLocalCrops();
};

export const addCrop = async (cropData) => {
  let res;
  try {
    res = await fetch(apiUrl('/api/crops'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(cropData)
    });
  } catch (err) {
    console.warn('Backend offline, saving crop locally.');
  }

  if (res && res.ok) {
    const data = await res.json();
    window.dispatchEvent(new Event('prachi_crops_updated'));
    return data.crop;
  }

  // Local fallback
  const localCrops = getLocalCrops();
  const newCrop = {
    ...cropData,
    id: `crop-${Date.now()}`,
    _id: `crop-${Date.now()}`
  };
  localCrops.push(newCrop);
  localStorage.setItem('prachi_crops_list', JSON.stringify(localCrops));
  window.dispatchEvent(new Event('prachi_crops_updated'));
  return newCrop;
};

export const deleteCrop = async (id) => {
  let res;
  try {
    res = await fetch(apiUrl(`/api/crops/${id}`), {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders()
      }
    });
  } catch (err) {
    console.warn('Backend offline, deleting crop locally.');
  }

  // Local fallback update
  const localCrops = getLocalCrops();
  const filtered = localCrops.filter(c => (c.id !== id && c._id !== id));
  localStorage.setItem('prachi_crops_list', JSON.stringify(filtered));
  window.dispatchEvent(new Event('prachi_crops_updated'));
  return true;
};
