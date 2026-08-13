import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { YoutubeIcon, FacebookIcon, InstagramIcon } from './BrandIcons';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t-4 border-brand-green-dark transition-all duration-300">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Column 1: Company Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="border border-brand-green-bright rounded px-2 py-0.5 bg-white text-brand-green-dark font-black tracking-tight text-xs">
              PRACHI AGRO
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight">PRACHI AGRO</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed font-bold">
            {t('positioning')}
          </p>
          <p className="text-xs text-slate-500 italic">
            "{t('tagline')}"
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-3.5 mt-2">
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all duration-300">
              <YoutubeIcon size={16} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-300">
              <FacebookIcon size={16} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-all duration-300">
              <InstagramIcon size={16} />
            </a>
          </div>
        </div>

        {/* Column 2: Products */}
        <div>
          <h3 className="font-bold text-white uppercase text-sm tracking-wider mb-4 border-l-3 border-brand-green-bright pl-2.5">
            {t('products')}
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link to="/products" className="hover:text-white hover:underline transition-all">
                {language === 'mr' ? 'सर्व उत्पादने' : 'All Products'}
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-white hover:underline transition-all">
                {language === 'mr' ? 'उत्पादनांच्या श्रेणी' : 'Categories'}
              </Link>
            </li>
            <li>
              <Link to="/products?filter=popular" className="hover:text-white hover:underline transition-all">
                {t('popularProducts')}
              </Link>
            </li>
            <li>
              <Link to="/products?filter=new" className="hover:text-white hover:underline transition-all">
                {t('newProducts')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Guidance & Links */}
        <div>
          <h3 className="font-bold text-white uppercase text-sm tracking-wider mb-4 border-l-3 border-brand-green-bright pl-2.5">
            मार्गदर्शन
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link to="/blog" className="hover:text-white hover:underline transition-all">
                {language === 'mr' ? 'शेती मार्गदर्शन ब्लॉग' : 'Agri Blogs'}
              </Link>
            </li>
            <li>
              <Link to="/videos" className="hover:text-white hover:underline transition-all">
                {language === 'mr' ? 'नवीन व्हिडिओ' : 'Agri Videos'}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white hover:underline transition-all">
                {t('aboutUs')}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white hover:underline transition-all">
                {t('contactUs')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact details */}
        <div>
          <h3 className="font-bold text-white uppercase text-sm tracking-wider mb-4 border-l-3 border-brand-green-bright pl-2.5">
            {t('support')}
          </h3>
          <ul className="flex flex-col gap-3.5 text-sm">
            <li>
              <a href="tel:9284845035" className="flex items-center gap-2.5 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                  <Phone size={14} />
                </div>
                <span>9284845035</span>
              </a>
            </li>
            <li>
              <a href="https://wa.me/9284845035" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                  <MessageCircle size={14} className="fill-current" />
                </div>
                <span>WhatsApp Order</span>
              </a>
            </li>
            <li>
              <a href="mailto:info@prachiagro.com" className="flex items-center gap-2.5 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                  <Mail size={14} />
                </div>
                <span className="truncate">info@prachiagro.com</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="bg-slate-950 text-xs text-slate-500 py-6 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} Prachi Agro Industries. {t('allRightsReserved')}</p>
          <div className="flex gap-4 flex-wrap justify-center sm:justify-end">
            <Link to="/privacy" className="hover:underline hover:text-slate-400">गोपनीयता धोरण (Privacy Policy)</Link>
            <span>•</span>
            <Link to="/terms" className="hover:underline hover:text-slate-400">अटी आणि शर्ती (Terms)</Link>
            <span>•</span>
            <Link to="/admin" className="hover:underline hover:text-slate-400 font-bold text-slate-600 hover:text-slate-300">Admin Login</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
