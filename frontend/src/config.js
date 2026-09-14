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
