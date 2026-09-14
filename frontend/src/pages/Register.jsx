import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SEOHead from '../components/SEOHead';

const Register = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-md mx-auto">
      <SEOHead title="Admin Portal - Prachi Agro Industries" />

      <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-8 flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-brand-green-dark border border-emerald-200 flex items-center justify-center text-2xl shadow-sm">
          🌾
        </div>
        <h1 className="text-xl font-black text-slate-800 m-0">
          {language === 'mr' ? 'नोंदणीची गरज नाही!' : 'No Registration Required!'}
        </h1>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          {language === 'mr' 
            ? 'प्राची ॲग्रो इंडस्ट्रीज वेबसाईटवर सर्व ग्राहक व शेतकरी बांधव थेट उत्पादने पाहू शकतात व ऑर्डर करू शकतात. केवळ ॲडमिन लॉगिन उपलब्ध आहे.' 
            : 'All customers and farmers can directly browse products and place inquiries without registering. Login is reserved exclusively for Admin.'}
        </p>

        <div className="flex flex-col w-full gap-2.5 mt-4">
          <Link
            to="/products"
            className="w-full bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>{language === 'mr' ? 'उत्पादने पहा (View Products)' : 'View Products'}</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/login"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <ShieldCheck size={14} />
            <span>{language === 'mr' ? 'ॲडमिन लॉगिन (Admin Login)' : 'Admin Login'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
