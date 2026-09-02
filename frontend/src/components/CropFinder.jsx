import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getProducts } from '../data/products';
import { ArrowRight, Sparkles } from 'lucide-react';

const CROPS = [
  { id: 'onion', emoji: '🧅', mr: 'कांदा (Onion)', en: 'Onion', tag: 'कंद फुगवण व पातीचे पोषण' },
  { id: 'sugarcane', emoji: '🎋', mr: 'ऊस (Sugarcane)', en: 'Sugarcane', tag: 'कांडीची लांबी व वजन वाढ' },
  { id: 'tomato', emoji: '🍅', mr: 'टोमॅटो (Tomato)', en: 'Tomato', tag: 'फुलधारणा व फळांची चमक' },
  { id: 'papaya', emoji: '🍈', mr: 'पपई (Papaya)', en: 'Papaya', tag: 'बुरशी रक्षण व फळांचा आकार' },
  { id: 'chilli', emoji: '🌶️', mr: 'मिरची (Chilli)', en: 'Chilli', tag: 'चुरडा-मुरडा नियंत्रण व फुटवे' },
  { id: 'cotton', emoji: '🌿', mr: 'कापूस (Cotton)', en: 'Cotton', tag: 'पांढरी मुळी व बोंड वाढ' },
  { id: 'soybean', emoji: '🫘', mr: 'सोयाबीन (Soybean)', en: 'Soybean', tag: 'शेंगांची संख्या व दाणे भरणी' },
  { id: 'pomegranate', emoji: '🍎', mr: 'डाळिंब (Pomegranate)', en: 'Pomegranate', tag: 'तेल्या व बुरशी नियंत्रण' },
  { id: 'banana', emoji: '🍌', mr: 'केळी (Banana)', en: 'Banana', tag: 'घडाचे वजन व झाडाचा जोम' }
];

const CropFinder = () => {
  const { language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState(CROPS[0]); // Default to Onion (कांदा)
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    getProducts().then(data => setProducts(data));
  }, []);

  useEffect(() => {
    if (!selectedCrop) {
      setFilteredProducts([]);
      return;
    }
    
    const cropNameEn = selectedCrop.en.toLowerCase();
    const cropNameMr = selectedCrop.mr.toLowerCase();
    
    const matched = products.filter(product => {
      const pCropsEn = (product.crops?.en || '').toLowerCase();
      const pCropsMr = (product.crops?.mr || '').toLowerCase();
      return pCropsEn.includes(cropNameEn) || pCropsMr.includes('कांदा') || pCropsMr.includes(cropNameMr);
    });
    
    setFilteredProducts(matched.slice(0, 4));
  }, [selectedCrop, products]);

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
          विशेष भर: कांदा • ऊस • टोमॅटो • पपई • मिरची
        </p>
      </div>
      
      {/* Crop Pills */}
      <div className="flex flex-wrap gap-2.5 justify-start mb-6">
        {CROPS.map(crop => {
          const isSelected = selectedCrop?.id === crop.id;
          return (
            <button
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all duration-300 border cursor-pointer ${
                isSelected 
                  ? 'bg-brand-green-dark text-white border-brand-green-dark shadow-md scale-105' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <span className="text-base">{crop.emoji}</span>
              <span>{crop.mr}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Crop Recommendations Banner */}
      {selectedCrop && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{selectedCrop.emoji}</span>
              <div>
                <h3 className="font-black text-slate-800 text-sm sm:text-base">
                  {selectedCrop.mr} {language === 'mr' ? 'पिकाच्या भरघोस वाढीसाठी' : 'Crop Solutions'}
                </h3>
                <p className="text-xs font-bold text-brand-magenta">
                  {selectedCrop.tag}
                </p>
              </div>
            </div>
            <Link
              to="/products"
              className="text-brand-green-dark hover:underline text-xs font-bold flex items-center gap-1 hidden sm:flex"
            >
              <span>सर्व उत्पादने पहा</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map(product => (
                <Link 
                  key={product.id} 
                  to={`/products/${product.id}`}
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
              {language === 'mr' ? 'उत्पादने उपलब्ध आहेत.' : 'Products available.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CropFinder;
