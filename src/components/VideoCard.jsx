import React from 'react';
import { Play, Clock, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const VideoCard = ({ video, onPlayClick }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      
      {/* Thumbnail with Play Overlay */}
      <div 
        onClick={() => onPlayClick(video)}
        className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden group-hover:opacity-95 transition-opacity"
      >
        <img 
          src={video.thumbnail} 
          alt={t(video.title)} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { 
            // Fallback Unsplash agri background if thumbnail is missing
            e.target.src = 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&q=80&w=400';
          }}
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-brand-magenta hover:bg-brand-magenta-light text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 active:scale-95 transition-all duration-300">
            <Play size={20} className="fill-current ml-0.5" />
          </div>
        </div>

        {/* Video Duration Badge */}
        <span className="absolute bottom-2.5 right-2.5 bg-black/75 text-white font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
          <Clock size={10} />
          {video.duration}
        </span>
      </div>

      {/* Meta details */}
      <div className="p-4 flex flex-col flex-grow text-left">
        
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="bg-emerald-50 text-brand-green-dark text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
            {t(video.category)}
          </span>
          <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
            <Tag size={9} />
            {t(video.crop)}
          </span>
        </div>

        {/* Title */}
        <h4 
          onClick={() => onPlayClick(video)}
          className="font-bold text-slate-800 text-sm sm:text-base leading-snug cursor-pointer hover:text-brand-green-dark transition-colors line-clamp-2"
        >
          {t(video.title)}
        </h4>

      </div>

    </div>
  );
};

export default VideoCard;
