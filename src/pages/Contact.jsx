import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { t, language } = useLanguage();
  
  // Form states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Check validation (basic)
    if (name && mobile && message) {
      setSubmitted(true);
      // Reset form
      setName('');
      setMobile('');
      setEmail('');
      setSubject('');
      setMessage('');
      
      // Auto reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent("नमस्कार Prachi Agro Industries, मला कृषी उत्पादनांविषयी चौकशी करायची आहे.");
    window.open(`https://wa.me/9284845035?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-10 text-left max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
        <span className="bg-emerald-50 text-brand-green-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-3.5 py-1 rounded-full inline-block">
          संपर्क करा (Contact Us)
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-brand-green-dark tracking-tight mt-4">
          आम्हाला संपर्क करा
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-semibold">
          {language === 'mr' ? 'काही प्रश्न किंवा शंका असल्यास त्वरित संपर्क साधा' : 'Have questions? Reach out to our agricultural support team directly.'}
        </p>
      </div>

      {/* Grid: Contact details & Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direct Contacts */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
            <h2 className="font-extrabold text-slate-800 text-lg uppercase tracking-wider border-b border-slate-50 pb-3">
              संपर्क माहिती (Contact Info)
            </h2>

            {/* Direct Phone */}
            <a 
              href="tel:9284845035" 
              className="flex items-center gap-4 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100/50 group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-green-dark flex items-center justify-center flex-shrink-0 group-hover:bg-brand-green-dark group-hover:text-white transition-all">
                <Phone size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">फोन करा (Call Us)</span>
                <span className="text-sm sm:text-base font-extrabold text-slate-800">9284845035</span>
              </div>
            </a>

            {/* WhatsApp */}
            <button 
              onClick={handleWhatsAppContact}
              className="w-full flex items-center gap-4 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100/50 group text-left transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-green-dark flex items-center justify-center flex-shrink-0 group-hover:bg-brand-green-dark group-hover:text-white transition-all">
                <MessageCircle size={18} className="fill-current" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">{t('whatsAppContact')}</span>
                <span className="text-sm sm:text-base font-extrabold text-slate-800">9284845035</span>
              </div>
            </button>

            {/* Email */}
            <a 
              href="mailto:info@prachiagro.com" 
              className="flex items-center gap-4 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100/50 group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-green-dark flex items-center justify-center flex-shrink-0 group-hover:bg-brand-green-dark group-hover:text-white transition-all">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">ईमेल करा (Email Us)</span>
                <span className="text-sm sm:text-base font-extrabold text-slate-800 truncate block">info@prachiagro.com</span>
              </div>
            </a>

          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="md:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="font-extrabold text-slate-800 text-lg uppercase tracking-wider mb-6 border-b border-slate-50 pb-3">
            चौकशी फॉर्म (Send Enquiry)
          </h2>

          {submitted && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-brand-green-dark rounded-xl flex items-center gap-3 animate-pulse">
              <CheckCircle2 className="text-brand-green-bright flex-shrink-0" size={20} />
              <span className="text-xs sm:text-sm font-bold">
                {language === 'mr' 
                  ? 'तुमचा संदेश यशस्वीरित्या पाठवला गेला आहे. आमचे तज्ज्ञ लवकरच संपर्क करतील!' 
                  : 'Your enquiry has been submitted. Our team will get back to you shortly.'}
              </span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                नाव (Name) <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="तुमचे नाव प्रविष्ट करा..."
                className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50/30"
              />
            </div>

            {/* Mobile & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mobile */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  मोबाईल नंबर (Mobile Number) <span className="text-red-500">*</span>
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

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  ईमेल आयडी (Email)
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="उदा. info@company.com"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50/30"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                विषय (Subject)
              </label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="उदा. औषध खरेदी चौकशी..."
                className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50/30"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                संदेश (Message) <span className="text-red-500">*</span>
              </label>
              <textarea 
                rows="4"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="तुमची चौकशी किंवा संदेश येथे लिहा..."
                className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-dark bg-slate-50/30 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 bg-brand-green-dark hover:bg-brand-green-light active:scale-[0.98] text-white font-extrabold text-sm py-3 px-6 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
            >
              <Send size={16} />
              <span>संदेश पाठवा (Send Message)</span>
            </button>

          </form>
        </div>

      </div>

    </div>
  );
};

export default Contact;
