import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getProducts } from '../data/products';

const SearchBar = () => {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // Fetch product dataset safely
  useEffect(() => {
    const loadProducts = () => {
      getProducts().then(data => {
        if (Array.isArray(data)) {
          setAllProducts(data);
        }
      }).catch(err => console.warn('Failed to load products for search:', err));
    };

    loadProducts();
    window.addEventListener('prachi_products_updated', loadProducts);
    return () => window.removeEventListener('prachi_products_updated', loadProducts);
  }, []);

  // Filter products based on query
  useEffect(() => {
    if (query.trim().length > 0 && Array.isArray(allProducts)) {
      const q = query.trim().toLowerCase();
      const filtered = allProducts.filter(product => {
        if (!product) return false;
        const name = (product.name || '').toLowerCase();
        
        const taglineMr = (product.tagline?.mr || (typeof product.tagline === 'string' ? product.tagline : '') || '').toLowerCase();
        const taglineEn = (product.tagline?.en || '').toLowerCase();

        const shortDescMr = (product.shortDescription?.mr || (typeof product.shortDescription === 'string' ? product.shortDescription : '') || '').toLowerCase();
        const shortDescEn = (product.shortDescription?.en || '').toLowerCase();

        const cropsMr = (product.crops?.mr || (typeof product.crops === 'string' ? product.crops : '') || '').toLowerCase();
        const cropsEn = (product.crops?.en || '').toLowerCase();

        const category = (product.category || '').toLowerCase();

        return name.includes(q) || taglineMr.includes(q) || taglineEn.includes(q) || shortDescMr.includes(q) || shortDescEn.includes(q) || cropsMr.includes(q) || cropsEn.includes(q) || category.includes(q);
      });
      setSuggestions(filtered.slice(0, 6)); // Limit to top 6 suggestions
    } else {
      setSuggestions([]);
    }
  }, [query, allProducts]);

  // Handle outside clicks to close suggestion dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
    } else {
      navigate('/products');
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (product) => {
    const prodId = product.id || product._id;
    if (prodId) {
      navigate(`/products/${prodId}`);
    } else {
      navigate(`/products?search=${encodeURIComponent(product.name)}`);
    }
    setQuery('');
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit} className="flex items-center w-full">
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={language === 'mr' ? 'उदा. BACTERIKILLER, MAGIC GOLD, किंवा कांदा, ऊस' : 'Search products e.g. Magic Gold, Fungicide...'}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-l-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-green-dark focus:border-transparent text-xs sm:text-sm font-semibold transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions([]); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-brand-green-dark hover:bg-brand-green-light active:scale-95 text-white px-5 py-2.5 rounded-r-xl text-xs sm:text-sm font-black cursor-pointer transition-all border border-brand-green-dark flex items-center gap-1.5 flex-shrink-0"
        >
          <Search size={16} />
          <span>{language === 'mr' ? 'शोधा' : 'Search'}</span>
        </button>
      </form>

      {/* Suggestion Dropdown */}
      {showDropdown && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {suggestions.length > 0 ? (
            suggestions.map((product) => {
              const displayTagline = typeof product.tagline === 'object'
                ? (product.tagline[language] || product.tagline?.mr || product.tagline?.en || '')
                : (product.tagline || '');
              return (
                <div
                  key={product.id || product._id || product.name}
                  onClick={() => handleSuggestionClick(product)}
                  className="flex items-center gap-3 p-3 hover:bg-emerald-50/60 cursor-pointer transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl border border-slate-100 flex-shrink-0 flex items-center justify-center p-1 bg-white shadow-xs">
                    <img
                      src={product.image || '/assets/products/placeholder.svg'}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => { e.target.src = '/assets/logo.png'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-brand-green-dark truncate">{product.name}</h4>
                    {displayTagline && (
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{displayTagline}</p>
                    )}
                  </div>
                  <span className="text-xs font-black bg-emerald-100 text-brand-green-dark px-2.5 py-1 rounded-lg flex-shrink-0">
                    ₹{product.basePrice}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-xs text-slate-400 font-medium">
              {language === 'mr' ? `"${query}" साठी कोणतीही उत्पादने सापडली नाहीत` : `No products found for "${query}"`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
