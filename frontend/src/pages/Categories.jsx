import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { categories } from '../data/categories';

const Categories = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 text-left max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
        <span className="bg-emerald-50 text-brand-green-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-3.5 py-1 rounded-full inline-block">
          उत्पादनांच्या श्रेणी (Agri Categories)
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-brand-green-dark tracking-tight mt-4">
          कृषी उत्पादनांच्या श्रेणी
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-semibold">
          {language === 'mr' ? 'आपल्या शेतीच्या गरजेनुसार योग्य औषधे व उत्पादने निवडा' : 'Select appropriate crop protection and growth promoters for your fields'}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/products?category=${cat.id}`)}
            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-5 cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center p-3 group-hover:bg-emerald-50 transition-colors">
              <img
                src={cat.image}
                alt={t(cat.title)}
                className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Agri' }}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-slate-800 text-base md:text-lg leading-snug group-hover:text-brand-green-dark transition-colors">
                {t(cat.title)}
              </h3>
              <p className="text-xs text-slate-400 font-bold mt-1 leading-snug">
                {t(cat.subtitle)}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Categories;
