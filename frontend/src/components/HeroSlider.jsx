import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MessageCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HeroSlider = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Slide 1: NPK खतांना सर्वोत्तम पर्याय (कृषी वरदान + कॉम्बी न्यूट्री किट)
    {
      theme: "from-emerald-950 via-green-900 to-slate-950",
      accentColor: "text-amber-300",
      badgeBg: "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950",
      tag: { mr: "१००% ORGANIC • संपूर्ण पोषण", en: "100% Organic • Complete Nutrition" },
      productTitle: "NPK खतांना सर्वोत्तम पर्याय!",
      subtitle: {
        mr: "कृषी वरदान + कॉम्बी न्यूट्री किट (संपूर्ण पोषण, भरघोस उत्पादन)",
        en: "Krushi Vardan + Combi Nutri Kit (Superior NPK Bio-Alternative)"
      },
      points: [
        { icon: "🌿", mr: "NPK ची उपलब्धता व पोषकांचे शोषण वाढवते", en: "Increases NPK availability & nutrient absorption" },
        { icon: "🌱", mr: "पिकांची जोमदार वाढ व सूक्ष्म अन्नद्रव्यांची पूर्तता", en: "Vigorous crop growth & fulfills micronutrients" },
        { icon: "🛡️", mr: "रोग व हवामानाचा ताण सहन करण्याची क्षमता वाढवते", en: "Builds high resistance to disease & weather stress" }
      ],
      posterImg: "/assets/banners/banner_npk_krushivardan.jpg",
      whatsappQuery: "कृषी वरदान + कॉम्बी न्यूट्री किट"
    },

    // Slide 2: ओके + फास्ट रिझल्ट (वेगवेगळ्या पिकांना एकच जोडी)
    {
      theme: "from-blue-950 via-indigo-950 to-slate-950",
      accentColor: "text-yellow-300",
      badgeBg: "bg-gradient-to-r from-red-500 to-pink-600 text-white",
      tag: { mr: "एकदम कसं ओके • जसं नावं तसा रिझल्ट", en: "All-In-One Solution • Proven Results" },
      productTitle: "OK + FAST RESULT ची महा-जोडी",
      subtitle: {
        mr: "वेगवेगळ्या पिकांना वेगवेगळी औषधे देऊ नका, फक्त एकच जोडी वापरा!",
        en: "One powerful combo for all crops: OK Botanical + Fast Result!"
      },
      points: [
        { icon: "🍅", mr: "पिकाची चमक, साईझ, वजन व टिकवण क्षमता वाढवते", en: "Boosts crop shine, fruit size, weight & shelf life" },
        { icon: "🎋", mr: "जोमदार वाढ, फळ सेटिंग व पांढऱ्या मुळ्यांचा विकास", en: "Multiplies feeder roots, branch growth & fruit set" },
        { icon: "🧅", mr: "कांदा, ऊस, टोमॅटो, मिरची, डाळिंब व सर्व पिकांसाठी", en: "Ideal for Onion, Sugarcane, Tomato, Chilli & Veg" }
      ],
      posterImg: "/assets/banners/banner_ok_fastresult.jpg",
      whatsappQuery: "OK + FAST RESULT जोडी"
    },

    // Slide 3: ऑरगॅनिक कार्बन (एक किलोत एका ट्रॉलीची ताकद)
    {
      theme: "from-amber-950 via-emerald-950 to-slate-950",
      accentColor: "text-emerald-300",
      badgeBg: "bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950",
      tag: { mr: "१००% WATER SOLUBLE • सेंद्रिय क्रांती", en: "100% Water Soluble • Organic Carbon" },
      productTitle: "एक किलोत एका ट्रॉलीची ताकद!",
      subtitle: {
        mr: "१ ट्रॉली शेणखत = १ किलो ऑरगॅनिक कार्बन (प्रती एकरी १ किलो)",
        en: "1 Trolley Farmyard Manure Power in Just 1 Kg Organic Carbon!"
      },
      points: [
        { icon: "🚜", mr: "१ ट्रॉली शेणखताएवढी सेंद्रिय ताकद अवघ्या १ किलोमध्ये", en: "Concentrated organic carbon equivalent to 1 cart of manure" },
        { icon: "🌱", mr: "जमिनीतील जिवाणू वाढवून सुपीकता व पाण्याचा निचरा सुधारते", en: "Multiplies beneficial soil microbes & water retention" },
        { icon: "🌾", mr: "सर्व प्रकारच्या पिकांसाठी ठिबक किंवा फवारणीद्वारे लागू", en: "100% soluble for drip irrigation & basal drenching" }
      ],
      posterImg: "/assets/banners/banner_organic_carbon.jpg",
      whatsappQuery: "ऑरगॅनिक कार्बन (Organic Carbon)"
    }
  ];

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleWhatsApp = () => {
    const currentProd = slides[currentSlide];
    const message = encodeURIComponent(`नमस्कार Prachi Agro Industries, मला ${currentProd.whatsappQuery} या उत्पादनाविषयी माहिती हवी आहे आणि ऑर्डर करायची आहे.`);
    window.open(`https://wa.me/9021605160?text=${message}`, '_blank');
  };

  return (
    <div className="relative w-full min-h-[460px] sm:min-h-[480px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60 group/slider">
      
      {/* Slides Wrapper */}
      <div className="w-full h-full relative">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
              idx === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none z-0'
            }`}
          >
            {/* Dynamic Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.theme} -z-10`} />
            
            {/* Subtle glow lights */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-magenta/15 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Layout Grid */}
            <div className="h-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-0 flex flex-col-reverse lg:flex-row items-center justify-between gap-6 lg:gap-10">
              
              {/* Left Column: Commercial Ad Headline & Bullet points */}
              <div className="flex-1 text-center lg:text-left text-white max-w-xl flex flex-col justify-center">
                
                {/* Tag Badge */}
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2.5">
                  <span className={`font-black text-[11px] sm:text-xs uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg inline-flex items-center gap-1.5 ${slide.badgeBg}`}>
                    <Sparkles size={13} />
                    <span>{slide.tag[language]}</span>
                  </span>
                </div>

                {/* Main Ad Title */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                  {slide.productTitle}
                </h2>

                {/* Subtitle */}
                <p className={`text-xs sm:text-base font-black mt-2 leading-snug ${slide.accentColor}`}>
                  {slide.subtitle[language]}
                </p>

                {/* Benefit Points Strip */}
                <div className="flex flex-col gap-2 mt-4 text-left max-w-lg mx-auto lg:mx-0">
                  {slide.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-1.5 shadow-sm hover:bg-white/15 transition-colors">
                      <span className="text-sm sm:text-base flex-shrink-0">{pt.icon}</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-100">
                        {pt[language]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* The Two Action Buttons (सर्व उत्पादने पहा & WhatsApp वर ऑर्डर करा) */}
                <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-3 sm:gap-4">
                  
                  {/* Button 1: सर्व उत्पादने पहा */}
                  <button
                    onClick={() => navigate('/products')}
                    className="w-full sm:w-auto bg-brand-green-bright hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-7 py-3 rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transition-all"
                  >
                    <span>{t('allProductsBtn')}</span>
                    <ArrowRight size={16} />
                  </button>
                  
                  {/* Button 2: WhatsApp वर ऑर्डर करा */}
                  <button
                    onClick={handleWhatsApp}
                    className="w-full sm:w-auto bg-brand-magenta hover:bg-brand-magenta-dark active:scale-95 text-white font-extrabold text-xs sm:text-sm px-7 py-3 rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-pink-900/30 hover:shadow-xl transition-all"
                  >
                    <MessageCircle size={18} className="fill-current" />
                    <span>{t('whatsAppOrder')}</span>
                  </button>

                </div>
              </div>

              {/* Right Column: High-Resolution Real Product Marketing Banner Graphic */}
              <div className="flex-1 w-full flex items-center justify-center relative">
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-white/80 shadow-2xl bg-white max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] aspect-square group/poster hover:scale-102 transition-transform duration-300">
                  <img
                    src={slide.posterImg}
                    alt={slide.productTitle}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => { e.target.src = '/assets/logo.png'; }}
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Official Ad
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Slide Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full cursor-pointer opacity-80 sm:opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full cursor-pointer opacity-80 sm:opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-20"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
              idx === currentSlide ? 'bg-brand-gold w-8' : 'bg-white/40 hover:bg-white/70 w-2.5'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </div>
  );
};

export default HeroSlider;
