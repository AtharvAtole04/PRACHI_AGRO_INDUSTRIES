import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { YoutubeIcon, FacebookIcon, InstagramIcon } from './BrandIcons';
import { useLanguage } from '../context/LanguageContext';

const TopBar = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="bg-brand-magenta text-white py-2 px-4 text-sm font-medium transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Slogan */}
        <div className="text-center md:text-left tracking-wide animate-pulse">
          {t('tagline')}
        </div>

        {/* Contact Info, Socials, Language Switcher */}
        <div className="flex flex-wrap justify-center items-center gap-4">
          <div className="flex items-center gap-4 text-xs md:text-sm">
            <a href="tel:9284845035" className="flex items-center gap-1 hover:text-brand-gold transition-colors">
              <Phone size={14} className="fill-white/10" />
              <span>9284845035</span>
            </a>
            <span className="text-white/30">|</span>
            <a href="https://wa.me/9284845035" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-brand-gold transition-colors">
              <span className="font-bold">WhatsApp</span>
            </a>
            <span className="text-white/30">|</span>
            <a href="mailto:info@prachiagro.com" className="flex items-center gap-1 hover:text-brand-gold transition-colors">
              <Mail size={14} />
              <span className="hidden sm:inline">info@prachiagro.com</span>
            </a>
          </div>

          <span className="text-white/30 hidden md:inline">|</span>

          {/* Social Icons & Language Switcher */}
          <div className="flex items-center gap-3">
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-brand-gold hover:scale-110 transition-all">
              <YoutubeIcon size={16} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-brand-gold hover:scale-110 transition-all">
              <FacebookIcon size={16} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-brand-gold hover:scale-110 transition-all">
              <InstagramIcon size={16} />
            </a>

            <span className="text-white/30">|</span>

            {/* Language Selector Toggle */}
            <button
              onClick={toggleLanguage}
              className="bg-white/10 hover:bg-white/20 active:scale-95 text-xs px-2.5 py-0.5 rounded border border-white/20 font-semibold cursor-pointer uppercase transition-all"
            >
              {language === 'mr' ? 'English' : 'मराठी'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
