import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const statsData = [
  { icon: '🌾', value: 500, suffix: '+', label_mr: 'समाधानी शेतकरी', label_en: 'Satisfied Farmers' },
  { icon: '🧪', value: 19, suffix: '+', label_mr: 'प्रीमियम उत्पादने', label_en: 'Premium Products' },
  { icon: '📍', value: 10, suffix: '+', label_mr: 'वर्षांचा अनुभव', label_en: 'Years of Experience' },
  { icon: '⭐', value: 4.8, suffix: '', label_mr: 'सरासरी रेटिंग', label_en: 'Average Rating' }
];

const StatItem = ({ item, isVisible }) => {
  const { language } = useLanguage();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = item.value;
    const duration = 1500; // 1.5 seconds
    const incrementTime = 30; // ms
    const totalSteps = duration / incrementTime;
    const increment = end / totalSteps;

    if (!isVisible) return;

    let current = 0;
    const timer = setInterval(() => {
      start += 1;
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [item.value, isVisible]);

  // Format count for display
  const displayCount = item.value % 1 === 0 ? Math.floor(count) : count.toFixed(1);

  return (
    <div className="flex flex-col items-center justify-center p-3 sm:p-5 text-center transform transition duration-500 hover:scale-105">
      <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">{item.icon}</div>
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-brand-gold mb-1 tracking-tight">
        {displayCount}{item.suffix}
      </div>
      <div className="text-xs sm:text-sm md:text-base text-white/90 font-bold leading-snug">
        {language === 'mr' ? item.label_mr : item.label_en}
      </div>
    </div>
  );
};

const StatsCounter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-gradient-to-br from-brand-green-dark to-emerald-950 text-white rounded-3xl p-4 sm:p-8 md:p-10 shadow-lg border border-emerald-900/40">
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 divide-x divide-white/10 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {statsData.map((stat, index) => (
            <div key={index} className={index % 2 === 0 ? '' : 'pl-2'}>
              <StatItem item={stat} isVisible={isVisible} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
