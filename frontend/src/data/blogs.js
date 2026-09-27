import { apiUrl, adminApiUrl } from '../config';

export const getBlogs = async (forceFresh = false) => {
  try {
    const url = forceFresh ? apiUrl(`/api/blogs?t=${Date.now()}`) : apiUrl('/api/blogs');
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map(b => ({
          ...b,
          id: b.id || b._id,
          _id: b._id || b.id,
          date: b.date || b.createdAt || new Date().toISOString(),
          readTime: b.readTime || '5 min read',
          image: b.image || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600'
        }));
      }
    }
  } catch (err) {
    console.warn("API Error fetching blogs:", err.message);
  }
  return [];
};

export const getLocalBlogs = () => [];

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('prachi_auth_token') : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const addBlog = async (blog) => {
  let res;
  try {
    res = await fetch(adminApiUrl('/api/blogs'), {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        ...getAuthHeaders()
      },
      body: JSON.stringify(blog)
    });
  } catch (err) {
    console.error('[Blog API Error - Add Blog]:', err);
    throw new Error('Unable to connect to the backend server. Please try again.');
  }

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok || !contentType.includes('application/json')) {
    const errData = contentType.includes('application/json') ? await res.json().catch(() => ({})) : {};
    throw new Error(errData.message || errData.error || `Failed to add blog (HTTP ${res.status})`);
  }

  return await getBlogs(true);
};

export const updateBlog = async (id, blog) => {
  let res;
  try {
    const cleanId = encodeURIComponent(id);
    res = await fetch(adminApiUrl(`/api/blogs/${cleanId}`), {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        ...getAuthHeaders()
      },
      body: JSON.stringify(blog)
    });
  } catch (err) {
    console.error('[Blog API Error - Update Blog]:', err);
    throw new Error('Unable to connect to the backend server. Please try again.');
  }

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok || !contentType.includes('application/json')) {
    const errData = contentType.includes('application/json') ? await res.json().catch(() => ({})) : {};
    throw new Error(errData.message || errData.error || `Failed to update blog (HTTP ${res.status})`);
  }

  return await getBlogs(true);
};

export const deleteBlog = async (id) => {
  let res;
  try {
    const cleanId = encodeURIComponent(id);
    res = await fetch(adminApiUrl(`/api/blogs/${cleanId}`), {
      method: 'DELETE',
      headers: {
        'Cache-Control': 'no-cache',
        ...getAuthHeaders()
      }
    });
  } catch (err) {
    console.error('[Blog API Error - Delete Blog]:', err);
    throw new Error('Unable to connect to the backend server. Please try again.');
  }

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok || !contentType.includes('application/json')) {
    const errData = contentType.includes('application/json') ? await res.json().catch(() => ({})) : {};
    throw new Error(errData.message || errData.error || `Failed to delete blog (HTTP ${res.status})`);
  }

  return await getBlogs(true);
};
