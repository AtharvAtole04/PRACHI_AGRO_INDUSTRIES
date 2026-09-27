import { apiUrl, adminApiUrl } from '../config';

export const getReviews = async (forceFresh = false) => {
  try {
    const url = forceFresh ? apiUrl(`/api/reviews?t=${Date.now()}`) : apiUrl('/api/reviews');
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map(r => ({
          ...r,
          id: r.id || r._id,
          _id: r._id || r.id
        }));
      }
    }
  } catch (err) {
    console.warn("API Error fetching reviews:", err.message);
  }
  return [];
};

export const saveReviews = async (array) => {};

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('prachi_auth_token') : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const addReview = async (review) => {
  let res;
  try {
    res = await fetch(adminApiUrl('/api/reviews'), {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        ...getAuthHeaders()
      },
      body: JSON.stringify(review)
    });
  } catch (err) {
    console.error('[Review API Error - Add Review]:', err);
    throw new Error('Unable to connect to the backend server. Please try again.');
  }

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok || !contentType.includes('application/json')) {
    const errData = contentType.includes('application/json') ? await res.json().catch(() => ({})) : {};
    throw new Error(errData.message || errData.error || `Failed to add review (HTTP ${res.status})`);
  }

  return await getReviews(true);
};

export const updateReview = async (id, review) => {
  let res;
  try {
    const cleanId = encodeURIComponent(id);
    res = await fetch(adminApiUrl(`/api/reviews/${cleanId}`), {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        ...getAuthHeaders()
      },
      body: JSON.stringify(review)
    });
  } catch (err) {
    console.error('[Review API Error - Update Review]:', err);
    throw new Error('Unable to connect to the backend server. Please try again.');
  }

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok || !contentType.includes('application/json')) {
    const errData = contentType.includes('application/json') ? await res.json().catch(() => ({})) : {};
    throw new Error(errData.message || errData.error || `Failed to update review (HTTP ${res.status})`);
  }

  return await getReviews(true);
};

export const deleteReview = async (id) => {
  let res;
  try {
    const cleanId = encodeURIComponent(id);
    res = await fetch(adminApiUrl(`/api/reviews/${cleanId}`), {
      method: 'DELETE',
      headers: {
        'Cache-Control': 'no-cache',
        ...getAuthHeaders()
      }
    });
  } catch (err) {
    console.error('[Review API Error - Delete Review]:', err);
    throw new Error('Unable to connect to the backend server. Please try again.');
  }

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok || !contentType.includes('application/json')) {
    const errData = contentType.includes('application/json') ? await res.json().catch(() => ({})) : {};
    throw new Error(errData.message || errData.error || `Failed to delete review (HTTP ${res.status})`);
  }

  return await getReviews(true);
};
