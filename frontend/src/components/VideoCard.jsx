import React from 'react';
import { Play, Clock, Tag, ExternalLink, CheckCircle2 } from 'lucide-react';
import { YoutubeIcon } from './BrandIcons';
import { useLanguage } from '../context/LanguageContext';

const VideoCard = ({ video, onPlayClick }) => {
  const { t, language } = useLanguage();

  const handleOpenYouTube = (e) => {
    e.stopPropagation();
    const url = video.youtubeUrl && video.youtubeUrl.includes('youtube.com/watch')
      ? video.youtubeUrl
      : `https://www.youtube.com/@prachiagroindustries03`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group hover:-translate-y-1">
      
      {/* Thumbnail with Play Overlay */}
      <div 
        onClick={() => onPlayClick(video)}
        className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden group-hover:opacity-95 transition-opacity"
      >
        <img 
          src={video.thumbnail} 
          alt={typeof video.title === 'object' ? (video.title[language] || video.title.mr) : video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { 
            e.target.src = 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&q=80&w=400';
          }}
        />
        
        {/* Dark vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-13 h-13 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/40">
            <Play size={22} className="fill-current ml-0.5" />
          </div>
        </div>

        {/* YouTube Corner Tag */}
        <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
          <YoutubeIcon size={12} className="text-red-500" />
          <span>YouTube</span>
        </div>

        {/* Video Duration Badge */}
        <span className="absolute bottom-2.5 right-2.5 bg-black/85 text-white font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
          <Clock size={10} />
          {video.duration || '10:00'}
        </span>
      </div>

      {/* Meta details */}
      <div className="p-4 flex flex-col flex-grow text-left justify-between">
        <div>
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="bg-emerald-50 text-brand-green-dark text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-100">
              {t(video.category)}
            </span>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
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

        {/* Channel Info & Views footer */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-bold text-slate-700 text-[11px]">Prachi Agro</span>
            <CheckCircle2 size={12} className="text-brand-green-dark fill-emerald-100" />
            {video.views && (
              <>
                <span>•</span>
                <span className="text-[11px] text-slate-500">{video.views} views</span>
              </>
            )}
          </div>

          <button
            onClick={handleOpenYouTube}
            className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 hover:underline cursor-pointer"
            title="Open on YouTube"
          >
            <span>YouTube</span>
            <ExternalLink size={11} />
          </button>
        </div>

      </div>

    </div>
  );
};

export default VideoCard;
