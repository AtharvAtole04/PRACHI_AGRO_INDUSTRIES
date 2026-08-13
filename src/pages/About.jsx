import React from 'react';
import { ShieldCheck, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col gap-12 text-left max-w-5xl mx-auto">
      
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
        <div className="md:col-span-7 flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-black text-brand-green-dark tracking-tight border-l-4 border-brand-magenta pl-3">
            शेतकऱ्यांचा विश्वास, प्राची अॅग्रोचा विकास!
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {language === 'mr' 
              ? 'प्राची अॅग्रो इंडस्ट्रीज ही महाराष्ट्रातील शेतकऱ्यांची एक विश्वासार्ह आणि अग्रगण्य कृषी उत्पादन कंपनी आहे. आमचे मुख्य उद्दिष्ट शेतकऱ्यांना त्यांच्या शेती उत्पादनात वाढ करण्यासाठी उच्च दर्जाची आणि दर्जेदार कृषी उत्पादने प्रदान करणे आहे.'
              : 'Prachi Agro Industries is a leading and trusted agricultural products company based in Maharashtra. Our primary goal is to empower farmers by providing them with high-quality and reliable inputs that boost crop performance.'}
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {language === 'mr'
              ? 'आम्ही पिकांच्या संरक्षणासाठी बुरशीनाशके, वाढ प्रवर्तक, मायक्रोन्युट्रिएंट्स आणि सिलिकॉन आधारित उत्पादने यांसारख्या आधुनिक कृषी उपकरणांचे उत्पादन करतो. आमची सर्व उत्पादने उत्कृष्ट गुणवत्तेची खात्री देतात जेणेकरून प्रत्येक शेतकऱ्याला भरघोस नफा मिळेल.'
              : 'We manufacture modern agricultural crop protection inputs, plant growth promoters, micronutrient combinations, and silicon-based protection formulas. Our formulations deliver quality results, helping farmers secure healthier crops.'}
          </p>
        </div>

        {/* Brand Image representation */}
        <div className="md:col-span-5 aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
          <img 
            src="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=500" 
            alt="Agriculture Field crops" 
            className="w-full h-full object-cover"
          />
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
                : 'We stay on top of agronomic developments, creating silicon-based protection and biotic promoters to tackle tough conditions.'}
            </p>
          </div>
        </div>
      </section>

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
          href="https://wa.me/9284845035" 
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
