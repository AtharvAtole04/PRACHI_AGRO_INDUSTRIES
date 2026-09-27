import React, { useState, useEffect } from 'react';
import { MessageCircle, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getReviews } from '../data/reviews';
import FarmerReviewCard from '../components/FarmerReviewCard';

const Reviews = () => {
  const [reviewsList, setReviewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    let isMounted = true;
    getReviews()
      .then(data => {
        if (isMounted) {
          setReviewsList(Array.isArray(data) ? data : []);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="flex flex-col gap-8 text-left max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
        <span className="bg-emerald-50 text-brand-green-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-3.5 py-1 rounded-full inline-block">
          अभिप्राय (Farmer Testimonials)
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-brand-green-dark tracking-tight mt-4">
          शेतकऱ्यांचा आमच्यावर विश्वास
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-semibold">
          {language === 'mr' ? 'हजारो समाधानी शेतकऱ्यांचे प्राची ॲग्रो उत्पादनांविषयीचे मनोगत' : 'Hear from the farmers who have optimized their fields using our solutions.'}
        </p>
      </div>

      {/* Aggregated ratings banner */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-around items-center gap-6 text-center">
        <div>
          <span className="text-3xl sm:text-4xl font-black text-brand-green-dark">४.८ / ५</span>
          <div className="flex items-center text-amber-400 justify-center mt-1">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-current" />)}
          </div>
          <span className="text-xs text-slate-400 font-bold block mt-1.5 uppercase tracking-wide">सरासरी रेटिंग (Average Rating)</span>
        </div>
        
        <div className="h-px w-20 sm:h-12 sm:w-px bg-slate-100" />

        <div>
          <span className="text-3xl sm:text-4xl font-black text-slate-800">१००%</span>
          <span className="text-xs text-slate-400 font-bold block mt-2 uppercase tracking-wide">विश्वसनीयता (Farmer Satisfaction)</span>
        </div>

        <div className="h-px w-20 sm:h-12 sm:w-px bg-slate-100" />

        <div>
          <span className="text-3xl sm:text-4xl font-black text-slate-800">१०,०००+</span>
          <span className="text-xs text-slate-400 font-bold block mt-2 uppercase tracking-wide">आनंदी शेतकरी (Happy Farmers)</span>
        </div>
      </div>

      {/* Reviews Grid / Empty State */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center">
          <div className="w-8 h-8 border-4 border-brand-green-dark border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-xs font-bold">{language === 'mr' ? 'अभिप्राय लोड होत आहेत...' : 'Loading reviews...'}</p>
        </div>
      ) : reviewsList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsList.map((rev) => (
            <FarmerReviewCard key={rev.id || rev._id} review={rev} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center">
          <p className="text-slate-500 font-bold text-base m-0">
            {language === 'mr' ? 'अजून कोणतीही पुनरावलोकने नोंदवली नाहीत.' : 'No reviews yet.'}
          </p>
          <p className="text-slate-400 text-xs mt-1">
            {language === 'mr' ? 'आपला अभिप्राय खालील बटणावर क्लिक करून पाठवा.' : 'Be the first to share your experience with us.'}
          </p>
        </div>
      )}

      {/* Write a review Callout */}
      <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100/50 text-center flex flex-col items-center gap-4">
        <h3 className="font-extrabold text-brand-green-dark text-lg sm:text-xl">
          तुम्ही प्राची ॲग्रो उत्पादने वापरली आहेत का?
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-bold max-w-lg leading-relaxed">
          {language === 'mr'
            ? 'आपले अनुभव आणि पिकांचे फोटो आम्हाला WhatsApp वर पाठवा. तुमचे अभिप्राय इतर शेतकऱ्यांना प्रगत शेती करण्यासाठी उपयुक्त ठरतील!'
            : 'Share your feedback, yield reports, or crop photos with us. Your experience helps other farmers achieve success!'}
        </p>
        <a 
          href="https://wa.me/9021605160?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%BE%E0%A4%B0%20Prachi%20Agro%2C%20%E0%A4%AE%E0%A4%B2%E0%A4%BE%20%E0%A4%AE%E0%A4%BE%E0%A4%9D%E0%A4%BE%20%E0%A4%85%E0%A4%AB%E0%A4%BF%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%BE%E0%A4%AF%20%E0%A4%B6%E0%A5%87%E0%A4%8F%E0%A4%B0%20%E0%A4%95%E0%A4%B0%E0%A4%BE%E0%A4%AF%E0%A4%9A%E0%A4%BE%20%E0%A4%86%E0%A4%B9%E0%A5%87."
          target="_blank"
          rel="noreferrer"
          className="bg-brand-magenta hover:bg-brand-magenta-dark active:scale-95 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          <MessageCircle size={16} className="fill-current" />
          <span>अभिप्राय पाठवा (Send Feedback)</span>
        </a>
      </div>

    </div>
  );
};

export default Reviews;
