import { apiUrl } from '../config';

const defaultReviews = [
  {
    id: 1,
    name: "रामचंद्र पाटील",
    location: "नाशिक",
    crop: { mr: "द्राक्षे", en: "Grapes" },
    rating: 5,
    photo: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=100",
    review: {
      mr: "माझ्या द्राक्ष बागेवर मागील वर्षी मोठ्या प्रमाणावर बुरशीचा प्रादुर्भाव झाला होता. मी प्राची अॅग्रोचे 'BACTRIKILLER' वापरले, आणि अगदी २ फवारण्यांमध्ये उत्कृष्ट परिणाम मिळाला. बुरशी पूर्णपणे आटोक्यात आली.",
      en: "Last year, my grape orchard suffered a heavy fungal outbreak. I sprayed Prachi Agro's 'BACTRIKILLER' and observed amazing results in just two applications. The fungus was completely controlled."
    }
  },
  {
    id: 2,
    name: "संजय देशमुख",
    location: "सांगली",
    crop: { mr: "हळद व मिरची", en: "Turmeric & Chilli" },
    rating: 5,
    photo: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=100",
    review: {
      mr: "मिरचीच्या झाडांची पाने बोकडल्यासारखी (आकसलेली) झाली होती. कृषी तज्ज्ञांच्या सल्ल्यानुसार मी 'MYCRODIFENCE' आणि 'FAST RESULT' फवारले. मिरचीची पाने आता सुंदर व हिरवीगार झाली आहेत आणि फुलांची संख्याही वाढली आहे.",
      en: "My chilli plants had severe leaf curling issues. Following recommendations, I sprayed 'MYCRODIFENCE' and 'FAST RESULT'. The foliage is now lush green and healthy, and the number of flower buds has doubled."
    }
  },
  {
    id: 3,
    name: "विठ्ठलराव कदम",
    location: "यवतमाळ",
    crop: { mr: "कापूस व सोयाबीन", en: "Cotton & Soybean" },
    rating: 5,
    photo: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=100",
    review: {
      mr: "कापसाचे पाते गळत असल्यामुळे मी काळजीत होतो. प्राची अॅग्रोचे 'MAGIC GOLD' वनस्पती वाढ प्रवर्तक वापरले. पातेगळ पूर्ण थांबली आणि कापसाची झाडे वेगाने वाढू लागली. या कंपनीची उत्पादने अत्यंत खात्रीशीर आहेत.",
      en: "I was worried about the severe flower bud drop in my cotton field. I applied Prachi Agro's 'MAGIC GOLD' growth promoter. The drop stopped completely, and the plants grew vigorously. Highly reliable products."
    }
  },
  {
    id: 4,
    name: "ज्ञानेश्वर शिंदे",
    location: "सोलापूर",
    crop: { mr: "डाळिंब व भाजीपाला", en: "Pomegranate & Vegetables" },
    rating: 4,
    photo: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=100",
    review: {
      mr: "ठिबक सिंचनाद्वारे 'NUTRI GROW-50' वापरल्यामुळे डाळिंबाची पांढरी मुळी वेगाने वाढली. फळांची गुणवत्ता आणि वजन वाढल्यामुळे बाजारात मला चांगला नफा मिळाला. सर्व शेतकऱ्यांना वापरण्याची शिफारस करतो.",
      en: "Using 'NUTRI GROW-50' through drip irrigation stimulated rapid feeder root development in pomegranate trees. The improvement in fruit weight and quality got me excellent market returns."
    }
  }
];

export const getReviews = async () => {
  try {
    const res = await fetch(apiUrl('/api/reviews'));
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend offline. Falling back to localStorage for reviews.");
  }
  const data = localStorage.getItem('prachi_reviews');
  if (!data) {
    localStorage.setItem('prachi_reviews', JSON.stringify(defaultReviews));
    return defaultReviews;
  }
  return JSON.parse(data);
};

export const saveReviews = async (array) => {
  try {
    localStorage.setItem('prachi_reviews', JSON.stringify(array));
  } catch (err) {}
};

export const addReview = async (review) => {
  try {
    const res = await fetch(apiUrl('/api/reviews'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    if (res.ok) {
      return await getReviews();
    }
  } catch (err) {
    console.warn("Backend offline. Saving to localStorage.");
  }
  const list = await getReviews();
  const newReview = {
    ...review,
    id: review.id || Math.floor(1000 + Math.random() * 9000),
    photo: review.photo || "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=100"
  };
  list.push(newReview);
  await saveReviews(list);
  return list;
};

export const deleteReview = async (id) => {
  try {
    const res = await fetch(apiUrl(`/api/reviews/${id}`), {
      method: 'DELETE'
    });
    if (res.ok) {
      return await getReviews();
    }
  } catch (err) {
    console.warn("Backend offline. Saving to localStorage.");
  }
  const list = await getReviews();
  const filtered = list.filter(r => String(r.id) !== String(id) && String(r._id) !== String(id));
  await saveReviews(filtered);
  return filtered;
};
