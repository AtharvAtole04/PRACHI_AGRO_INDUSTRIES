import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const WhatsAppButton = () => {
  const { t } = useLanguage();

  const handleWhatsApp = () => {
    const message = encodeURIComponent("नमस्कार Prachi Agro Industries, मला काही कृषी उत्पादनांची ऑर्डर करायची आहे.");
    window.open(`https://wa.me/9284845035?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open('tel:9284845035', '_self');
  };

  return (
    <div className="fixed bottom-6 left-6 flex flex-col gap-3.5 z-40 select-none">
      {/* WhatsApp Button - Green */}
      <button
        onClick={handleWhatsApp}
        className="w-14 h-14 rounded-full bg-[#25d366] hover:bg-[#20ba5a] active:scale-95 text-white flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative group"
        aria-label="Order on WhatsApp"
      >
        <span className="absolute left-16 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          {t('whatsAppOrder')}
        </span>
        {/* Ripple effect */}
        <span className="absolute inset-0 rounded-full bg-[#25d366] opacity-30 animate-ping -z-10" />
        <MessageCircle size={28} className="fill-white text-white" />
      </button>

      {/* Call Button - Magenta */}
      <button
        onClick={handleCall}
        className="w-14 h-14 rounded-full bg-brand-magenta hover:bg-brand-magenta-dark active:scale-95 text-white flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative group"
        aria-label="Call Prachi Agro"
      >
        <span className="absolute left-16 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          संपर्क करा / Call Us
        </span>
        <Phone size={24} className="fill-white text-white" />
      </button>
    </div>
  );
};

export default WhatsAppButton;
