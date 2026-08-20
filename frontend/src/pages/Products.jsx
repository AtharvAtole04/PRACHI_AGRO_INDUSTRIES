import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getProducts } from '../data/products';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';
import SEOHead from '../components/SEOHead';
import CropFinder from '../components/CropFinder';
import ProductComparison from '../components/ProductComparison';

const Products = () => {
  const [productsList, setProductsList] = useState([]);
  useEffect(() => {
    getProducts().then(data => setProductsList(data));
  }, []);
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL queries
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialFilter = searchParams.get('filter') || ''; // 'popular', 'new', 'offers'

  // Local state
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [sortBy, setSortBy] = useState('popularity');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [compareList, setCompareList] = useState([]);

  const handleCompare = (product) => {
    setCompareList(prev => {
      const isAlreadyAdded = prev.find(p => p.id === product.id);
      if (isAlreadyAdded) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 3) {
        alert(language === 'mr' ? 'तुम्ही जास्तीत जास्त ३ उत्पादनांची तुलना करू शकता.' : 'You can compare up to 3 products.');
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleClearCompare = () => setCompareList([]);

  // Sync URL search parameters with state
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  // Handle resetting filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setMaxPrice(2500);
    setSortBy('popularity');
    setSearchParams({});
  };

  // Filter and Sort Logic
  const filteredProducts = productsList
    .filter((product) => {
      // 1. Search Query Match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(query);
        const descMatch = (product.shortDescription[language] || '').toLowerCase().includes(query);
        const catMatch = product.category.toLowerCase().includes(query);
        const tagMatch = (product.tagline[language] || '').toLowerCase().includes(query);
        if (!nameMatch && !descMatch && !catMatch && !tagMatch) return false;
      }
      
      // 2. Category Match
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // 3. Price Filter (checking basePrice)
      if (product.basePrice > maxPrice) {
        return false;
      }

      // 4. Special Promo filter (from URL)
      if (initialFilter === 'popular' && !product.isPopular) return false;
      if (initialFilter === 'new' && !product.isNew) return false;
      if (initialFilter === 'offers' && !(product.originalPrice > product.basePrice)) return false;

      return true;
    })
    .sort((a, b) => {
      // Sorting
      if (sortBy === 'price-low') {
        return a.basePrice - b.basePrice;
      }
      if (sortBy === 'price-high') {
        return b.basePrice - a.basePrice;
      }
      if (sortBy === 'newest') {
        return a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1;
      }
      // default: popularity
      return b.rating - a.rating;
    });

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setSearchParams(params => {
      if (catId) {
        params.set('category', catId);
      } else {
        params.delete('category');
      }
      return params;
    });
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <SEOHead title="All Products - Prachi Agro Industries" />
      
      {/* Crop Finder — desktop/tablet only */}
      <div className="hidden md:block">
        <CropFinder />
      </div>
      
      {/* Title / Info bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-brand-green-dark tracking-tight m-0">
            {language === 'mr' ? 'सर्व उत्पादने' : 'All Products'}
          </h1>
          <p className="text-slate-400 text-xs font-bold mt-1">
            {language === 'mr' ? `${filteredProducts.length} उत्पादने सापडली` : `Showing ${filteredProducts.length} agricultural products`}
          </p>
        </div>

        {/* Sort and mobile filter toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
          >
            <Filter size={14} />
            <span>फिल्टर्स (Filters)</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide hidden sm:inline">
              क्रमानुसार (Sort By):
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-green-dark cursor-pointer transition-all"
            >
              <option value="popularity">{language === 'mr' ? 'लोकप्रियता' : 'Popularity'}</option>
              <option value="newest">{language === 'mr' ? 'नवीन उत्पादने' : 'Newest'}</option>
              <option value="price-low">{language === 'mr' ? 'किंमत: कमी ते जास्त' : 'Price: Low to High'}</option>
              <option value="price-high">{language === 'mr' ? 'किंमत: जास्त ते कमी' : 'Price: High to Low'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="flex gap-8 items-start">
        
        {/* Sidebar Filters (Desktop only) */}
        <aside className="w-64 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hidden md:flex flex-col gap-6 sticky top-28 self-start">
          
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-brand-green-dark" />
              <span>फिल्टर्स (Filters)</span>
            </h3>
            <button 
              onClick={resetFilters}
              className="text-[10px] font-black text-brand-magenta hover:underline cursor-pointer uppercase"
            >
              रीसेट (Reset)
            </button>
          </div>

          {/* Search Sub-Filter */}
          {searchQuery && (
            <div className="bg-slate-50 p-2.5 rounded-lg flex items-center justify-between border border-slate-200/50">
              <span className="text-xs font-bold text-slate-600 truncate max-w-[150px]">
                "{searchQuery}"
              </span>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSearchParams(params => { params.delete('search'); return params; });
                }}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Categories list */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
              {t('categories')}
            </h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleCategorySelect('')}
                className={`w-full text-left text-xs font-bold px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === ''
                    ? 'bg-brand-green-dark text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {language === 'mr' ? 'सर्व श्रेणी (All)' : 'All Categories'}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`w-full text-left text-xs font-bold px-3 py-2 rounded-lg transition-all cursor-pointer truncate ${
                    selectedCategory === cat.id
                      ? 'bg-brand-green-dark text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                  title={t(cat.title)}
                >
                  {t(cat.title)}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex justify-between">
              <span>किंमत (Max Price)</span>
              <span className="text-brand-green-dark">₹{maxPrice}</span>
            </h4>
            <input
              type="range"
              min="150"
              max="2500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-green-dark"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2">
              <span>₹150</span>
              <span>₹2500</span>
            </div>
          </div>

        </aside>

        {/* Product Grid Area */}
        <div className="flex-1 flex flex-col gap-8">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
              <h3 className="font-extrabold text-slate-800 text-lg mb-2">
                कोणतीही उत्पादने आढळली नाहीत!
              </h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                {language === 'mr' 
                  ? 'कृपया वेगळा कीवर्ड वापरा किंवा फिल्टर रीसेट करा.' 
                  : 'No products matched your selections. Try adjusting or clearing your filters.'}
              </p>
              <button
                onClick={resetFilters}
                className="bg-brand-green-dark hover:bg-brand-green-light text-white font-bold text-sm px-6 py-2.5 rounded-full cursor-pointer transition-all active:scale-95 shadow-md"
              >
                फिल्टर्स रीसेट करा (Clear Filters)
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isInCompare={compareList.some(p => p.id === product.id)}
                    onCompare={handleCompare}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredProducts.length && (
                <button
                  onClick={handleLoadMore}
                  className="mx-auto bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 text-slate-700 font-bold text-sm px-8 py-3 rounded-full cursor-pointer shadow-sm hover:shadow transition-all"
                >
                  आणखी उत्पादने दाखवा (Load More)
                </button>
              )}
            </>
          )}
        </div>

      </div>

      {/* Mobile Filters Slide-out Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          <div 
            onClick={() => setShowMobileFilters(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-xs bg-white flex flex-col shadow-2xl p-5 overflow-y-auto">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-6">
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
                  फिल्टर्स (Filters)
                </h3>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Reset link */}
              <button
                onClick={() => {
                  resetFilters();
                  setShowMobileFilters(false);
                }}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs text-center rounded-lg border border-slate-200 mb-6 cursor-pointer"
              >
                सर्व रीसेट करा (Reset All)
              </button>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
                  {t('categories')}
                </h4>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => {
                      handleCategorySelect('');
                      setShowMobileFilters(false);
                    }}
                    className={`w-full text-left text-xs font-bold px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                      selectedCategory === ''
                        ? 'bg-brand-green-dark text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    सर्व श्रेणी (All)
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        handleCategorySelect(cat.id);
                        setShowMobileFilters(false);
                      }}
                      className={`w-full text-left text-xs font-bold px-3 py-2.5 rounded-lg transition-all cursor-pointer truncate ${
                        selectedCategory === cat.id
                          ? 'bg-brand-green-dark text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t(cat.title)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="mb-6">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex justify-between">
                  <span>किंमत (Max Price)</span>
                  <span className="text-brand-green-dark">₹{maxPrice}</span>
                </h4>
                <input
                  type="range"
                  min="150"
                  max="2500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-green-dark"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2">
                  <span>₹150</span>
                  <span>₹2500</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <ProductComparison 
        compareList={compareList}
        onRemove={(id) => setCompareList(prev => prev.filter(p => p.id !== id))}
        onClear={handleClearCompare}
      />
    </div>
  );
};

export default Products;
