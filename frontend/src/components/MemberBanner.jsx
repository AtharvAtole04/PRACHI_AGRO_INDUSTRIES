import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Tag, Store, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getSiteContent } from '../data/siteContent';

const MemberBanner = () => {
  const { user, isAuthenticated, isFarmer, isDealer, isAdmin } = useAuth();
  const { language } = useLanguage();
  const [content, setContent] = useState(null);

  useEffect(() => {
    getSiteContent().then(data => setContent(data));
  }, []);

  if (!content) return null;

  // 1. Logged in as Admin
  if (isAdmin) {
    return (
      <div className="bg-slate-900 text-white rounded-2xl px-4 py-3 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm border border-slate-800">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
          <span className="bg-brand-gold text-slate-900 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full">
            Admin CMS
          </span>
          <span>👑 आपण अ‍ॅडमिन म्हणून लॉगिन आहात. आपण वेबसाइटवरील कन्टेन्ट आणि डीलर अप्रूव्हल व्यवस्थापित करू शकता.</span>
        </div>
        <Link
          to="/admin"
          className="bg-brand-gold text-slate-900 hover:bg-yellow-400 font-extrabold text-xs px-4 py-1.5 rounded-lg flex items-center gap-1 flex-shrink-0 transition-colors shadow-sm"
        >
          <span>अ‍ॅडमिन पॅनेल उघडा</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  // 2. Logged in as Dealer
  if (isDealer) {
    if (!content.dealerNotice?.isActive) return null;
    return (
      <div className="bg-gradient-to-r from-brand-magenta to-pink-950 text-white rounded-2xl px-4 py-3 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
          <Store size={18} className="text-brand-gold flex-shrink-0" />
          <span>{language === 'mr' ? content.dealerNotice?.mr : content.dealerNotice?.en}</span>
        </div>
        <Link
          to="/dealer-portal"
          className="bg-brand-gold text-slate-900 hover:bg-yellow-400 font-extrabold text-xs px-4 py-1.5 rounded-lg flex items-center gap-1 flex-shrink-0 transition-colors shadow-sm"
        >
          <span>{language === 'mr' ? 'B2B डीलर पोर्टल' : 'Dealer Portal'}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  // 3. Logged in as Farmer / Customer
  if (isFarmer) {
    if (!content.farmerNotice?.isActive) return null;
    return (
      <div className="bg-gradient-to-r from-brand-green-dark to-emerald-900 text-white rounded-2xl px-4 py-3 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border border-emerald-800/40">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
          <Tag size={18} className="text-brand-gold flex-shrink-0" />
          <span>{language === 'mr' ? content.farmerNotice?.mr : content.farmerNotice?.en}</span>
        </div>
        <Link
          to="/account"
          className="bg-brand-gold text-brand-green-dark hover:bg-yellow-400 font-extrabold text-xs px-4 py-1.5 rounded-lg flex items-center gap-1 flex-shrink-0 transition-colors shadow-sm"
        >
          <span>{language === 'mr' ? 'माझे खाते' : 'My Account'}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  // 4. Guest (Before Login)
  if (!content.publicAnnouncement?.isActive) return null;
  return (
    <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl px-4 py-3 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-brand-green-dark">
        <Sparkles size={18} className="text-brand-magenta flex-shrink-0" />
        <span>{language === 'mr' ? content.publicAnnouncement?.mr : content.publicAnnouncement?.en}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          to="/login"
          className="bg-brand-green-dark hover:bg-brand-green-light active:scale-95 text-white font-extrabold text-xs px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Lock size={12} />
          <span>{language === 'mr' ? 'लॉगिन करा' : 'Login'}</span>
        </Link>
        <Link
          to="/register"
          className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors"
        >
          {language === 'mr' ? 'नोंदणी' : 'Register'}
        </Link>
      </div>
    </div>
  );
};

export default MemberBanner;
