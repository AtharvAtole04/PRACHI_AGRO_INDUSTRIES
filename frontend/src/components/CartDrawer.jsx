import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useCart();
  const { t, language } = useLanguage();
  const drawerRef = useRef(null);

  // Close drawer on pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        {/* Drawer container */}
        <div 
          ref={drawerRef}
          className="w-screen max-w-md bg-white flex flex-col shadow-2xl animate-slide-in"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-brand-green-dark text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} />
              <h2 className="font-bold text-lg">{t('cartTitle')}</h2>
              <span className="bg-brand-magenta text-white font-extrabold text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full cursor-pointer transition-all"
            >
              <X size={22} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 no-scrollbar">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <ShoppingBag size={36} className="text-slate-300" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg mb-1">
                  {language === 'mr' ? 'तुमचे कार्ट रिकामे आहे!' : 'Your Cart is Empty!'}
                </h3>
                <p className="text-sm text-slate-400 max-w-[250px]">
                  {language === 'mr' ? 'कृपया आमच्या उत्पादने श्रेणी पहा आणि कार्टमध्ये जोडा.' : 'Browse our products to find the best agricultural solutions for your crops.'}
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-brand-green-dark hover:bg-brand-green-light text-white font-bold text-sm px-6 py-2.5 rounded-full cursor-pointer transition-all active:scale-95"
                >
                  {t('allProductsBtn')}
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-slate-50 rounded border border-slate-100 p-1 flex items-center justify-center flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Agri' }}
                    />
                  </div>

                  {/* Info details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-brand-green-dark font-semibold mt-0.5">
                      {t('packSize')}: {item.packSize}
                    </p>
                    <p className="text-sm font-black text-slate-800 mt-2">
                      ₹{item.price}
                    </p>

                    {/* Quantity modifier and Delete */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-slate-200 rounded overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-500 cursor-pointer active:bg-slate-200 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 py-0.5 text-xs font-bold text-slate-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-500 cursor-pointer active:bg-slate-200 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-brand-magenta p-1 cursor-pointer transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer (Pricing Summary & Checkout) */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  {t('cartTotal')}:
                </span>
                <span className="text-xl font-black text-brand-green-dark">
                  ₹{cartSubtotal}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm text-center rounded-lg cursor-pointer transition-all active:scale-[0.98]"
                >
                  {language === 'mr' ? 'कार्ट पहा' : 'View Cart'}
                </Link>
                
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="w-full py-2.5 bg-brand-green-dark hover:bg-brand-green-light text-white font-bold text-sm text-center rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  {t('checkout')}
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Slide-in styles inline just in case Tailwind doesn't compile dynamically */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default CartDrawer;
