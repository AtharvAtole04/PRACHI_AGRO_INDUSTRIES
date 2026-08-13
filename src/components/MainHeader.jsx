import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar';

const MainHeader = ({ onCartClick }) => {
  const { t } = useLanguage();
  const { cartCount, cartSubtotal } = useCart();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-100 py-3 px-4 sticky top-0 z-40 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Left Section: Logo & Tagline */}
        <Link to="/" className="flex items-center gap-3 self-start lg:self-auto hover:opacity-95 transition-opacity">
          {/* Recreated Logo SVG representing screenshot */}
          <div className="border border-brand-magenta rounded px-2.5 py-1 bg-white flex flex-col items-center justify-center font-black tracking-tight" style={{ minWidth: '100px', height: '60px' }}>
            <div className="text-brand-green-dark text-lg leading-none font-bold">PRACHI</div>
            <div className="bg-brand-magenta text-white text-[10px] px-2 py-0.5 rounded-sm font-bold my-0.5 transform -skew-x-6">
              AGRO
            </div>
            <div className="text-brand-magenta text-[9px] leading-none tracking-widest font-semibold uppercase">INDUSTRIES</div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-brand-green-dark tracking-tight leading-none m-0">
              PRACHI AGRO INDUSTRIES
            </h1>
            <p className="text-xs md:text-sm font-bold text-brand-magenta mt-1 leading-none">
              {t('positioning')}
            </p>
          </div>
        </Link>

        {/* Center Section: Search Bar */}
        <div className="w-full lg:w-auto flex-1 max-w-lg lg:mx-8">
          <SearchBar />
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-6 mt-1 lg:mt-0 border-t border-slate-100 lg:border-t-0 pt-2 lg:pt-0">
          {/* My Account */}
          <Link 
            to="/account" 
            className="flex items-center gap-2 text-slate-700 hover:text-brand-green-dark group transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
              <User size={18} className="text-slate-600 group-hover:text-brand-green-dark" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs text-slate-500 font-medium leading-none">{t('myAccount')}</p>
              <p className="text-xs font-bold mt-0.5 leading-none">माझे खाते</p>
            </div>
          </Link>

          {/* My Orders */}
          <Link 
            to="/orders" 
            className="flex items-center gap-2 text-slate-700 hover:text-brand-green-dark group transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
              <ShoppingBag size={18} className="text-slate-600 group-hover:text-brand-green-dark" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs text-slate-500 font-medium leading-none">{t('myOrders')}</p>
              <p className="text-xs font-bold mt-0.5 leading-none">माझ्या ऑर्डर्स</p>
            </div>
          </Link>

          {/* Shopping Cart Button */}
          <button 
            onClick={onCartClick}
            className="flex items-center gap-3 bg-brand-green-dark hover:bg-brand-green-light active:scale-95 text-white px-4 py-2 rounded-full cursor-pointer transition-all shadow-md shadow-emerald-800/10"
          >
            <div className="relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-brand-magenta text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce border-2 border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="text-left text-xs font-semibold hidden md:block">
              <p className="opacity-90 leading-none">माझे कार्ट</p>
              <p className="text-brand-gold font-bold mt-0.5 leading-none">₹{cartSubtotal}</p>
            </div>
          </button>
        </div>

      </div>
    </header>
  );
};

export default MainHeader;
