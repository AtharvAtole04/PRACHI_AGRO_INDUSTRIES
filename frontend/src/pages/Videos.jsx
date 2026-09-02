import React from 'react';
import { ExternalLink, Sparkles, CheckCircle2, Bell, Play, ShieldCheck, Award } from 'lucide-react';
import { YoutubeIcon } from '../components/BrandIcons';
import { useLanguage } from '../context/LanguageContext';
import SEOHead from '../components/SEOHead';

// Official channel link with 1-click subscription confirmation trigger
const YOUTUBE_SUBSCRIBE_URL = "https://www.youtube.com/@prachiagroindustries03?sub_confirmation=1";

const Videos = () => {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col gap-10 text-left max-w-4xl mx-auto py-4">
      <SEOHead 
        title={language === 'mr' ? 'युट्युब चॅनेल सबस्क्राईब करा - प्राची अॅग्रो' : 'Subscribe YouTube Channel - Prachi Agro'} 
        description="Subscribe to Prachi Agro Industries YouTube channel for free expert agricultural guidance and farming techniques."
      />

      {/* Main Channel Subscription Showcase Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white p-8 sm:p-12 rounded-3xl shadow-2xl border-2 border-red-600/40 text-center sm:text-left">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center sm:items-start gap-6">
          
          {/* Header Badge */}
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white font-black text-xs uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
              <Sparkles size={13} />
              OFFICIAL YOUTUBE CHANNEL
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
            {/* Logo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white flex items-center justify-center p-3 flex-shrink-0 shadow-2xl border-4 border-white/80">
              <img
                src="/assets/logo.png"
                alt="Prachi Agro Industries Official Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white m-0">
                  PRACHI AGRO INDUSTRIES
                </h1>
                <CheckCircle2 size={24} className="text-brand-green-bright fill-brand-green-bright/20 flex-shrink-0" />
              </div>
              
              <p className="text-red-400 font-bold text-sm sm:text-base mt-1">
                @prachiagroindustries03
              </p>

              <p className="text-slate-300 text-xs sm:text-sm mt-2 font-medium leading-relaxed">
                {language === 'mr' 
                  ? 'शेतकऱ्यांसाठी मोफत कृषी सल्ला, पीक संरक्षण, औषध फवारणी वेळापत्रक आणि आधुनिक शेतीचे मार्गदर्शक व्हिडिओ.'
                  : 'Free agricultural advice, crop protection schedules, and modern farming techniques.'}
              </p>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 my-2 text-xs font-extrabold text-slate-200">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-2.5">
              <span className="text-base">🌾</span>
              <span>कांदा व ऊस विशेष नियोजन</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-2.5">
              <span className="text-base">🛡️</span>
              <span>बुरशीनाशक व कीड नियंत्रण</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-2.5">
              <span className="text-base">🧪</span>
              <span>खात्रीशीर खत व्यवस्थापन</span>
            </div>
          </div>

          {/* Big Prominent Subscribe Action Button */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
              <Bell size={16} className="text-amber-400 animate-bounce" />
              <span>{language === 'mr' ? 'नवीन व्हिडिओंसाठी आजच सबस्क्राईब करा' : 'Subscribe today for regular video updates'}</span>
            </div>

            <a
              href={YOUTUBE_SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-base px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-red-600/50 hover:shadow-red-600/70 transition-all cursor-pointer border border-red-400/40"
            >
              <YoutubeIcon size={24} className="fill-current" />
              <span>{language === 'mr' ? 'चॅनेल सबस्क्राईब करा' : 'Subscribe on YouTube'}</span>
              <ExternalLink size={18} className="opacity-90" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Videos;
