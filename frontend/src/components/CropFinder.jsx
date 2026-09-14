import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getProducts } from '../data/products';
import { getCrops } from '../data/crops';
import { ArrowRight } from 'lucide-react';

const CropFinder = () => {
  const { language } = useLanguage();
  const [cropsList, setCropsList] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    getProducts().then(data => setProducts(data));
    getCrops().then(data => {
      setCropsList(data);
      if (Array.isArray(data) && data.length > 0) {
        setSelectedCrop(data[0]);
      }
    });

    const handleCropsUpdate = () => {
      getCrops().then(data => setCropsList(data));
    };
    window.addEventListener('prachi_crops_updated', handleCropsUpdate);
    return () => window.removeEventListener('prachi_crops_updated', handleCropsUpdate);
  }, []);

  useEffect(() => {
    if (!selectedCrop) {
      setFilteredProducts([]);
      return;
    }
    
    const cropId = (selectedCrop.id || '').toLowerCase();
    const cropNameEn = (selectedCrop.name?.en || (typeof selectedCrop.name === 'string' ? selectedCrop.name : '') || '').toLowerCase();
    const cropNameMr = (selectedCrop.name?.mr || '').toLowerCase();
    const tagEn = (selectedCrop.tag?.en || '').toLowerCase();

    const matched = products.filter(product => {
      if (!product) return false;

      // 1. Check associatedCrops array match
      if (Array.isArray(product.associatedCrops) && product.associatedCrops.length > 0) {
        const hasMatch = product.associatedCrops.some(ac => {
          const k = String(ac).toLowerCase();
          return (cropId && k === cropId) || (cropNameEn && k === cropNameEn) || (cropNameMr && k === cropNameMr) || (tagEn && k === tagEn);
        });
        if (hasMatch) return true;
      }

      // 2. Fallback check crops text string/object
      const rawCrops = product.crops;
      const pCropsStr = typeof rawCrops === 'string' ? rawCrops.toLowerCase() : '';
      const pCropsEn = (rawCrops?.en || '').toLowerCase();
      const pCropsMr = (rawCrops?.mr || '').toLowerCase();

      return (cropNameEn && pCropsEn.includes(cropNameEn)) || 
             (cropNameMr && pCropsMr.includes(cropNameMr)) || 
             (cropNameEn && pCropsStr.includes(cropNameEn)) || 
             (cropNameMr && pCropsStr.includes(cropNameMr)) ||
             (cropId && pCropsStr.includes(cropId));
    });
    
    setFilteredProducts(matched.slice(0, 4));
  }, [selectedCrop, products]);

  if (cropsList.length === 0) return null;

  const selectedCropName = selectedCrop?.name?.[language] || selectedCrop?.name?.mr || selectedCrop?.name?.en || '';
  const selectedCropTag = selectedCrop?.tag?.[language] || selectedCrop?.tag?.mr || selectedCrop?.tag?.en || '';
  const selectedCropId = selectedCrop?.id || selectedCrop?.tag?.en || selectedCropName;

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-100 pb-4">
        <div>
          <span className="bg-emerald-50 text-brand-green-dark text-[10px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full inline-block">
            {language === 'mr' ? 'पिकांनुसार विशेष उपाययोजना' : 'Crop Care Solutions'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-brand-green-dark tracking-tight mt-1">
            {language === 'mr' ? 'तुमच्या पिकासाठी योग्य उत्पादने निवडा' : 'Find Best Products For Your Crop'}
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-bold">
          {language === 'mr' ? 'पिकाच्या लोगोवर क्लिक करा व उत्पादने पहा' : 'Click crop logo to see solutions'}
        </p>
      </div>
      
      {/* Crop Pills */}
      <div className="flex flex-wrap gap-2.5 justify-start mb-6">
        {cropsList.map(crop => {
          const isSelected = (selectedCrop?.id && crop.id && selectedCrop.id === crop.id) || selectedCrop === crop;
          const nameText = crop.name?.[language] || crop.name?.mr || crop.name?.en || crop.id;

          return (
            <button
              key={crop.id || crop._id}
              onClick={() => setSelectedCrop(crop)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all duration-300 border cursor-pointer ${
                isSelected 
                  ? 'bg-brand-green-dark text-white border-brand-green-dark shadow-md scale-105' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <span className="text-base">{crop.logo || '🌱'}</span>
              <span>{nameText}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Crop Recommendations Banner */}
      {selectedCrop && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{selectedCrop.logo || '🌱'}</span>
              <div>
                <h3 className="font-black text-slate-800 text-sm sm:text-base">
                  {selectedCropName} {language === 'mr' ? 'पिकाच्या भरघोस वाढीसाठी विशेष उत्पादने' : 'Crop Solutions'}
                </h3>
                {selectedCropTag && (
                  <p className="text-xs font-bold text-brand-magenta mt-0.5">
                    {selectedCropTag}
                  </p>
                )}
              </div>
            </div>
            <Link
              to={`/products?crop=${encodeURIComponent(selectedCropId)}`}
              className="text-brand-green-dark hover:underline text-xs font-black flex items-center gap-1 hidden sm:flex"
            >
              <span>{language === 'mr' ? 'या पिकाची सर्व उत्पादने पहा' : 'View all products for this crop'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map(product => (
                <Link 
                  key={product.id || product._id} 
                  to={`/products/${product.id || product._id}`}
                  className="group bg-white border border-slate-200/70 rounded-xl p-3 flex flex-col items-center text-center hover:shadow-md hover:border-emerald-300 transition-all duration-300"
                >
                  <div className="aspect-square w-full max-w-[100px] flex items-center justify-center p-1 mb-2">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                      onError={(e) => { e.target.src = '/assets/logo.png'; }}
                    />
                  </div>
                  <h4 className="font-black text-xs sm:text-sm text-slate-800 truncate w-full group-hover:text-brand-green-dark transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase truncate w-full mt-0.5">
                    {product.category?.replace('-', ' ')}
                  </p>
                  <span className="text-xs font-black text-brand-green-dark mt-1">
                    ₹{product.basePrice}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-xs">
              {language === 'mr' ? 'या पिकासाठी उत्पादने लवकरच जोडली जातील.' : 'Products for this crop will be listed soon.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CropFinder;
