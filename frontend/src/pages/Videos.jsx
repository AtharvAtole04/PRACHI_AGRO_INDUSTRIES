import React, { useState, useEffect } from 'react';
import { Play, X, Tag, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { YoutubeIcon } from '../components/BrandIcons';
import { useLanguage } from '../context/LanguageContext';
import { getVideos, videoCategories } from '../data/videos';
import VideoCard from '../components/VideoCard';
import SEOHead from '../components/SEOHead';

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@prachiagroindustries03";

const Videos = () => {
  const [videosList, setVideosList] = useState([]);
  useEffect(() => {
    getVideos().then(data => setVideosList(data));
  }, []);
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Filter videos based on category
  const filteredVideos = videosList.filter((video) => {
    if (selectedCategory === 'all') return true;
    
    // Category mapping logic from ID to Marathi/English titles
    if (selectedCategory === 'crop-guidance' && video.category?.en === 'Crop Guidance') return true;
    if (selectedCategory === 'product-info' && video.category?.en === 'Product Info') return true;
    if (selectedCategory === 'farmer-guidance' && video.category?.en === 'Farmer Guidance') return true;
    if (selectedCategory === 'pest-disease' && video.category?.en === 'Pest & Disease') return true;
    if (selectedCategory === 'fertilizer' && video.category?.en === 'Fertilizer Management') return true;
    if (selectedCategory === 'prachi-products' && video.category?.en === 'Prachi Agro Products') return true;

    return false;
  });

  // Limit to Top 10 for clean presentation
  const top10Videos = filteredVideos.slice(0, 10);

  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      <SEOHead 
        title={language === 'mr' ? 'कृषी मार्गदर्शन व्हिडिओ - प्राची अॅग्रो' : 'Agricultural Videos - Prachi Agro'} 
        description="Watch expert agricultural guidance and product demonstration videos by Prachi Agro Industries."
      />

      {/* YouTube Channel Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-red-900/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            {/* Channel Logo / Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-600/30 border-2 border-white/20">
              <YoutubeIcon size={36} className="text-white fill-white" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-600/30 text-red-300 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-red-500/30 inline-flex items-center gap-1">
                  <Sparkles size={11} />
                  OFFICIAL YOUTUBE CHANNEL
                </span>
                <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full hidden sm:inline-block">
                  टॉप १० व्हिडिओ
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white m-0">
                  PRACHI AGRO INDUSTRIES
                </h1>
                <CheckCircle2 size={18} className="text-brand-green-bright fill-brand-green-bright/20 flex-shrink-0" />
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 font-medium">
                @prachiagroindustries03 • {language === 'mr' ? 'शेतकऱ्यांसाठी मोफत कृषी सल्ला व मार्गदर्शक व्हिडिओ' : 'Free farming tips & crop guidance for farmers'}
              </p>
            </div>
          </div>

          {/* Action: Subscribe / Visit YouTube Channel */}
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/40 transition-all cursor-pointer border border-red-400/30"
          >
            <YoutubeIcon size={18} />
            <span>{language === 'mr' ? 'चॅनेल सबस्क्राईब करा' : 'Subscribe on YouTube'}</span>
            <ExternalLink size={14} className="opacity-80" />
          </a>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2.5 pb-2 no-scrollbar border-b border-slate-100">
        {videoCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === cat.id
                ? 'bg-brand-green-dark border-brand-green-dark text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t(cat.title)}
          </button>
        ))}
      </div>

      {/* Video Grid Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-800">
          {language === 'mr' ? 'टॉप १० निवडक व्हिडिओ' : 'Top 10 Featured Videos'}
        </h2>
        <span className="text-xs text-slate-500 font-semibold">
          {top10Videos.length} {language === 'mr' ? 'व्हिडिओ दाखवत आहे' : 'videos showing'}
        </span>
      </div>

      {/* Video Grid */}
      {top10Videos.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
          <h3 className="font-extrabold text-slate-800 text-lg mb-2">
            या श्रेणीत व्हिडिओ उपलब्ध नाहीत!
          </h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            {language === 'mr' 
              ? 'आम्ही लवकरच या श्रेणीत नवीन मार्गदर्शन व्हिडिओ जोडणार आहोत.' 
              : 'Check back soon. We are in the process of compiling new guidance videos for this category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {top10Videos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              onPlayClick={handlePlayVideo} 
            />
          ))}
        </div>
      )}

      {/* More on YouTube Banner */}
      <div className="bg-gradient-to-r from-red-50 via-white to-emerald-50 border border-red-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <YoutubeIcon size={26} className="text-white fill-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              {language === 'mr' ? 'आणखी व्हिडिओ पाहायचे आहेत का?' : 'Want to Watch More Videos?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {language === 'mr' 
                ? 'आमच्या अधिकृत YouTube चॅनेलवर ५०+ शेती मार्गदर्शन व्हिडिओ उपलब्ध आहेत!' 
                : 'Explore 50+ full crop guides, farmer testimonials & tips on our YouTube channel.'}
            </p>
          </div>
        </div>

        <a
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-900 hover:bg-black active:scale-95 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full flex items-center gap-2 cursor-pointer transition-all shadow-md flex-shrink-0"
        >
          <span>{language === 'mr' ? 'सर्व व्हिडिओ YouTube वर पहा' : 'View All on YouTube'}</span>
          <ExternalLink size={14} />
        </a>
      </div>

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
              title={typeof selectedVideo.title === 'object' ? (selectedVideo.title[language] || selectedVideo.title.mr) : selectedVideo.title}
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
