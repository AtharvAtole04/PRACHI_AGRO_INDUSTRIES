// Centralized API configuration supporting local dev and Vercel Serverless architecture
const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    const raw = import.meta.env.VITE_API_URL;
    return raw.endsWith('/') ? raw.slice(0, -1) : raw;
  }
  // In browser environments (Vercel or Localhost),
  // return empty string so requests route to same-origin (/api/...)
  return '';
};

export const API_BASE = getApiBase();

export const apiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
};

export const adminApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
};

