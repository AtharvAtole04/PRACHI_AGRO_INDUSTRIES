import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { YoutubeIcon, FacebookIcon, InstagramIcon } from './BrandIcons';
import { useLanguage } from '../context/LanguageContext';

const TopBar = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="bg-brand-magenta text-white py-1.5 px-3 text-xs font-medium transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">

        {/* Slogan — hidden on very small screens */}
        <div className="hidden sm:block tracking-wide truncate text-xs animate-pulse">
          {t('tagline')}
        </div>

        {/* Contact Info, Socials, Language Switcher */}
        <div className="flex items-center gap-3 ml-auto">

          {/* Phone */}
          <a href="tel:9021605160" className="flex items-center gap-1 hover:text-brand-gold transition-colors font-bold text-[11px]">
            <Phone size={12} className="fill-white/10" />
            <span>9021605160</span>
          </a>

          <span className="text-white/30">|</span>

          {/* WhatsApp */}
          <a href="https://wa.me/9021605160" target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors text-[11px] font-bold hidden sm:inline">
            WhatsApp
          </a>

          {/* Email — desktop only */}
          <a href="mailto:info@prachiagro.com" className="hidden md:flex items-center gap-1 hover:text-brand-gold transition-colors">
            <Mail size={12} />
            <span className="text-[11px]">info@prachiagro.com</span>
          </a>

          <span className="text-white/30 hidden sm:inline">|</span>

          {/* Social Icons */}
          <div className="hidden sm:flex items-center gap-2">
            <a href="https://www.youtube.com/@prachiagroindustries03" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-brand-gold hover:scale-110 transition-all">
              <YoutubeIcon size={14} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61550881985946" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-brand-gold hover:scale-110 transition-all">
              <FacebookIcon size={14} />
            </a>
            <a href="https://www.instagram.com/prachiagroindustries1/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-brand-gold hover:scale-110 transition-all">
              <InstagramIcon size={14} />
            </a>
          </div>

          <span className="text-white/30">|</span>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="bg-white/10 hover:bg-white/20 active:scale-95 text-[10px] px-2 py-0.5 rounded border border-white/20 font-semibold cursor-pointer uppercase transition-all"
          >
            {language === 'mr' ? 'EN' : 'मरा'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
