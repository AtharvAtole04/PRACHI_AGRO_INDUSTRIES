// Centralized API configuration supporting local dev, Vercel (decoupled), and Render (monorepo/standalone)
const rawBase = import.meta.env.VITE_API_URL || '';
export const API_BASE = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

export const apiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
};
