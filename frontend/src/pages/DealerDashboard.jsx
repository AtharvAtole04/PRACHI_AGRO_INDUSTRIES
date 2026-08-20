import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, FileText, ShoppingCart, Percent, Download, MessageCircle, LogOut, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getProducts } from '../data/products';
import SEOHead from '../components/SEOHead';

const DealerDashboard = () => {
  const { user, logout, isAuthenticated, isDealer } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [productsList, setProductsList] = useState([]);
  const [bulkOrders, setBulkOrders] = useState({});

  const marginPercent = user?.dealerDiscountPercent || 25;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/dealer-portal' } }, replace: true });
      return;
    }

    getProducts().then(data => {
      setProductsList(data);
      // Initialize bulk order quantities
      const initialOrders = {};
      data.forEach(p => {
        initialOrders[p.id] = 0;
      });
      setBulkOrders(initialOrders);
    });
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const handleQtyChange = (id, delta) => {
    setBulkOrders(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  // Calculate Wholesale Order Totals
  const selectedItems = productsList.filter(p => (bulkOrders[p.id] || 0) > 0);
  const totalWholesaleAmount = selectedItems.reduce((sum, p) => {
    const wholesalePrice = Math.round(p.basePrice * (1 - marginPercent / 100));
    return sum + (wholesalePrice * (bulkOrders[p.id] || 0));
  }, 0);

  const totalRetailValue = selectedItems.reduce((sum, p) => {
    return sum + (p.basePrice * (bulkOrders[p.id] || 0));
  }, 0);

  const totalDealerMarginProfit = totalRetailValue - totalWholesaleAmount;

  const handleSendBulkOrderWhatsApp = () => {
    if (selectedItems.length === 0) {
      alert(language === 'mr' ? 'कृपया किमान एका उत्पादनाची संख्या निवडा.' : 'Please select quantity for at least one product.');
      return;
    }

    let itemsList = '';
    selectedItems.forEach((p, idx) => {
      const wholesalePrice = Math.round(p.basePrice * (1 - marginPercent / 100));
      const qty = bulkOrders[p.id];
      itemsList += `${idx + 1}) ${p.name} - ${qty} बॉक्सेस/नग @ ₹${wholesalePrice} = ₹${wholesalePrice * qty}\n`;
    });

    const msg = `*नवीन अधिकृत डीलर B2B ऑर्डर (New Dealer Bulk Order)*
दुकान/केंद्र: ${user.businessName || user.name}
चालक: ${user.name}
मोबाईल: ${user.phone}
शहर/जिल्हा: ${user.city}, ${user.district}
GST / लायसन्स: ${user.gstNumber || user.licenseNumber || 'N/A'}
डीलर मार्जिन दर: ${marginPercent}%

*ऑर्डर तपशील:*
${itemsList}
----------------------------
*एकूण होलसेल रक्कम: ₹${totalWholesaleAmount.toLocaleString()}*
*अपेक्षित नफा: ₹${totalDealerMarginProfit.toLocaleString()}*

कृपया ऑर्डर कन्फर्म करून ट्रान्सपोर्ट व बिल तपशील पाठवा.`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/9021605160?text=${encoded}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-8 text-left max-w-6xl mx-auto">
      <SEOHead 
        title={language === 'mr' ? 'अधिकृत डीलर पोर्टल - प्राची ॲग्रो' : 'Authorized Dealer Portal - Prachi Agro'} 
        description="B2B Wholesale rates, bulk ordering sheet, and dealership margin catalog."
      />

      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-brand-green-dark text-white p-6 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6 relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-gold/20 border-2 border-brand-gold/40 flex items-center justify-center text-3xl sm:text-4xl shadow-inner flex-shrink-0">
            🏪
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-brand-gold text-brand-green-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm">
                B2B अधिकृत डीलर पोर्टल
              </span>
              {user.isVerifiedDealer ? (
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>प्रमाणित (Verified)</span>
                </span>
              ) : (
                <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle size={12} />
                  <span>पडताळणी प्रलंबित (Pending Approval)</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight mt-1.5">
              {user.businessName || user.name}
            </h1>
            <p className="text-emerald-200 text-xs sm:text-sm font-medium mt-0.5 flex flex-wrap items-center gap-2">
              <span>चालक: {user.name}</span>
              <span>•</span>
              <span>फोन: {user.phone}</span>
              <span>•</span>
              <span>{user.city}, {user.district}</span>
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3 relative z-10 self-start md:self-auto">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all border border-white/20"
          >
            <LogOut size={16} />
            <span>{language === 'mr' ? 'बाहेर पडा' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Margin Tier */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-50 text-brand-magenta flex items-center justify-center flex-shrink-0">
            <Percent size={24} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">डीलर नफा मार्जिन</span>
            <p className="text-2xl font-black text-brand-magenta">{marginPercent}% थेट सवलत</p>
          </div>
        </div>

        {/* Total Wholesale Selection */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-brand-green-dark flex items-center justify-center flex-shrink-0">
            <ShoppingCart size={24} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">निवडलेली B2B ऑर्डर</span>
            <p className="text-2xl font-black text-brand-green-dark">₹{totalWholesaleAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Estimated Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">अपेक्षित डीलर नफा</span>
            <p className="text-2xl font-black text-amber-600">+₹{totalDealerMarginProfit.toLocaleString()}</p>
          </div>
        </div>

      </div>

      {/* 3. Wholesale Product Rate Sheet & Bulk Order Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-brand-green-dark tracking-tight">
              {language === 'mr' ? 'थोक दरपत्रक व थेट B2B ऑर्डर शीट' : 'Wholesale Rate Sheet & B2B Order Sheet'}
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              टॉनिक, दाणेदार खते व पीक संरक्षणाची अधिकृत होलसेल किंमत यादी
            </p>
          </div>

          <button
            onClick={handleSendBulkOrderWhatsApp}
            disabled={selectedItems.length === 0}
            className="bg-brand-magenta hover:bg-brand-magenta-dark active:scale-95 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircle size={18} className="fill-current" />
            <span>होलसेल ऑर्डर पाठवा (Send PO)</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5">उत्पादन (Product)</th>
                <th className="p-3.5">श्रेणी (Category)</th>
                <th className="p-3.5 text-center">ग्राहक MRP</th>
                <th className="p-3.5 text-center text-brand-green-dark">डीलर होलसेल दर</th>
                <th className="p-3.5 text-center text-pink-600">नफा/नग</th>
                <th className="p-3.5 text-center">ऑर्डर संख्या (Qty)</th>
                <th className="p-3.5 text-right">एकूण रक्कम</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {productsList.map((product) => {
                const retailPrice = product.basePrice;
                const wholesalePrice = Math.round(retailPrice * (1 - marginPercent / 100));
                const profitPerUnit = retailPrice - wholesalePrice;
                const qty = bulkOrders[product.id] || 0;
                const itemTotal = wholesalePrice * qty;

                return (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 p-1 flex items-center justify-center flex-shrink-0">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=Agri' }}
                        />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-800 block">{product.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{product.packSizes?.[0]?.size || 'Unit'}</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-600 font-semibold capitalize">
                      {product.category?.replace('-', ' ')}
                    </td>

                    <td className="p-3.5 text-center font-bold text-slate-400 line-through">
                      ₹{retailPrice}
                    </td>

                    <td className="p-3.5 text-center font-black text-brand-green-dark text-base">
                      ₹{wholesalePrice}
                    </td>

                    <td className="p-3.5 text-center font-extrabold text-pink-600">
                      +₹{profitPerUnit}
                    </td>

                    {/* Quantity Controls */}
                    <td className="p-3.5 text-center">
                      <div className="inline-flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
                        <button
                          onClick={() => handleQtyChange(product.id, -5)}
                          className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 font-black cursor-pointer active:bg-slate-200"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleQtyChange(product.id, -1)}
                          className="px-2 py-1 text-slate-500 hover:bg-slate-100 font-black cursor-pointer active:bg-slate-200 border-r border-slate-100"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-extrabold text-slate-800 text-xs">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleQtyChange(product.id, 1)}
                          className="px-2 py-1 text-slate-500 hover:bg-slate-100 font-black cursor-pointer active:bg-slate-200 border-l border-slate-100"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleQtyChange(product.id, 5)}
                          className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 font-black cursor-pointer active:bg-slate-200"
                        >
                          +5
                        </button>
                      </div>
                    </td>

                    <td className="p-3.5 text-right font-black text-slate-800">
                      ₹{itemTotal.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Floating Order Summary */}
        {selectedItems.length > 0 && (
          <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <div>
              <p className="text-xs text-slate-400 font-bold">एकूण निवड: {selectedItems.length} उत्पादने</p>
              <p className="text-xl font-black text-brand-gold">एकूण होलसेल रक्कम: ₹{totalWholesaleAmount.toLocaleString()}</p>
            </div>

            <button
              onClick={handleSendBulkOrderWhatsApp}
              className="w-full sm:w-auto bg-brand-magenta hover:bg-brand-magenta-dark active:scale-95 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
            >
              <MessageCircle size={18} className="fill-current" />
              <span>WhatsApp द्वारे थेट PO पाठवा</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

export default DealerDashboard;
