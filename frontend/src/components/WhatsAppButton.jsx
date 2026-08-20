import React, { useState } from 'react';
import { Phone, MessageCircle, X, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const WhatsAppButton = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [crop, setCrop] = useState('');
  const [query, setQuery] = useState('');

  const crops = [
    { value: 'Cotton', label: 'कापूस (Cotton)' },
    { value: 'Onion', label: 'कांदा (Onion)' },
    { value: 'Soybean', label: 'सोयाबीन (Soybean)' },
    { value: 'Tomato', label: 'टोमॅटो (Tomato)' },
    { value: 'Sugarcane', label: 'ऊस (Sugarcane)' },
    { value: 'Grapes', label: 'द्राक्षे (Grapes)' },
    { value: 'Pomegranate', label: 'डाळिंब (Pomegranate)' },
    { value: 'Other', label: 'इतर (Other)' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `नमस्कार Prachi Agro,\nनाव: ${name}\nपीक: ${crop}\nसमस्या/चौकशी: ${query}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/9021605160?text=${encodedMessage}`, '_blank');
    setIsOpen(false);
    setName('');
    setCrop('');
    setQuery('');
  };

  const handleCall = () => {
    window.open('tel:9021605160', '_self');
  };

  return (
    <>
      {/* Popup Form */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 w-[calc(100vw-1.5rem)] max-w-sm bg-white rounded-3xl shadow-2xl z-50 overflow-hidden transform scale-100 transition-all origin-bottom-right border border-slate-100 animate-in zoom-in-95 duration-200">
          <div className="bg-brand-green-dark text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                {language === 'mr' ? 'WhatsApp वर विचारणा करा' : 'Send WhatsApp Enquiry'}
              </h3>
              <p className="text-[11px] text-emerald-200 mt-0.5">
                {language === 'mr' ? 'कृषी सल्लागारांशी थेट संवाद' : 'Direct Agronomist Chat'}
              </p>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
              aria-label="Close form"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                {language === 'mr' ? 'आपले नाव (Name)' : 'Name'}
              </label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50 mt-1" 
                placeholder={language === 'mr' ? 'तुमचे नाव...' : 'Your name...'} 
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                {language === 'mr' ? 'पीक निवडा (Crop)' : 'Select Crop'}
              </label>
              <select 
                required 
                value={crop} 
                onChange={(e) => setCrop(e.target.value)} 
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50 mt-1 cursor-pointer"
              >
                <option value="" disabled>{language === 'mr' ? 'पीक निवडा...' : 'Select crop...'}</option>
                {crops.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                {language === 'mr' ? 'समस्या / विचारणा (Problem)' : 'Problem / Query'}
              </label>
              <textarea 
                required 
                rows="2" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50 mt-1 resize-none" 
                placeholder={language === 'mr' ? 'उदा. फुलांची गळती, बुरशी...' : 'Describe your query...'} 
              />
            </div>

            <button 
              type="submit" 
              className="bg-[#25d366] hover:bg-[#20ba5a] active:scale-95 text-white font-extrabold py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all w-full text-xs sm:text-sm mt-1"
            >
              <Send size={15} />
              <span>{language === 'mr' ? 'WhatsApp वर पाठवा' : 'Send to WhatsApp'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Buttons */}
      <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 flex flex-col gap-2.5 sm:gap-3.5 z-40 select-none">
        
        {/* Direct Phone Call Button */}
        <button
          onClick={handleCall}
          className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-brand-magenta hover:bg-brand-magenta-dark active:scale-95 text-white flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 relative group"
          aria-label="Call Prachi Agro"
        >
          <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap hidden sm:inline-block">
            {language === 'mr' ? 'कॉल करा' : 'Call Us'}
          </span>
          <Phone size={20} className="fill-white text-white sm:w-5 sm:h-5" />
        </button>

        {/* WhatsApp Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25d366] hover:bg-[#20ba5a] active:scale-95 text-white flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 relative group"
          aria-label="WhatsApp Enquiry"
        >
          <span className="absolute right-16 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap hidden sm:inline-block">
            {t('whatsAppOrder')}
          </span>
          {/* Ripple effect */}
          {!isOpen && <span className="absolute inset-0 rounded-full bg-[#25d366] opacity-30 animate-ping -z-10" />}
          <MessageCircle size={24} className="fill-white text-white sm:w-7 sm:h-7" />
        </button>
        
      </div>
    </>
  );
};

export default WhatsAppButton;
