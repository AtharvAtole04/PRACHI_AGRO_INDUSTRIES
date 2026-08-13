import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MessageCircle, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Checkout = () => {
  const { cartItems, cartSubtotal, clearCart, cartCount } = useCart();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [taluka, setTaluka] = useState('');
  const [district, setDistrict] = useState('');
  const [pincode, setPincode] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) return;

    if (name && phone && village && district) {
      // 1. Generate Mock Order ID
      const mockId = 'PAI-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(mockId);

      // 2. Format Order Details for WhatsApp
      let itemDetails = '';
      cartItems.forEach((item, index) => {
        itemDetails += `- ${item.name} (${item.packSize}) x ${item.quantity} = ₹${item.price * item.quantity}\n`;
      });

      const message = `नमस्कार Prachi Agro Industries,
माझी नवीन ऑर्डर तपशील खालीलप्रमाणे आहेत:
ऑर्डर ID: ${mockId}

उत्पादने:
${itemDetails}
एकूण देय रक्कम: ₹${cartSubtotal}

डिलिव्हरी पत्ता:
नाव: ${name}
मोबाईल नंबर: ${phone}
गाव/पत्ता: ${village}
तालुका: ${taluka}
जिल्हा: ${district}
पिनकोड: ${pincode}

कृपया लवकरात लवकर डिलिव्हरी आणि बँक तपशील कळवा. धन्यवाद!`;

      // 3. Save to localStorage orders (simulating database)
      const existingOrders = JSON.parse(localStorage.getItem('prachi_orders') || '[]');
      const newOrder = {
        orderId: mockId,
        date: new Date().toISOString(),
        items: cartItems,
        total: cartSubtotal,
        shippingAddress: { name, phone, village, taluka, district, pincode }
      };
      localStorage.setItem('prachi_orders', JSON.stringify([newOrder, ...existingOrders]));

      // 4. Open WhatsApp
      const encodedMsg = encodeURIComponent(message);
      window.open(`https://wa.me/9284845035?text=${encodedMsg}`, '_blank');

      // 5. Success screen state & Clear cart
      setIsSuccess(true);
      clearCart();
    }
  };

  // If order is placed successfully, render success view
  if (isSuccess) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto my-8 flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-brand-green-bright flex items-center justify-center shadow-inner animate-bounce">
          <CheckCircle2 size={40} className="fill-current text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-green-dark tracking-tight">
            ऑर्डर यशस्वीरित्या नोंदवली गेली!
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-2">
            Order Placed Successfully! Your Order ID is <span className="text-brand-magenta font-black">{orderId}</span>
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
          {language === 'mr'
            ? 'आम्ही तुमची ऑर्डर WhatsApp वर पाठवली आहे. कृपया तुमच्या WhatsApp चॅटवर पुढील संभाषण चालू ठेवा जेणेकरून आम्ही पाठवलेला बँक तपशील पाहून पेमेंट पूर्ण करता येईल.'
            : 'We have generated your order sheet and opened WhatsApp. Please complete the conversation in chat to finalize delivery and payment options.'}
        </p>

        <div className="flex flex-col gap-2.5 w-full mt-4">
          <button
            onClick={() => {
              // Re-trigger WhatsApp chat just in case the pop-up blocker stopped it
              window.open(`https://wa.me/9284845035`, '_blank');
            }}
            className="w-full bg-brand-magenta hover:bg-brand-magenta-dark text-white font-extrabold text-xs sm:text-sm py-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all"
          >
            <MessageCircle size={18} className="fill-current text-white" />
            <span>WhatsApp चॅट उघडा (Open Chat)</span>
          </button>
          
          <Link
            to="/products"
            className="w-full py-3 bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold text-xs sm:text-sm text-center rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-all"
          >
            {t('allProductsBtn')}
          </Link>
        </div>
      </div>
    );
  }

  // Render empty checkout block
  if (cartItems.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm max-w-lg mx-auto my-8">
        <h2 className="font-extrabold text-slate-800 text-lg mb-2">
          चेकआऊट करण्यासाठी कार्टमध्ये वस्तू असाव्यात!
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Your cart is currently empty. Add products to continue with checkout.
        </p>
        <Link
          to="/products"
          className="bg-brand-green-dark hover:bg-brand-green-light text-white font-bold text-sm px-6 py-2.5 rounded-full cursor-pointer transition-all inline-block shadow-md"
        >
          {t('allProductsBtn')}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left max-w-6xl mx-auto">
      
      {/* Back button */}
      <div>
        <Link 
          to="/cart" 
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-brand-green-dark text-xs sm:text-sm font-bold transition-colors"
        >
          <ArrowLeft size={16} />
          <span>कार्टकडे परत (Back to Cart)</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Billing Address Form */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="font-extrabold text-slate-800 text-lg uppercase tracking-wider mb-6 border-b border-slate-50 pb-3 flex items-center gap-2">
            <Truck size={18} className="text-brand-green-dark" />
            <span>डिलिव्हरी पत्ता (Delivery Details)</span>
          </h2>

          <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
            
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                शेतकऱ्याचे संपूर्ण नाव (Farmer Name) <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा. रमेश निवृत्ती पाटील"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50/30"
              />
            </div>

            {/* Mobile Contact */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                मोबाईल नंबर (WhatsApp Contact No) <span className="text-red-500">*</span>
              </label>
              <input 
                type="tel" 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="उदा. 9284845035"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50/30"
              />
            </div>

            {/* Village Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                घर क्रमांक / गल्ली / गावचे नाव (Village/Address) <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="उदा. मु. पो. पिंपळगाव बसवंत, गल्ली क्र. २"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50/30"
              />
            </div>

            {/* Taluka & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Taluka */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  तालुका (Taluka)
                </label>
                <input 
                  type="text" 
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  placeholder="उदा. निफाड"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50/30"
                />
              </div>

              {/* District */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  जिल्हा (District) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="उदा. नाशिक"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50/30"
                />
              </div>
            </div>

            {/* Pincode & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pincode */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  पिनकोड (Pincode)
                </label>
                <input 
                  type="text" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="उदा. 422209"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50/30"
                />
              </div>

              {/* State */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  राज्य (State)
                </label>
                <input 
                  type="text" 
                  disabled
                  value="महाराष्ट्र (Maharashtra)"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-400 text-sm focus:outline-none bg-slate-100 font-bold"
                />
              </div>
            </div>

            {/* Call Action Button */}
            <button
              type="submit"
              className="mt-4 bg-brand-green-dark hover:bg-brand-green-light active:scale-[0.98] text-white font-extrabold text-sm py-3 px-6 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle size={18} className="fill-current text-white" />
              <span>ऑर्डर बुक करा आणि WhatsApp वर पाठवा</span>
            </button>

          </form>
        </div>

        {/* Right Column: Order Summary Checklist */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
          <h2 className="font-extrabold text-slate-800 text-base uppercase tracking-wider border-b border-slate-50 pb-3 flex items-center gap-2">
            <ShoppingBag size={16} className="text-brand-green-dark" />
            <span>ऑर्डर तपशील (Order Summary)</span>
          </h2>

          {/* List items */}
          <div className="flex flex-col gap-3.5 divide-y divide-slate-100 max-h-60 overflow-y-auto no-scrollbar">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs sm:text-sm pt-3 first:pt-0 font-medium text-slate-600">
                <div className="min-w-0 pr-4">
                  <p className="font-bold text-slate-800 truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">पॅक: {item.packSize} • संख्या: {item.quantity}</p>
                </div>
                <span className="font-extrabold text-slate-700 flex-shrink-0">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-slate-100" />

          {/* Billing Totals */}
          <div className="flex flex-col gap-3 text-xs sm:text-sm text-slate-500 font-medium">
            <div className="flex justify-between">
              <span>एकूण रक्कम (Subtotal)</span>
              <span className="font-bold text-slate-700">₹{cartSubtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>डिलिव्हरी चार्ज (Delivery)</span>
              <span className="text-brand-green-bright font-extrabold">FREE</span>
            </div>
            <div className="h-px bg-slate-100 my-1" />
            <div className="flex justify-between items-center text-slate-800">
              <span className="font-bold text-sm">एकूण देय रक्कम (Total Amount)</span>
              <span className="text-lg font-black text-brand-green-dark">₹{cartSubtotal}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;
