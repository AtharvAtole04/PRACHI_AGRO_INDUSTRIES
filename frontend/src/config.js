export const RENDER_API_BASE = 'https://prachi-agro-industries.onrender.com';

// Centralized API configuration supporting local dev, Vercel proxying, and Render monorepo
const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    const raw = import.meta.env.VITE_API_URL;
    return raw.endsWith('/') ? raw.slice(0, -1) : raw;
  }
  // In browser environments (Vercel, Render frontend, or Localhost),
  // return empty string so requests go through the local host domain proxy (/api/...)
  return '';
};

export const API_BASE = getApiBase();

export const apiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
};

export const adminApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (import.meta.env.VITE_RENDER_API_URL) {
    const raw = import.meta.env.VITE_RENDER_API_URL;
    const base = raw.endsWith('/') ? raw.slice(0, -1) : raw;
    return `${base}${cleanEndpoint}`;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return `${API_BASE}${cleanEndpoint}`;
  }
  return `${RENDER_API_BASE}${cleanEndpoint}`;
};

