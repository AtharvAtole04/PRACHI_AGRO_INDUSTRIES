import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, ShoppingCart, Menu, Lock, LogOut, Store, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import { MobileDrawer } from './Navbar';

const MainHeader = ({ onCartClick }) => {
  const { t, language } = useLanguage();
  const { cartCount, cartSubtotal } = useCart();
  const { user, isAuthenticated, isFarmer, isDealer, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getDashboardPath = () => {
    if (isAdmin) return '/admin';
    if (isDealer) return '/dealer-portal';
    return '/account';
  };

  const getRoleLabel = () => {
    if (isAdmin) return 'Admin (प्रशासक)';
    if (isDealer) return user.businessName || 'अधिकृत डीलर';
    return user.name || 'शेतकरी ग्राहक';
  };

  return (
    <>
      <header className="bg-white border-b border-slate-100 py-2 sm:py-3 px-3 sm:px-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto">

          {/* Row 1: Hamburger + Logo + Icons */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-brand-green-dark hover:bg-emerald-50 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 hover:opacity-95 transition-opacity">
              <div
                className="border border-brand-magenta rounded px-2 py-1 bg-white flex flex-col items-center justify-center font-black tracking-tight"
                style={{ minWidth: '64px', height: '44px' }}
              >
                <div className="text-brand-green-dark text-sm leading-none font-bold">PRACHI</div>
                <div className="bg-brand-magenta text-white text-[7px] px-1.5 py-0.5 rounded-sm font-bold my-0.5 transform -skew-x-6">
                  AGRO
                </div>
                <div className="text-brand-magenta text-[6px] leading-none tracking-widest font-semibold uppercase">INDUSTRIES</div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base md:text-xl lg:text-2xl font-black text-brand-green-dark tracking-tight leading-none m-0">
                  PRACHI AGRO INDUSTRIES
                </h1>
                <p className="text-[10px] md:text-sm font-bold text-brand-magenta mt-0.5 leading-none">
                  {t('positioning')}
                </p>
              </div>
            </Link>

            {/* Search Bar: center on md+ */}
            <div className="hidden md:flex flex-1 max-w-lg mx-4 lg:mx-8">
              <SearchBar />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto lg:ml-0">

              {/* Multi-Role Account / Login Button */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center gap-2 text-slate-700 hover:text-brand-green-dark group transition-colors bg-slate-50 hover:bg-emerald-50/60 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200/60"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shadow-xs text-xs">
                      {isAdmin ? '👑' : isDealer ? '🏪' : '🌾'}
                    </div>
                    <div className="text-left hidden md:block">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase leading-none">
                        {isAdmin ? 'Admin' : isDealer ? 'Dealer' : 'Farmer'}
                      </p>
                      <p className="text-xs font-black text-slate-800 truncate max-w-[110px] mt-0.5 leading-none">
                        {getRoleLabel()}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="p-2 text-slate-400 hover:text-brand-magenta hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Logout"
                    aria-label="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-brand-green-dark px-3 py-2 rounded-xl text-xs font-extrabold transition-all border border-slate-200/60 cursor-pointer"
                >
                  <Lock size={14} className="text-brand-green-dark" />
                  <span>{language === 'mr' ? 'लॉगिन / नोंदणी' : 'Login / Sign Up'}</span>
                </Link>
              )}

              {/* Cart — always visible */}
              <button
                onClick={onCartClick}
                className="flex items-center gap-2 bg-brand-green-dark hover:bg-brand-green-light active:scale-95 text-white px-3 sm:px-4 py-2 rounded-full cursor-pointer transition-all shadow-md"
              >
                <div className="relative">
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-brand-magenta text-white font-bold text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center animate-bounce border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="text-left text-xs font-semibold hidden sm:block">
                  <p className="opacity-90 leading-none">माझे कार्ट</p>
                  <p className="text-brand-gold font-bold mt-0.5 leading-none">₹{cartSubtotal}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Row 2: Search bar — mobile only */}
          <div className="md:hidden mt-2">
            <SearchBar />
          </div>

        </div>
      </header>

      {/* Mobile slide-in Drawer */}
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default MainHeader;
