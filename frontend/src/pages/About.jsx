import React from 'react';
import { ShieldCheck, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SEOHead from '../components/SEOHead';
import CertificatesSection from '../components/CertificatesSection';

const About = () => {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col gap-12 text-left max-w-5xl mx-auto">
      <SEOHead title="About Us - Prachi Agro Industries" />
      
      {/* 1. Page Header / Intro */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
        <span className="bg-emerald-50 text-brand-green-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-3.5 py-1 rounded-full inline-block">
          आमच्याबद्दल (About Us)
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-brand-green-dark tracking-tight mt-4">
          PRACHI AGRO INDUSTRIES
        </h1>
        <p className="text-brand-magenta font-black text-sm sm:text-base mt-2">
          "{t('positioning')}"
        </p>
        <div className="h-1 w-20 bg-brand-gold mx-auto mt-4 rounded-full" />
      </section>

      {/* 2. Brand Story / Values */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
        <div className="md:col-span-7 flex flex-col gap-4 text-left">
          <span className="bg-emerald-50 text-brand-green-dark text-xs font-black px-3.5 py-1 rounded-full self-start border border-emerald-200">
            🌱 १५ वर्षांची साथ… समृद्ध शेतीची नवी वाट!
          </span>
          
          <h2 className="text-xl sm:text-2xl font-black text-brand-green-dark tracking-tight border-l-4 border-brand-magenta pl-3">
            शेतकऱ्यांच्या प्रगतीचा विश्वासू साथीदार!
          </h2>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {language === 'mr' 
              ? 'गेल्या १५ वर्षांपासून प्राची अॅग्रो इंडस्ट्रीज शेतकऱ्यांच्या गरजा समजून घेत, आधुनिक शेतीसाठी विश्वासार्ह आणि प्रभावी उपाय उपलब्ध करून देण्यासाठी सातत्याने कार्यरत आहे.'
              : 'For over 15 years, Prachi Agro Industries has been dedicated to understanding farmer needs and providing proven agricultural solutions.'}
          </p>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {language === 'mr'
              ? 'शेतकऱ्यांचा विश्वास, गुणवत्तेची बांधिलकी आणि शेतीतील आधुनिक तंत्रज्ञानाचा स्वीकार, या मूल्यांच्या बळावर आम्ही आज अनेक शेतकऱ्यांशी विश्वासाचे नाते निर्माण केले आहे.'
              : 'Built on farmer trust, uncompromising quality, and modern agricultural science, we have formed long-lasting bonds with thousands of growers.'}
          </p>

          {/* Highlights Ribbon */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3.5 my-1 flex flex-wrap items-center justify-between gap-2 text-xs font-black text-brand-green-dark">
            <span>✨ १५ वर्षांचा अनुभव</span>
            <span className="text-emerald-300">•</span>
            <span>🤝 शेतकऱ्यांचा विश्वास</span>
            <span className="text-emerald-300">•</span>
            <span>🏅 गुणवत्तेची बांधिलकी</span>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {language === 'mr'
              ? 'आजवर मिळालेली शेतकऱ्यांची साथ आमच्यासाठी प्रेरणादायी आहे. भविष्यातही अधिक चांगली उत्पादने, योग्य मार्गदर्शन आणि आधुनिक शेतीचे प्रभावी उपाय शेतकऱ्यांपर्यंत पोहोचवण्यासाठी आम्ही कटिबद्ध आहोत.'
              : 'The trust and partnership of our farmers inspires us to continually deliver higher-grade tonics, fertilizers, and personalized advisory.'}
          </p>

          <p className="font-black text-brand-magenta text-sm sm:text-base mt-1">
            प्राची अॅग्रो इंडस्ट्रीज — {t('tagline')}
          </p>
        </div>

        {/* Official Company Logo Card */}
        <div className="md:col-span-5 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-slate-50 border-2 border-emerald-100/80 shadow-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center relative group">
          <div className="w-full aspect-square max-w-[280px] bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex items-center justify-center relative hover:scale-105 transition-transform duration-300">
            <img 
              src="/assets/logo.png" 
              alt="Prachi Agro Industries Official Logo" 
              className="max-h-full max-w-full object-contain drop-shadow-md"
            />
          </div>

          <div className="mt-5 w-full">
            <span className="bg-brand-gold text-brand-green-dark font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs inline-block">
              ★ १५+ वर्षे शेतकऱ्यांच्या सेवेत ★
            </span>
            <h3 className="font-black text-brand-green-dark text-base sm:text-lg mt-2 tracking-tight">
              PRACHI AGRO INDUSTRIES
            </h3>
            <p className="text-xs font-bold text-brand-magenta mt-0.5">
              {t('tagline')}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Core Values Grid */}
      <section>
        <div className="flex flex-col items-center mb-8 text-center">
          <h2 className="text-2xl font-black text-brand-green-dark tracking-tight">
            आमची मूल्ये (Our Core Values)
          </h2>
          <div className="h-0.5 w-16 bg-brand-magenta mt-2 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quality */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-brand-green-dark flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={26} />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">
              उत्कृष्ट गुणवत्ता (Quality Assurance)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {language === 'mr'
                ? 'आम्ही उत्पादनांच्या गुणवत्तेशी तडजोड करत नाही. प्रत्येक बॅच कडक सुरक्षा आणि गुणवत्तेच्या निकषांमधून जाते.'
                : 'We prioritize product safety and efficacy above all. Our formulations go through rigorous quality checks to deliver reliable crop protection.'}
            </p>
          </div>

          {/* Farmer Trust */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-brand-green-dark flex items-center justify-center flex-shrink-0">
              <Heart size={26} />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">
              शेतकऱ्यांचा विश्वास (Farmer-Centric)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {language === 'mr'
                ? 'आमचा विकास हा शेतकऱ्यांच्या प्रगतीवर अवलंबून आहे. त्यांच्या गरजा समजून घेऊन आम्ही उत्पादने विकसित करतो.'
                : 'We believe our growth is tied directly to the progress of the farmer. Our solutions are designed to address their specific challenges.'}
            </p>
          </div>

          {/* Innovation */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-brand-green-dark flex items-center justify-center flex-shrink-0">
              <Sparkles size={26} />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">
              नवीन तंत्रज्ञान (Agronomic Innovation)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {language === 'mr'
                ? 'आम्ही पिकांच्या शाकीय वाढीसाठी आणि रोग नियंत्रणासाठी आधुनिक तंत्रज्ञानाचा वापर करतो.'
                : 'We stay on top of agronomic developments, creating specialized tonics, biotic promoters, and soil health conditioners.'}
            </p>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <CertificatesSection />

      {/* 4. Support Block CTA */}
      <section className="bg-brand-green-dark text-white rounded-3xl p-8 text-center flex flex-col items-center gap-5 shadow-lg">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight">
          अधिक माहिती हवी आहे किंवा तज्ज्ञांशी बोलायचे आहे?
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl font-bold leading-relaxed">
          {language === 'mr'
            ? 'पिकांची वाढ आणि रोगांच्या नियंत्रणाविषयी आमच्या कृषी सल्लागारांशी थेट संपर्क साधा. आम्ही आपल्या सेवेत २४/७ आहोत.'
            : 'Get customized suggestions for crop nutrition and crop protection. Chat with our agronomist experts today.'}
        </p>
        <a 
          href="https://wa.me/9021605160" 
          target="_blank" 
          rel="noreferrer"
          className="bg-brand-gold hover:bg-brand-gold-hover active:scale-95 text-brand-green-dark font-extrabold text-sm px-6 py-3 rounded-full flex items-center gap-2 cursor-pointer transition-all shadow-md"
        >
          <MessageCircle size={18} className="fill-current text-brand-green-dark" />
          <span>तज्ज्ञांशी चॅट करा (WhatsApp Chat)</span>
        </a>
      </section>

    </div>
  );
};

export default About;
