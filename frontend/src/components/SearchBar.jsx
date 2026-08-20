import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getProducts } from '../data/products';

const SearchBar = () => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // Filter products based on query
  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = getProducts().filter(product => {
        const nameMatch = product.name.toLowerCase().includes(query.toLowerCase());
        const descMatch = (product.shortDescription[language] || '').toLowerCase().includes(query.toLowerCase());
        const categoryMatch = product.category.toLowerCase().includes(query.toLowerCase());
        const tagMatch = (product.tagline[language] || '').toLowerCase().includes(query.toLowerCase());
        
        return nameMatch || descMatch || categoryMatch || tagMatch;
      });
      setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
    } else {
      setSuggestions([]);
    }
  }, [query, language]);

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
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/products/${productId}`);
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
            placeholder={t('searchPlaceholder')}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-l-md pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-green-dark focus:border-transparent text-sm transition-all"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-brand-green-dark"
          >
            <Search size={18} />
          </button>
        </div>
        <button
          type="submit"
          className="bg-brand-green-dark hover:bg-brand-green-light active:scale-95 text-white px-5 py-2.5 rounded-r-md text-sm font-semibold cursor-pointer transition-all border border-brand-green-dark"
        >
          {t('searchBtn')}
        </button>
      </form>

      {/* Suggestion Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-100 rounded-md shadow-lg z-50 overflow-hidden divide-y divide-slate-100">
          {suggestions.map((product) => (
            <div
              key={product.id}
              onClick={() => handleSuggestionClick(product.id)}
              className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded border border-slate-100 flex-shrink-0 flex items-center justify-center p-1 bg-slate-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Agri' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-brand-green-dark truncate">{product.name}</h4>
                <p className="text-xs text-slate-500 truncate">{t(product.shortDescription)}</p>
              </div>
              <span className="text-xs font-semibold bg-emerald-50 text-brand-green-dark px-2 py-0.5 rounded">
                ₹{product.basePrice}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
