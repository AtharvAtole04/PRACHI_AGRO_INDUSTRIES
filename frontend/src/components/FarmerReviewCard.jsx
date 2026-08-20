import React from 'react';
import { Star, MapPin, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FarmerReviewCard = ({ review }) => {
  const { t, language } = useLanguage();

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full text-left relative overflow-hidden group">
      
      {/* Visual background leaf decoration */}
      <div className="absolute right-4 top-4 text-slate-100/70 -z-10 group-hover:scale-110 transition-transform duration-300">
        <svg className="w-16 h-16 fill-current" viewBox="0 0 24 24">
          <path d="M17 8C8 10 5.9 16.12 5 21C3.9 15.65 6.07 9.8 11 6C7.54 8 4.25 11.23 3 16.5C3.21 11.36 7.42 5 13 3C9.5 4.5 7.17 7.66 6 11.5C9.33 6.67 14 5 19 4C18.67 6.33 18 8 17 8Z" />
        </svg>
      </div>

      {/* Header: Farmer Info */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-slate-50 border-2 border-emerald-500/20 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner">
          <img 
            src={review.photo} 
            alt={review.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Standard farmer placeholder icon
              e.target.src = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=100';
            }}
          />
        </div>

        <div>
          <h4 className="font-extrabold text-slate-800 text-base leading-none">
            {review.name}
          </h4>
          
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {/* Location */}
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-0.5">
              <MapPin size={10} className="text-brand-magenta" />
              {review.location}
            </span>
            
            {/* Crop */}
            <span className="text-[11px] font-black text-brand-green-dark bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5">
              <Tag size={10} />
              {t(review.crop)}
            </span>
          </div>
        </div>
      </div>

      {/* Star Ratings */}
      <div className="flex items-center gap-0.5 mt-4 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={i < review.rating ? 'fill-current' : 'text-slate-200'} 
          />
        ))}
      </div>

      {/* Testimonial Quote */}
      <blockquote className="mt-3.5 text-slate-600 text-xs sm:text-sm leading-relaxed flex-grow italic font-medium">
        "{t(review.review)}"
      </blockquote>

    </div>
  );
};

export default FarmerReviewCard;
