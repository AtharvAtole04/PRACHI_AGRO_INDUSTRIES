// Centralized API configuration supporting local dev, Vercel (decoupled), and Render (monorepo/standalone)
const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    const raw = import.meta.env.VITE_API_URL;
    return raw.endsWith('/') ? raw.slice(0, -1) : raw;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // On local dev server, use relative path (proxied by Vite to local Express backend)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return '';
    }
  }
  // For all production hostnames (Render, Vercel, prachiagroindustries.in), target live Render backend
  return 'https://prachi-agro-industries.onrender.com';
};

export const API_BASE = getApiBase();

export const apiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
};
