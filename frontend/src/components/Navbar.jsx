import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { X, Home, Package, Grid3X3, BookOpen, Video, Star, Info, Phone, MessageCircle, Lock, User, Store, ShieldCheck, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { path: '/',          labelKey: 'home',      icon: Home },
  { path: '/products',  labelKey: 'products',  icon: Package },
  { path: '/categories',labelKey: 'categories',icon: Grid3X3 },
  { path: '/blog',      labelKey: 'blog',      icon: BookOpen },
  { path: '/videos',    labelKey: 'videos',    icon: Video },
  { path: '/reviews',   labelKey: 'reviews',   icon: Star },
  { path: '/about',     labelKey: 'aboutUs',   icon: Info },
  { path: '/contact',   labelKey: 'contactUs', icon: Phone },
];

// ─── Mobile Drawer ────────────────────────────────────────────────────────────
export const MobileDrawer = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, isAdmin, isDealer, logout } = useAuth();
  const location = useLocation();

  // Close on route change
  useEffect(() => { onClose(); }, [location.pathname]);

  // Trap body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent('नमस्कार Prachi Agro Industries, मला आपल्या कृषी उत्पादनांविषयी माहिती हवी आहे.');
    window.open(`https://wa.me/9021605160?text=${msg}`, '_blank');
  };

  const getDashboardPath = () => {
    if (isAdmin) return '/admin';
    if (isDealer) return '/dealer-portal';
    return '/account';
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sliding Drawer Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-brand-green-dark z-[70] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <p className="text-white font-black text-base tracking-tight leading-none">PRACHI AGRO</p>
            <p className="text-brand-gold text-[10px] font-semibold mt-0.5 leading-none">INDUSTRIES</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* User Account / Login Bar in Mobile Drawer */}
        <div className="p-3 mx-4 mt-3 bg-black/20 rounded-2xl border border-white/10">
          {isAuthenticated ? (
            <div className="flex items-center justify-between">
              <Link to={getDashboardPath()} className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-full bg-brand-gold text-slate-950 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                  {isAdmin ? '👑' : isDealer ? '🏪' : '🌾'}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-brand-gold font-bold uppercase truncate leading-none">
                    {isAdmin ? 'Admin' : isDealer ? 'Dealer' : 'Farmer'}
                  </p>
                  <p className="text-xs font-black text-white truncate leading-tight mt-0.5">
                    {user.businessName || user.name}
                  </p>
                </div>
              </Link>
              <button
                onClick={logout}
                className="text-white/60 hover:text-brand-magenta p-1.5 rounded-lg transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 bg-brand-gold text-brand-green-dark font-extrabold text-xs py-2 px-3 rounded-xl shadow-sm"
            >
              <Lock size={14} />
              <span>{language === 'mr' ? 'लॉगिन / नोंदणी करा' : 'Login / Sign Up'}</span>
            </Link>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-3">
          {navLinks.map(({ path, labelKey, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-5 py-3 text-sm font-bold transition-all border-l-4 ${
                  isActive
                    ? 'text-brand-gold bg-black/20 border-brand-gold'
                    : 'text-white/85 hover:text-white hover:bg-white/8 border-transparent'
                }`
              }
            >
              <Icon size={18} className="flex-shrink-0 opacity-80" />
              <span>{t(labelKey)}</span>
            </NavLink>
          ))}

          {/* Admin link shortcut if admin */}
          {isAdmin && (
            <NavLink
              to="/admin"
              className="flex items-center gap-3.5 px-5 py-3 text-sm font-bold text-amber-300 hover:bg-white/8 border-l-4 border-transparent"
            >
              <ShieldCheck size={18} />
              <span>अ‍ॅडमिन पॅनेल (Admin)</span>
            </NavLink>
          )}
        </nav>

        {/* Drawer Footer CTA */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-2">
          <button
            onClick={handleWhatsApp}
            className="w-full bg-brand-gold hover:bg-brand-gold-hover text-brand-green-dark font-black text-sm px-4 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <MessageCircle size={18} className="fill-brand-green-dark" />
            <span>{t('whatsAppOrder')}</span>
          </button>
          <a
            href="tel:9021605160"
            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Phone size={16} />
            <span>9021605160</span>
          </a>
        </div>
      </div>
    </>
  );
};

// ─── Desktop Navbar Bar ───────────────────────────────────────────────────────
const Navbar = () => {
  const { t } = useLanguage();

  return (
    // Only visible on lg+ screens — hidden on mobile
    <nav className="hidden lg:block bg-brand-green-dark text-white relative z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">

          {/* Desktop Nav Links */}
          <div className="flex items-center gap-1 xl:gap-2 h-full">
            {navLinks.map(({ path, labelKey }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `px-3.5 py-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 hover:text-brand-gold hover:border-brand-gold cursor-pointer ${
                    isActive
                      ? 'text-brand-gold border-brand-gold bg-black/10'
                      : 'border-transparent text-white'
                  }`
                }
              >
                {t(labelKey)}
              </NavLink>
            ))}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
