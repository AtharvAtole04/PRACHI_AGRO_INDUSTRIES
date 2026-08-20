import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal, cartCount, clearCart } = useCart();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    let orderList = '';
    cartItems.forEach((item, index) => {
      orderList += `${index + 1}) ${item.name} (${item.packSize}) - ${item.quantity} नग (Qty) x ₹${item.price} = ₹${item.price * item.quantity}\n`;
    });

    const message = `नमस्कार Prachi Agro Industries,
मला खालील कृषी उत्पादने ऑर्डर करायची आहेत:

${orderList}
एकूण किंमत: ₹${cartSubtotal}
कृपया माझी ऑर्डर स्वीकारून बिल आणि पेमेंटची माहिती पाठवा. धन्यवाद!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/9021605160?text=${encodedMessage}`, '_blank');
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm max-w-lg mx-auto my-8">
        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-5 mx-auto">
          <ShoppingBag size={38} className="text-slate-300" />
        </div>
        <h2 className="font-extrabold text-slate-800 text-lg mb-2">
          {language === 'mr' ? 'तुमचे कार्ट रिकामे आहे!' : 'Your Shopping Cart is Empty!'}
        </h2>
        <p className="text-sm text-slate-400 mb-8 max-w-sm mx-auto">
          {language === 'mr' 
            ? 'पिकांना आवश्यक असणाऱ्या बुरशीनाशके आणि पोषण खतांची खरेदी करण्यासाठी आमचे दालन पहा.' 
            : 'Explore our premium agricultural crop solutions and add products to your cart.'}
        </p>
        <Link
          to="/products"
          className="bg-brand-green-dark hover:bg-brand-green-light text-white font-bold text-sm px-8 py-3 rounded-full cursor-pointer transition-all inline-block shadow-md"
        >
          {t('allProductsBtn')}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left max-w-6xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-brand-green-dark tracking-tight m-0">
          माझे कार्ट (Shopping Cart)
        </h1>
        <p className="text-slate-400 text-xs font-bold mt-1">
          तुमच्या कार्टमध्ये {cartCount} उत्पादने आहेत.
        </p>
      </div>

      {/* Cart Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Items list */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-6 divide-y divide-slate-100">
            {cartItems.map((item) => (
              <div key={item.id} className="py-4 sm:py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Thumbnail */}
                <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-xl p-1 flex items-center justify-center flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Agri' }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-slate-800 text-base truncate">{item.name}</h3>
                  <div className="flex gap-4 text-xs font-bold text-slate-400 mt-1">
                    <span>श्रेणी: {item.productId}</span>
                    <span>•</span>
                    <span className="text-brand-green-dark">पॅक: {item.packSize}</span>
                  </div>
                </div>

                {/* Quantity adjustments */}
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold cursor-pointer active:bg-slate-200 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-4 text-xs font-bold text-slate-700">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold cursor-pointer active:bg-slate-200 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Pricing */}
                  <div className="text-right sm:min-w-[100px]">
                    <p className="text-sm font-black text-slate-800">
                      ₹{item.price * item.quantity}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      (₹{item.price} / नग)
                    </p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-300 hover:text-brand-magenta p-1 cursor-pointer transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-between items-center px-4">
            <Link 
              to="/products"
              className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-green-dark text-xs sm:text-sm font-bold transition-all"
            >
              <ArrowLeft size={16} />
              <span>खरेदी चालू ठेवा (Continue Shopping)</span>
            </Link>
            
            <button
              onClick={clearCart}
              className="text-xs font-black text-brand-magenta hover:underline uppercase cursor-pointer"
            >
              कार्ट रिकामे करा (Clear Cart)
            </button>
          </div>

        </div>

        {/* Right Column: Order Summary & Checkouts */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
            <h2 className="font-extrabold text-slate-800 text-base uppercase tracking-wider border-b border-slate-50 pb-3">
              ऑर्डर समरी (Order Summary)
            </h2>

            {/* Calculations */}
            <div className="flex flex-col gap-3.5 text-sm text-slate-500 font-medium">
              <div className="flex justify-between">
                <span>एकूण उत्पादने (Total Items)</span>
                <span className="font-bold text-slate-700">{cartCount}</span>
              </div>
              <div className="flex justify-between">
                <span>मूळ किंमत (Subtotal)</span>
                <span className="font-extrabold text-slate-700">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>डिलिव्हरी फी (Delivery Fee)</span>
                <span className="text-brand-green-bright font-extrabold">मोफत (FREE)</span>
              </div>
              <div className="h-px bg-slate-100 my-1" />
              <div className="flex justify-between items-center text-slate-800">
                <span className="font-bold">एकूण रक्कम (Total Amount)</span>
                <span className="text-xl font-black text-brand-green-dark">₹{cartSubtotal}</span>
              </div>
            </div>

            {/* Checkout buttons */}
            <div className="flex flex-col gap-2.5 mt-2">
              
              {/* WhatsApp checkout consolidator */}
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full bg-brand-magenta hover:bg-brand-magenta-dark active:scale-[0.98] text-white font-extrabold py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow transition-all"
              >
                <MessageCircle size={18} className="fill-current text-white" />
                <span>WhatsApp वर ऑर्डर पाठवा</span>
              </button>

              <Link
                to="/checkout"
                className="w-full py-3 bg-brand-green-dark hover:bg-brand-green-light active:scale-[0.98] text-white font-extrabold text-sm text-center rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                {t('checkout')}
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Cart;
