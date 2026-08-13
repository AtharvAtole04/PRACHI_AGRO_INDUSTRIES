import React, { useState } from 'react';
import { Play, X, Tag } from 'lucide-react';
import { YoutubeIcon } from '../components/BrandIcons';
import { useLanguage } from '../context/LanguageContext';
import { videos, videoCategories } from '../data/videos';
import VideoCard from '../components/VideoCard';

const Videos = () => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Filter videos based on category
  const filteredVideos = videos.filter((video) => {
    if (selectedCategory === 'all') return true;
    
    // Category mapping logic from ID to Marathi/English titles
    if (selectedCategory === 'crop-guidance' && video.category.en === 'Crop Guidance') return true;
    if (selectedCategory === 'product-info' && video.category.en === 'Product Info') return true;
    if (selectedCategory === 'farmer-guidance' && video.category.en === 'Farmer Guidance') return true;
    if (selectedCategory === 'pest-disease' && video.category.en === 'Pest & Disease Management') return true;
    if (selectedCategory === 'fertilizer' && video.category.en === 'Fertilizer Management') return true;
    if (selectedCategory === 'prachi-products' && video.category.en === 'Prachi Agro Products') return true;

    return false;
  });

  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-brand-green-dark tracking-tight m-0">
            {language === 'mr' ? 'कृषी मार्गदर्शन व्हिडिओ' : 'Agricultural Video Library'}
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1.5 font-semibold">
            {language === 'mr' ? 'पिकांच्या योग्य देखभालीसाठी तज्ज्ञांचे मोफत मार्गदर्शन' : 'Learn best practices, disease control, and maximize crop yields'}
          </p>
        </div>
        
        <div className="bg-emerald-50 text-brand-green-dark text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 border border-emerald-100">
          <YoutubeIcon size={16} className="text-red-600" />
          <span>{filteredVideos.length} व्हिडिओ उपलब्ध</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2.5 pb-2 no-scrollbar border-b border-slate-100">
        {videoCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-xs font-bold rounded-lg border whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === cat.id
                ? 'bg-brand-green-dark border-brand-green-dark text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t(cat.title)}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
          <h3 className="font-extrabold text-slate-800 text-lg mb-2">
            या श्रेणीत व्हिडिओ उपलब्ध नाहीत!
          </h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            {language === 'mr' 
              ? 'आम्ही लवकरच या श्रेणीत नवीन मार्गदर्शन व्हिडिओ जोडणार आहोत.' 
              : 'Check back soon. We are in the process of compiling new crop guidance guides for this category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              onPlayClick={handlePlayVideo} 
            />
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-black rounded-2xl overflow-hidden max-w-3xl w-full aspect-video shadow-2xl border border-white/10">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-white hover:text-brand-gold bg-black/60 hover:bg-black/80 p-2 rounded-full cursor-pointer transition-all z-10"
              aria-label="Close video player"
            >
              <X size={20} />
            </button>
            {/* Iframe */}
            <iframe
              title={t(selectedVideo.title)}
              src={`https://www.youtube.com/embed/${selectedVideo.embedId}?autoplay=1`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default Videos;
