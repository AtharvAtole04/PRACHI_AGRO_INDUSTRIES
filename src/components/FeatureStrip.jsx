import React from 'react';
import { Award, Leaf, Users, Truck, Headphones } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FeatureStrip = () => {
  const { language } = useLanguage();

  const features = [
    {
      icon: <Award className="w-8 h-8 text-brand-green-dark" />,
      title: { mr: "गुणवत्तेची खात्री", en: "Quality Assured" },
      subtitle: { mr: "उच्च दर्जाची उत्पादने", en: "High Quality Products" }
    },
    {
      icon: <Leaf className="w-8 h-8 text-brand-green-dark" />,
      title: { mr: "आधुनिक तंत्रज्ञान", en: "Modern Tech" },
      subtitle: { mr: "नवीन तंत्रज्ञानावर आधारित", en: "Based on New Technology" }
    },
    {
      icon: <Users className="w-8 h-8 text-brand-green-dark" />,
      title: { mr: "शेतकऱ्यांचा विश्वास", en: "Farmer Trust" },
      subtitle: { mr: "हजारो शेतकऱ्यांची पसंती", en: "Chosen by Thousands" }
    },
    {
      icon: <Truck className="w-8 h-8 text-brand-green-dark" />,
      title: { mr: "वेगवान डिलिव्हरी", en: "Fast Delivery" },
      subtitle: { mr: "सुरक्षित आणि जलद सेवा", en: "Safe and Quick Shipping" }
    },
    {
      icon: <Headphones className="w-8 h-8 text-brand-green-dark" />,
      title: { mr: "तज्ज्ञांचा सल्ला", en: "Expert Advice" },
      subtitle: { mr: "आमचे तज्ज्ञ तुमच्या सेवेत", en: "Agri Experts at Your Service" }
    }
  ];

  return (
    <div className="w-full bg-white border border-slate-100 rounded-2xl py-6 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-row overflow-x-auto lg:overflow-x-visible lg:grid lg:grid-cols-5 gap-6 no-scrollbar snap-x scroll-smooth">
        {features.map((feat, idx) => (
          <div 
            key={idx}
            className="flex items-center gap-3.5 min-w-[240px] lg:min-w-0 snap-align-start border-r border-slate-100 last:border-r-0 px-2 flex-shrink-0"
          >
            {/* Icon Bubble */}
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              {feat.icon}
            </div>
            
            {/* Description Text */}
            <div className="text-left">
              <h4 className="font-extrabold text-slate-800 text-sm leading-tight">
                {feat.title[language]}
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-1 leading-tight">
                {feat.subtitle[language]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureStrip;
