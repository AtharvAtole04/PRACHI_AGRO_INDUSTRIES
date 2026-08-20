import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Sparkles, ShoppingBag, LogOut, ArrowRight, MessageCircle, ShieldCheck, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import SEOHead from '../components/SEOHead';

const CustomerDashboard = () => {
  const { user, logout, isAuthenticated, isFarmer } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    getProducts().then(products => {
      // Pick top products (Tonics and Granular Fertilizers)
      setRecommendedProducts(products.slice(0, 4));
    });
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const handleWhatsAppSupport = () => {
    const text = encodeURIComponent(`नमस्कार Prachi Agro, मी शेतकरी ग्राहक ${user.name} बोलत आहे. मला पीक व्यवस्थापनाविषयी सल्ला हवा आहे.`);
    window.open(`https://wa.me/9021605160?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-8 text-left max-w-6xl mx-auto">
      <SEOHead 
        title={language === 'mr' ? 'माझे शेतकरी खाते - प्राची ॲग्रो' : 'Farmer Dashboard - Prachi Agro'} 
        description="Farmer profile, season discounts, and personalized crop care solutions."
      />

      {/* 1. Header Welcome Banner */}
      <div className="bg-gradient-to-br from-brand-green-dark via-emerald-900 to-slate-950 text-white p-6 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6 relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-gold/20 border-2 border-brand-gold/40 flex items-center justify-center text-3xl sm:text-4xl shadow-inner flex-shrink-0">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-brand-gold text-brand-green-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm">
                {language === 'mr' ? 'नोंदणीकृत शेतकरी' : 'Verified Farmer'}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight mt-1.5">
              {language === 'mr' ? `राम राम, ${user.name}!` : `Welcome, ${user.name}!`}
            </h1>
            <p className="text-emerald-200 text-xs sm:text-sm font-medium mt-0.5 flex items-center gap-2">
              <MapPin size={14} />
              <span>{user.city || 'महाराष्ट्र'}, {user.district}</span>
              <span>•</span>
              <span>पिके: {user.mainCrops || 'कापूस, सोयाबीन, ऊस'}</span>
            </p>
          </div>
        </div>

        {/* Header Action */}
        <div className="flex items-center gap-3 relative z-10 self-start md:self-auto">
          <button
            onClick={handleWhatsAppSupport}
            className="bg-brand-magenta hover:bg-brand-magenta-dark active:scale-95 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all"
          >
            <MessageCircle size={16} className="fill-current" />
            <span>{language === 'mr' ? 'तज्ज्ञ सल्ला' : 'Agronomist Chat'}</span>
          </button>

          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all border border-white/20"
          >
            <LogOut size={16} />
            <span>{language === 'mr' ? 'बाहेर पडा' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* 2. Farmer Season Perks & Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Exclusive Discount Token */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Tag size={20} className="text-white" />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-100">
              {language === 'mr' ? 'हंगामी शेतकरी सूट' : 'Seasonal Farmer Privilege'}
            </span>
            <h3 className="text-2xl font-black mt-1">अतिरिक्त ५% सवलत</h3>
            <p className="text-xs text-amber-100 mt-2 font-medium leading-relaxed">
              सर्व टॉनिक व दाणेदार खतांवर थेट सूट आपोआप लागू आहे.
            </p>
          </div>
          <Link
            to="/products"
            className="mt-4 bg-white text-amber-800 font-extrabold text-xs py-2.5 px-4 rounded-xl text-center shadow-sm hover:bg-amber-50 transition-colors"
          >
            {language === 'mr' ? 'आताच खरेदी करा' : 'Shop with Discount'}
          </Link>
        </div>

        {/* Card 2: Farmer Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User size={18} className="text-brand-green-dark" />
              <span>{language === 'mr' ? 'वैयक्तिक माहिती' : 'Profile Details'}</span>
            </h3>
            <div className="flex flex-col gap-2.5 mt-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">मोबाईल:</span>
                <span className="font-extrabold text-slate-700">{user.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">ईमेल:</span>
                <span className="font-extrabold text-slate-700 truncate max-w-[160px]">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">शेती क्षेत्र:</span>
                <span className="font-extrabold text-slate-700">{user.landAcres || '५ एकर'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">गाव/जिल्हा:</span>
                <span className="font-extrabold text-slate-700">{user.city}, {user.district}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-bold flex items-center gap-1.5">
            <ShieldCheck size={14} />
            <span>प्राची ॲग्रो प्रमाणित शेतकरी सदस्य</span>
          </div>
        </div>

        {/* Card 3: Quick Orders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShoppingBag size={18} className="text-brand-green-dark" />
              <span>{language === 'mr' ? 'ऑर्डर व कार्ट स्थिती' : 'Quick Actions'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              आपल्या पिकांच्या वाढीसाठी थेट टॉनिक व दाणेदार खते निवडा आणि जलद डिलिव्हरी मिळवा.
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Link
              to="/products"
              className="w-full bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold text-xs py-2.5 rounded-xl text-center transition-all shadow-sm"
            >
              {language === 'mr' ? 'सर्व उत्पादने पहा' : 'Browse Catalog'}
            </Link>
            <Link
              to="/cart"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl text-center transition-all"
            >
              {language === 'mr' ? 'माझे कार्ट उघडा' : 'View Cart'}
            </Link>
          </div>
        </div>

      </div>

      {/* 3. Recommended Tonics & Granular Fertilizers for Farmer */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="bg-emerald-50 text-brand-green-dark text-[10px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full inline-block">
              {language === 'mr' ? 'तुमच्या पिकांसाठी शिफारस' : 'Tailored For Your Crops'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-brand-green-dark tracking-tight mt-1">
              {language === 'mr' ? 'जोमदार वाढीसाठी विशेष टॉनिक व दाणेदार खते' : 'Recommended Tonics & Fertilizers'}
            </h2>
          </div>
          <Link 
            to="/products"
            className="text-brand-green-dark hover:underline text-xs sm:text-sm font-black flex items-center gap-1 self-start sm:self-auto"
          >
            <span>सर्व उत्पादने</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {recommendedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default CustomerDashboard;
