import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'home' },
    { path: '/products', label: 'products' },
    { path: '/categories', label: 'categories' },
    { path: '/blog', label: 'blog' },
    { path: '/videos', label: 'videos' },
    { path: '/reviews', label: 'reviews' },
    { path: '/about', label: 'aboutUs' },
    { path: '/contact', label: 'contactUs' }
  ];

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("नमस्कार Prachi Agro Industries, मला आपल्या कृषी उत्पादनांविषयी माहिती हवी आहे.");
    window.open(`https://wa.me/9284845035?text=${message}`, '_blank');
  };

  return (
    <nav className="bg-brand-green-dark text-white relative z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white hover:text-brand-gold focus:outline-none p-1.5 cursor-pointer rounded-md hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 h-full">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 hover:text-brand-gold hover:border-brand-gold cursor-pointer ${
                    isActive
                      ? 'text-brand-gold border-brand-gold bg-black/10'
                      : 'border-transparent text-white'
                  }`
                }
              >
                {t(link.label)}
              </NavLink>
            ))}
          </div>

          {/* Right CTA: WhatsApp Order */}
          <button
            onClick={handleWhatsAppClick}
            className="bg-brand-gold hover:bg-brand-gold-hover active:scale-95 text-brand-green-dark font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer shadow-md hover:shadow-lg transition-all"
          >
            {/* Custom WhatsApp Icon or SVG */}
            <MessageCircle size={16} className="fill-brand-green-dark text-brand-green-dark" />
            <span>{t('whatsAppOrder')}</span>
          </button>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden absolute top-12 left-0 w-full bg-brand-green-dark/95 backdrop-blur-md border-t border-white/10 shadow-2xl py-3 flex flex-col gap-1 transition-all duration-300 z-50">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-6 py-2.5 text-sm font-bold uppercase tracking-wider transition-all flex items-center ${
                  isActive
                    ? 'text-brand-gold bg-black/20 border-l-4 border-brand-gold'
                    : 'text-white hover:text-brand-gold hover:bg-white/5 border-l-4 border-transparent'
                }`
              }
            >
              {t(link.label)}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
