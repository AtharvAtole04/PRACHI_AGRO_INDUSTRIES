import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Send, CheckCircle2, MapPin, Handshake, Users, Store, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SEOHead from '../components/SEOHead';

const Contact = () => {
  const { t, language } = useLanguage();
  
  // Form states
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('dealership');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Check validation
    if (name && mobile && message) {
      setSubmitted(true);
      // Reset form
      setName('');
      setBusinessName('');
      setMobile('');
      setEmail('');
      setInquiryType('dealership');
      setCity('');
      setMessage('');
      
      // Auto reset success message after 6 seconds
      setTimeout(() => setSubmitted(false), 6000);
    }
  };

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent("नमस्कार Prachi Agro Industries, मला आपल्या डीलरशिप / नेटवर्कमध्ये सहभागी होण्याविषयी माहिती हवी आहे.");
    window.open(`https://wa.me/9021605160?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-10 text-left max-w-5xl mx-auto">
      <SEOHead 
        title={language === 'mr' ? 'आमच्या नेटवर्कमध्ये सहभागी व्हा - प्राची अॅग्रो' : 'Join Our Network - Prachi Agro Industries'} 
        description="Join Prachi Agro dealership and distribution network. Connect with our agricultural expert team."
      />
      
      {/* 1. Page Header */}
      <div className="bg-gradient-to-br from-brand-green-dark via-emerald-900 to-slate-900 text-white p-6 sm:p-10 rounded-3xl shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
        
        <span className="bg-brand-gold text-brand-green-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-4 py-1 rounded-full inline-block shadow-md">
          {language === 'mr' ? 'डीलरशिप व वितरण व्यवस्था' : 'Dealership & Distribution Network'}
        </span>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-4">
          {language === 'mr' ? 'आमच्या नेटवर्कमध्ये सहभागी व्हा' : 'Join Our Growth Network'}
        </h1>
        <p className="text-emerald-100 text-xs sm:text-base mt-2.5 max-w-2xl mx-auto font-medium leading-relaxed">
          {language === 'mr' 
            ? 'कृषी सेवा केंद्र, डीलरशिप, वितरण व्यवस्था आणि तज्ज्ञ कृषी सल्ल्यासाठी आजच प्राची अॅग्रो कुटुंबाशी जोडा.' 
            : 'Partner with Prachi Agro Industries for Authorized Dealership, Bulk Supply, and Agronomic Guidance.'}
        </p>

        {/* Benefits Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-center">
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <Store className="mx-auto mb-1 text-brand-gold" size={20} />
            <p className="text-[11px] font-bold">अधिकृत डीलरशिप</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <Handshake className="mx-auto mb-1 text-brand-gold" size={20} />
            <p className="text-[11px] font-bold">आकर्षक मार्जिन</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <Building2 className="mx-auto mb-1 text-brand-gold" size={20} />
            <p className="text-[11px] font-bold">दर्जेदार उत्पादने</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <Users className="mx-auto mb-1 text-brand-gold" size={20} />
            <p className="text-[11px] font-bold">पूर्ण विक्री सहाय्य</p>
          </div>
        </div>
      </div>

      {/* 2. Dealers Network Map & Centers */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-brand-green-dark tracking-tight">
              {language === 'mr' ? 'आमचे डीलर व वितरण नेटवर्क' : 'Our Dealer & Distribution Network'}
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {language === 'mr' ? 'तुमच्या जवळचे अधिकृत कृषी केंद्र शोधा' : 'Find authorized agri retail centers near you'}
            </p>
          </div>
          <span className="bg-emerald-50 text-brand-green-dark text-xs font-bold px-3 py-1 rounded-full border border-emerald-100 self-start sm:self-auto">
            ६+ प्रमुख जिल्हे
          </span>
        </div>
        
        {/* Map */}
        <div className="w-full rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.265588856342!2d73.91454!3d18.52043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMxJzEzLjYiTiA3M8KwNTQnNTIuNCJF!5e0!3m2!1sen!2sin!4v1234567890" 
            width="100%" 
            height="320" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Dealers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { city: 'पुणे (Pune)', name: 'राज ॲग्री सेंटर', phone: '9876543210' },
            { city: 'नाशिक (Nashik)', name: 'ग्रीन फार्म सप्लाय', phone: '9765432109' },
            { city: 'छ. संभाजीनगर (Aurangabad)', name: 'किसान सेवा केंद्र', phone: '9654321098' },
            { city: 'सोलापूर (Solapur)', name: 'प्राची ॲग्रो डीलर', phone: '9543210987' },
            { city: 'कोल्हापूर (Kolhapur)', name: 'ॲग्री वर्ल्ड कृषी केंद्र', phone: '9432109876' },
            { city: 'नागपूर (Nagpur)', name: 'भूमी ॲग्रो स्टोअर्स', phone: '9321098765' }
          ].map((dealer, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-3 hover:shadow-md hover:border-emerald-200 transition-all">
              <div className="bg-white p-2.5 rounded-lg shadow-sm text-brand-magenta flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-800 text-sm truncate">{dealer.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{dealer.city}</p>
                <a href={`tel:${dealer.phone}`} className="text-brand-green-dark font-bold text-xs mt-1 block hover:underline">
                  {dealer.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Grid: Direct Contacts & Dealership Application Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direct Contacts */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <h2 className="font-extrabold text-slate-800 text-base uppercase tracking-wider border-b border-slate-50 pb-3">
              {language === 'mr' ? 'थेट संपर्क माहिती' : 'Direct Contact Info'}
            </h2>

            {/* Direct Phone */}
            <a 
              href="tel:9021605160" 
              className="flex items-center gap-4 p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100/50 group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-green-dark flex items-center justify-center flex-shrink-0 group-hover:bg-brand-green-dark group-hover:text-white transition-all">
                <Phone size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">
                  {language === 'mr' ? 'थेट कॉल करा' : 'Call Us'}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-slate-800">9021605160</span>
              </div>
            </a>

            {/* WhatsApp */}
            <button 
              onClick={handleWhatsAppContact}
              className="w-full flex items-center gap-4 p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100/50 group text-left transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-green-dark flex items-center justify-center flex-shrink-0 group-hover:bg-brand-green-dark group-hover:text-white transition-all">
                <MessageCircle size={18} className="fill-current" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">
                  {language === 'mr' ? 'WhatsApp वर बोला' : 'WhatsApp Us'}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-slate-800">9021605160</span>
              </div>
            </button>

            {/* Email */}
            <a 
              href="mailto:info@prachiagro.com" 
              className="flex items-center gap-4 p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100/50 group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-green-dark flex items-center justify-center flex-shrink-0 group-hover:bg-brand-green-dark group-hover:text-white transition-all">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">
                  {language === 'mr' ? 'अधिकृत ईमेल' : 'Official Email'}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-slate-800 truncate block">info@prachiagro.com</span>
              </div>
            </a>

          </div>
        </div>

        {/* Right Column: Dealership / Network Form */}
        <div className="md:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="font-extrabold text-slate-800 text-base uppercase tracking-wider mb-5 border-b border-slate-50 pb-3">
            {language === 'mr' ? 'डीलरशिप व सहभाग अर्ज' : 'Dealership & Network Application'}
          </h2>

          {submitted && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-brand-green-dark rounded-xl flex items-center gap-3 animate-pulse">
              <CheckCircle2 className="text-brand-green-bright flex-shrink-0" size={20} />
              <span className="text-xs sm:text-sm font-bold">
                {language === 'mr' 
                  ? 'तुमचा अर्ज यशस्वीरित्या स्वीकारला गेला आहे. आमचे विभागीय प्रतिनिधी लवकरच आपल्याशी संपर्क साधतील!' 
                  : 'Your request has been submitted. Our team will contact you shortly.'}
              </span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            
            {/* Inquiry Type Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                {language === 'mr' ? 'चौकशीचा प्रकार' : 'Inquiry Type'}
              </label>
              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50/50"
              >
                <option value="dealership">{language === 'mr' ? 'नवीन डीलरशिप / कृषी केंद्र सुरू करणे' : 'New Dealership / Agri Retail Center'}</option>
                <option value="distributor">{language === 'mr' ? 'तालुका / जिल्हा वितरण व्यवस्था (Distributorship)' : 'District / Taluka Distributorship'}</option>
                <option value="bulk">{language === 'mr' ? 'थोक खरेदी (Bulk Product Purchase)' : 'Bulk Order Inquiry'}</option>
                <option value="guidance">{language === 'mr' ? 'शेतकरी पीक मार्गदर्शन व सल्ला' : 'Farmer Crop Guidance & Support'}</option>
              </select>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                {language === 'mr' ? 'आपले नाव' : 'Full Name'} <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा. राहुल पाटील"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50/30"
              />
            </div>

            {/* Business / Agri Shop Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                {language === 'mr' ? 'कृषी सेवा केंद्र / व्यवसायाचे नाव (ऐच्छिक)' : 'Agri Center / Shop Name (Optional)'}
              </label>
              <input 
                type="text" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="उदा. श्री स्वामी समर्थ कृषी केंद्र"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50/30"
              />
            </div>

            {/* Mobile & City Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mobile */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  {language === 'mr' ? 'मोबाईल नंबर' : 'Mobile Number'} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="उदा. 9876543210"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50/30"
                />
              </div>

              {/* City / District */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  {language === 'mr' ? 'गाव / तालुका / जिल्हा' : 'City / District'} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="उदा. बारामती, पुणे"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50/30"
                />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                {language === 'mr' ? 'आपला संदेश / माहिती' : 'Your Message'} <span className="text-red-500">*</span>
              </label>
              <textarea 
                rows="3"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="उदा. आम्हाला आमच्या भागात प्राची ॲग्रोची डीलरशिप सुरू करायची आहे..."
                className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50/30 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 bg-brand-green-dark hover:bg-brand-green-light active:scale-[0.98] text-white font-extrabold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
            >
              <Send size={16} />
              <span>{language === 'mr' ? 'सहभाग अर्ज पाठवा (Submit Application)' : 'Submit Application'}</span>
            </button>

          </form>
        </div>

      </div>

    </div>
  );
};

export default Contact;
