import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, CheckCircle, Scale } from 'lucide-react';

const ProductComparison = ({ compareList, onRemove, onClear }) => {
  const { t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!compareList || compareList.length === 0) return null;

  return (
    <>
      {/* Bottom Floating Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl z-40 transform transition-transform duration-300 translate-y-0 pb-safe">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Icon & Count */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="bg-emerald-50 p-2 rounded-xl text-brand-green-dark">
              <Scale size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-800 text-xs sm:text-sm leading-none">
                {language === 'mr' ? 'तुलना' : 'Compare'}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold mt-0.5">
                {compareList.length}/3 {language === 'mr' ? 'निवडले' : 'items'}
              </p>
            </div>
          </div>

          {/* Center: Thumbnails */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5">
            {compareList.map((product) => (
              <div key={product.id} className="relative bg-slate-50 border border-slate-200 rounded-lg p-0.5 sm:p-1 w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain" 
                  onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Product' }}
                />
                <button 
                  onClick={() => onRemove(product.id)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
                  aria-label="Remove"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            <button 
              onClick={onClear}
              className="px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              {language === 'mr' ? 'रद्द' : 'Clear'}
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              disabled={compareList.length < 2}
              className="px-3.5 sm:px-5 py-1.5 sm:py-2 bg-brand-green-dark hover:bg-brand-green-light active:scale-95 text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={14} />
              <span>{language === 'mr' ? 'तुलना करा' : 'Compare'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-base sm:text-xl font-black text-brand-green-dark flex items-center gap-2">
                <Scale size={20} />
                <span>{language === 'mr' ? 'उत्पादनांची तुलना (Product Comparison)' : 'Product Comparison'}</span>
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Table Body */}
            <div className="p-3 sm:p-6 overflow-auto custom-scrollbar flex-1">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr>
                    <th className="p-3 border-b-2 border-slate-100 w-1/4"></th>
                    {compareList.map(product => (
                      <th key={product.id} className="p-3 border-b-2 border-slate-100 text-center w-1/4 align-top">
                        <div className="bg-slate-50 rounded-xl p-3 mb-2 h-24 sm:h-28 flex items-center justify-center relative">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="max-w-full max-h-full object-contain"
                          />
                          <button 
                            onClick={() => {
                              onRemove(product.id);
                              if (compareList.length <= 2) setIsModalOpen(false);
                            }}
                            className="absolute -top-1.5 -right-1.5 bg-slate-200 text-slate-600 rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                        <h3 className="font-extrabold text-slate-800 text-sm sm:text-base mb-0.5">{product.name}</h3>
                        <p className="text-[10px] font-bold text-brand-green-dark/70 uppercase truncate">{t(product.tagline)}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-sm">
                  <tr>
                    <td className="p-3 border-b border-slate-100 font-bold text-slate-500">{language === 'mr' ? 'श्रेणी' : 'Category'}</td>
                    {compareList.map(product => (
                      <td key={product.id} className="p-3 border-b border-slate-100 text-center font-semibold text-slate-700 capitalize">
                        {product.category?.replace('-', ' ')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-slate-100 font-bold text-slate-500">{language === 'mr' ? 'रेटिंग' : 'Rating'}</td>
                    {compareList.map(product => (
                      <td key={product.id} className="p-3 border-b border-slate-100 text-center font-bold text-amber-500">
                        ★ {product.rating} <span className="text-slate-400 text-[10px] font-normal">({product.reviewsCount})</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-slate-100 font-bold text-slate-500">{language === 'mr' ? 'किंमत' : 'Price'}</td>
                    {compareList.map(product => (
                      <td key={product.id} className="p-3 border-b border-slate-100 text-center">
                        <span className="font-black text-brand-green-dark text-sm sm:text-base">₹{product.basePrice}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-slate-100 font-bold text-slate-500">{language === 'mr' ? 'पॅक आकार' : 'Pack Sizes'}</td>
                    {compareList.map(product => (
                      <td key={product.id} className="p-3 border-b border-slate-100 text-center font-medium text-slate-600">
                        {product.packSizes?.map(p => p.size).join(', ')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-slate-100 font-bold text-slate-500">{language === 'mr' ? 'पिके' : 'Crops'}</td>
                    {compareList.map(product => (
                      <td key={product.id} className="p-3 border-b border-slate-100 text-center text-xs text-slate-600">
                        {language === 'mr' ? product.crops?.mr : product.crops?.en}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-slate-100 font-bold text-slate-500">{language === 'mr' ? 'फायदे' : 'Benefits'}</td>
                    {compareList.map(product => (
                      <td key={product.id} className="p-3 border-b border-slate-100 text-left text-xs text-slate-600 align-top">
                        <ul className="list-disc pl-3 space-y-1">
                          {(language === 'mr' ? product.benefits?.mr : product.benefits?.en)?.slice(0, 2).map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductComparison;
