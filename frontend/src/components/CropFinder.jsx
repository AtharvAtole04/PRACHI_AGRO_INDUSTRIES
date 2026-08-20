import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getProducts } from '../data/products';

const CROPS = [
  { id: 'cotton', emoji: '🌿', mr: 'कापूस', en: 'Cotton' },
  { id: 'onion', emoji: '🧅', mr: 'कांदा', en: 'Onion' },
  { id: 'soybean', emoji: '🫘', mr: 'सोयाबीन', en: 'Soybean' },
  { id: 'tomato', emoji: '🍅', mr: 'टोमॅटो', en: 'Tomato' },
  { id: 'sugarcane', emoji: '🎋', mr: 'ऊस', en: 'Sugarcane' },
  { id: 'grape', emoji: '🍇', mr: 'द्राक्षे', en: 'Grapes' },
  { id: 'chilli', emoji: '🌶️', mr: 'मिरची', en: 'Chilli' },
  { id: 'banana', emoji: '🍌', mr: 'केळी', en: 'Banana' },
  { id: 'pomegranate', emoji: '🍎', mr: 'डाळिंब', en: 'Pomegranate' },
  { id: 'turmeric', emoji: '🟡', mr: 'हळद', en: 'Turmeric' }
];

const CropFinder = () => {
  const { language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState(null);
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
      return pCropsEn.includes(cropNameEn) || pCropsMr.includes(cropNameMr);
    });
    
    setFilteredProducts(matched);
  }, [selectedCrop, products]);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-8">
      <h2 className="text-xl font-black text-brand-green-dark mb-4 text-center sm:text-left">
        {language === 'mr' ? 'तुमच्या पिकासाठी उत्पादने शोधा' : 'Find Products for Your Crop'}
      </h2>
      
      <div className="flex flex-wrap gap-3 justify-center sm:justify-start mb-6">
        {CROPS.map(crop => {
          const isSelected = selectedCrop?.id === crop.id;
          return (
            <button
              key={crop.id}
              onClick={() => setSelectedCrop(isSelected ? null : crop)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 border ${
                isSelected 
                  ? 'bg-brand-green-dark text-white border-brand-green-dark shadow-md scale-105' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <span className="text-lg">{crop.emoji}</span>
              <span>{language === 'mr' ? crop.mr : crop.en}</span>
            </button>
          )
        })}
      </div>

      {selectedCrop && (
        <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="font-bold text-slate-700 mb-4">
            {language === 'mr' 
              ? `${selectedCrop.mr} पिकासाठी उत्पादने:` 
              : `Products for ${selectedCrop.en}:`}
          </h3>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <Link 
                  key={product.id} 
                  to={`/products/${product.id}`}
                  className="group block border border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  <div className="aspect-square bg-slate-50 p-4 flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { e.target.src = 'https://placehold.co/150x150?text=Product' }}
                    />
                  </div>
                  <div className="p-3 bg-white">
                    <h4 className="font-bold text-sm text-slate-800 truncate group-hover:text-brand-green-dark transition-colors">
                      {product.name}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
             <p className="text-slate-500 text-sm">
               {language === 'mr' ? 'कोणतीही उत्पादने आढळली नाहीत.' : 'No products found.'}
             </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CropFinder;
