import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HeroSlider = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      bgImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600",
      tag: { mr: "महाराष्ट्रातील विश्वासार्ह कंपनी", en: "Trusted Brand in Maharashtra" },
      heading: {
        mr: "उत्तम उत्पादनासाठी प्राची अॅग्रो सोबत आहे!",
        en: "For Superior Yields, Prachi Agro is with you!"
      },
      supportingText: {
        mr: "उच्च दर्जाची कृषी उत्पादने | शेतकऱ्यांचा विश्वास | भरोसेमंद उत्पादन",
        en: "Premium Agricultural Products | Farmer's Trust | Reliable Harvests"
      },
      productsToShow: [
        { name: "BACTRIKILLER", img: "/assets/products/bactrikiller.png" },
        { name: "MAGIC GOLD", img: "/assets/products/magic_gold.png" },
        { name: "SRPF", img: "/assets/products/srpf.png" }
      ]
    },
    {
      bgImage: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=1600",
      tag: { mr: "बुरशीजन्य रोगांवर १००% नियंत्रण", en: "100% Control Over Fungal Infections" },
      heading: {
        mr: "पिकांचे बुरशीपासून रक्षण करा, उत्पादन वाढवा!",
        en: "Shield Your Crops from Fungi, Double Your Income!"
      },
      supportingText: {
        mr: "बॅक्ट्रीकिलर प्रणालीगत बुरशीनाशक - सर्व प्रकारच्या बुरशीवर प्रभावी",
        en: "BACTRIKILLER Systemic Fungicide - The Ultimate Shield Against Diseases"
      },
      productsToShow: [
        { name: "BACTRIKILLER", img: "/assets/products/bactrikiller.png" }
      ]
    },
    {
      bgImage: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=1600",
      tag: { mr: "झाडांची जोमदार शाकीय वाढ व फूलधारणा", en: "Vigorous Plant Growth & Bud Boosting" },
      heading: {
        mr: "कळ्या आणि फुलांची विक्रमी वाढ - फास्ट रिझल्ट!",
        en: "Record Flowering and Yields with Fast Result!"
      },
      supportingText: {
        mr: "मॅजिक गोल्ड आणि फास्ट रिझल्ट वाढ प्रवर्तक",
        en: "Unlock the genetic potential of your crops with Magic Gold"
      },
      productsToShow: [
        { name: "MAGIC GOLD", img: "/assets/products/magic_gold.png" },
        { name: "FAST RESULT", img: "/assets/products/fast_result.png" }
      ]
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
    const message = encodeURIComponent("नमस्कार Prachi Agro Industries, मी मुख्यपृष्ठावरील ऑफर्स पाहून संपर्क करत आहे.");
    window.open(`https://wa.me/9284845035?text=${message}`, '_blank');
  };

  return (
    <div className="relative w-full h-[550px] sm:h-[500px] lg:h-[480px] rounded-2xl overflow-hidden shadow-lg border border-slate-100 group/slider">
      
      {/* Slides Wrapper */}
      <div className="w-full h-full relative">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            {/* Background Image with Green Gradient Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center -z-10"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/80 via-brand-green-dark/60 to-transparent -z-10" />
            <div className="absolute inset-0 bg-black/15 -z-10" />

            {/* Slide Content Layout */}
            <div className="h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 pt-10 pb-8 lg:py-0">
              
              {/* Left Column: Typography & CTAs */}
              <div className="flex-1 text-center lg:text-left text-white max-w-2xl lg:py-6">
                <span className="inline-block bg-brand-gold text-brand-green-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-4 shadow-md">
                  {slide.tag[language]}
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black leading-tight tracking-tight drop-shadow-sm">
                  {slide.heading[language]}
                </h2>
                <p className="text-sm sm:text-base text-slate-100 font-bold mt-4 tracking-wide leading-relaxed">
                  {slide.supportingText[language]}
                </p>

                {/* Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
                  <button
                    onClick={() => navigate('/products')}
                    className="w-full sm:w-auto bg-brand-green-bright hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-sm px-7 py-3 rounded-full flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
                  >
                    <span>{t('allProductsBtn')}</span>
                  </button>
                  
                  <button
                    onClick={handleWhatsApp}
                    className="w-full sm:w-auto bg-brand-magenta hover:bg-brand-magenta-dark active:scale-95 text-white font-extrabold text-sm px-7 py-3 rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-pink-900/10 transition-all"
                  >
                    <MessageCircle size={18} className="fill-current" />
                    <span>{t('whatsAppOrder')}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Dynamic Overlap Product Display & Farmer Image */}
              <div className="flex-1 hidden lg:flex items-center justify-center relative h-full w-full min-h-[300px]">
                
                {/* Farmer Image representation on the right */}
                <div className="absolute right-0 bottom-0 top-6 overflow-hidden h-[90%] flex items-end opacity-90 hover:opacity-100 transition-opacity">
                  <img
                    src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=400"
                    alt="Indian Farmer Smiling"
                    className="h-full object-cover rounded-t-full border-4 border-white/20 shadow-2xl"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>

                {/* Overlapped product bottles layered dynamically */}
                <div className="absolute left-6 bottom-4 flex items-end gap-2 drop-shadow-2xl max-w-[280px]">
                  {slide.productsToShow.map((prod, pIdx) => (
                    <div 
                      key={pIdx} 
                      className="bg-white/80 backdrop-blur rounded-2xl p-2.5 border border-white/30 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 shadow-xl"
                      style={{
                        zIndex: 10 + pIdx,
                        marginLeft: pIdx > 0 ? '-35px' : '0',
                        marginBottom: pIdx === 1 ? '15px' : '0',
                        width: '110px'
                      }}
                    >
                      <div className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center p-1.5 border border-slate-100/50">
                        <img
                          src={prod.img}
                          alt={prod.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => { e.target.src = 'https://placehold.co/100x120?text=Agri' }}
                        />
                      </div>
                      <p className="text-[10px] font-black text-brand-green-dark text-center mt-1 truncate">{prod.name}</p>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Slide Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 active:scale-90 text-white p-2 rounded-full cursor-pointer opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 active:scale-90 text-white p-2 rounded-full cursor-pointer opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-20"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
              idx === currentSlide ? 'bg-brand-gold w-6' : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </div>
  );
};

export default HeroSlider;
