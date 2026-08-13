import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
  const { t, language } = useLanguage();

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm max-w-lg mx-auto my-12 flex flex-col items-center gap-6">
      
      {/* Icon with warning ripple */}
      <div className="w-20 h-20 rounded-full bg-brand-magenta/10 text-brand-magenta flex items-center justify-center relative shadow-inner">
        <AlertTriangle size={36} />
        <span className="absolute inset-0 rounded-full bg-brand-magenta/10 animate-ping -z-10" />
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight m-0">
          {language === 'mr' ? 'पाने सापडले नाही!' : 'Page Not Found!'}
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-bold mt-2 leading-relaxed max-w-xs mx-auto">
          {language === 'mr'
            ? 'आपण शोधत असलेले पृष्ठ उपलब्ध नाही किंवा बदलण्यात आले आहे. कृपया मुख्यपृष्ठावर जा.'
            : 'The page you are looking for does not exist or has been moved. Use the button below to return to the safety of our home page.'}
        </p>
      </div>

      {/* Action button */}
      <Link
        to="/"
        className="bg-brand-green-dark hover:bg-brand-green-light active:scale-95 text-white font-extrabold text-xs sm:text-sm h-11 px-6 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all mt-2"
      >
        <Home size={16} />
        <span>मुख्यपृष्ठावर जा (Go to Home)</span>
      </Link>

    </div>
  );
};

export default NotFound;
