import React, { useEffect } from 'react';

const SEOHead = ({ title, description, keywords, image }) => {
  useEffect(() => {
    // Set document title
    if (title) {
      document.title = title;
    }

    // Helper to set meta tags
    const setMetaTag = (attr, key, value) => {
      if (!value) return;
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    
  }, [title, description, keywords, image]);

  return null;
};

export default SEOHead;
