import React, { useState, useEffect } from 'react';
import { Play, X, Tag, ExternalLink, Sparkles, CheckCircle2, Tv } from 'lucide-react';
import { YoutubeIcon } from '../components/BrandIcons';
import { useLanguage } from '../context/LanguageContext';
import { getVideos, videoCategories } from '../data/videos';
import VideoCard from '../components/VideoCard';
import SEOHead from '../components/SEOHead';

// Official channel link with 1-click subscription confirmation trigger
const YOUTUBE_SUBSCRIBE_URL = "https://www.youtube.com/@prachiagroindustries03?sub_confirmation=1";
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@prachiagroindustries03";

const Videos = () => {
  const [videosList, setVideosList] = useState([]);
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    getVideos().then(data => {
      setVideosList(data);
      if (data.length > 0 && !selectedVideo) {
        setSelectedVideo(data[0]); // Default first video in player
      }
    });
  }, []);

  // Filter videos based on category
  const filteredVideos = videosList.filter((video) => {
    if (selectedCategory === 'all') return true;
    
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
    // Scroll smoothly to player if on mobile
    const playerEl = document.getElementById('featured-video-player');
    if (playerEl) {
      playerEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      <SEOHead 
        title={language === 'mr' ? 'कृषी मार्गदर्शन व्हिडिओ - प्राची अॅग्रो' : 'Agricultural Videos - Prachi Agro'} 
        description="Watch expert agricultural guidance and product demonstration videos by Prachi Agro Industries."
      />

      {/* YouTube Channel Hero Card with Official Logo */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-red-900/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Official Company Logo */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white flex items-center justify-center p-2.5 flex-shrink-0 shadow-xl border-2 border-white/40">
              <img
                src="/assets/logo.png"
                alt="Prachi Agro Industries Official Logo"
                className="max-h-full max-w-full object-contain"
              />
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
                <CheckCircle2 size={20} className="text-brand-green-bright fill-brand-green-bright/20 flex-shrink-0" />
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 font-medium">
                @prachiagroindustries03 • {language === 'mr' ? 'शेतकऱ्यांसाठी मोफत कृषी सल्ला व मार्गदर्शक व्हिडिओ' : 'Free farming tips & crop guidance for farmers'}
              </p>
            </div>
          </div>

          {/* Action: Direct 1-Click YouTube Subscribe Trigger */}
          <a
            href={YOUTUBE_SUBSCRIBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-sm px-7 py-3.5 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-red-600/40 hover:shadow-red-600/60 transition-all cursor-pointer border border-red-400/40"
          >
            <YoutubeIcon size={20} className="fill-current" />
            <span>{language === 'mr' ? 'चॅनेल सबस्क्राईब करा' : 'Subscribe on YouTube'}</span>
            <ExternalLink size={14} className="opacity-80" />
          </a>
        </div>
      </div>

      {/* Featured Embedded Video Player */}
      {selectedVideo && (
        <div id="featured-video-player" className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white">
          <div className="p-4 sm:p-5 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
                <Tv size={16} />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
                  आता प्ले होत असलेला व्हिडिओ (Now Playing)
                </p>
                <h3 className="text-sm sm:text-base font-black text-white truncate">
                  {typeof selectedVideo.title === 'object' ? (selectedVideo.title[language] || selectedVideo.title.mr) : selectedVideo.title}
                </h3>
              </div>
            </div>

            <a
              href={selectedVideo.youtubeUrl || YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 flex-shrink-0"
            >
              <span>YouTube वर पहा</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="aspect-video w-full max-h-[520px] bg-black">
            <iframe
              title={typeof selectedVideo.title === 'object' ? selectedVideo.title.mr : selectedVideo.title}
              className="w-full h-full border-0"
              src={
                selectedVideo.embedId && selectedVideo.embedId !== 'dQw4w9WgXcQ'
                  ? `https://www.youtube.com/embed/${selectedVideo.embedId}?autoplay=1&rel=0`
                  : `https://www.youtube.com/embed?listType=user_uploads&list=prachiagroindustries03&autoplay=1`
              }
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2.5 pb-2 no-scrollbar border-b border-slate-100">
        {videoCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-brand-green-dark text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100 hover:border-slate-200'
            }`}
          >
            {t(cat.title)}
          </button>
        ))}
      </div>

      {/* Top 10 Embedded Video Cards Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-black text-brand-green-dark tracking-tight">
            {language === 'mr' ? 'टॉप १० निवडक व्हिडिओ' : 'Top 10 Curated Videos'}
          </h2>
          <span className="text-xs text-slate-400 font-bold">
            {top10Videos.length} {language === 'mr' ? 'व्हिडिओ दाखवत आहे' : 'Videos Showing'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {top10Videos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              onPlayClick={handlePlayVideo}
            />
          ))}
        </div>
      </div>

      {/* Bottom YouTube Banner CTA */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-white text-red-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <YoutubeIcon size={30} className="fill-red-600" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black">
              {language === 'mr' ? 'अधिक व्हिडिओ पाहण्यासाठी आमच्या चॅनेलला भेट द्या' : 'Visit Our YouTube Channel For More Videos'}
            </h3>
            <p className="text-xs sm:text-sm text-red-100 mt-1">
              नवीन तंत्रज्ञान, पीक मार्गदर्शन व उत्पादनांची माहिती दर आठवड्याला मिळवा.
            </p>
          </div>
        </div>
        
        <a
          href={YOUTUBE_SUBSCRIBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-red-600 hover:bg-red-50 active:scale-95 font-black text-sm px-6 py-3.5 rounded-full shadow-lg transition-all flex items-center gap-2 flex-shrink-0"
        >
          <span>{language === 'mr' ? 'आता सबस्क्राईब करा' : 'Subscribe Now'}</span>
          <ExternalLink size={16} />
        </a>
      </div>

    </div>
  );
};

export default Videos;
