import React, { useState, useEffect } from 'react';
import { ExternalLink, Sparkles, CheckCircle2, Bell, Play, ShieldCheck, Award, X, Search } from 'lucide-react';
import { YoutubeIcon } from '../components/BrandIcons';
import { useLanguage } from '../context/LanguageContext';
import { getVideos, videoCategories, extractEmbedId } from '../data/videos';
import VideoCard from '../components/VideoCard';
import SEOHead from '../components/SEOHead';

// Official channel link with 1-click subscription confirmation trigger
const YOUTUBE_SUBSCRIBE_URL = "https://www.youtube.com/@prachiagroindustries03?sub_confirmation=1";

const Videos = () => {
  const { t, language } = useLanguage();
  const [videosList, setVideosList] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  useEffect(() => {
    getVideos()
      .then(data => setVideosList(Array.isArray(data) ? data : (Array.isArray(data?.videos) ? data.videos : [])))
      .catch(err => {
        console.warn('Failed to load videos:', err);
        setVideosList([]);
      });
  }, []);

  const handlePlayClick = (video) => {
    setActiveVideoModal(video);
  };

  const closeModal = () => {
    setActiveVideoModal(null);
  };

  // Filtered videos based on category and search query
  const filteredVideos = (Array.isArray(videosList) ? videosList : []).filter((video) => {
    if (!video) return false;
    const titleText = typeof video.title === 'object' ? (video.title[language] || video.title.mr || video.title.en || '') : (video.title || '');
    const cropText = typeof video.crop === 'object' ? (video.crop[language] || video.crop.mr || video.crop.en || '') : (video.crop || '');
    const categoryText = typeof video.category === 'object' ? (video.category[language] || video.category.mr || video.category.en || '') : (video.category || '');

    const matchesSearch = titleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cropText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          categoryText.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeCategory === 'all') return matchesSearch;
    const catEn = (video.category?.en || (typeof video.category === 'string' ? video.category : '')).toLowerCase().replace(/\s+/g, '-');
    const catMr = video.category?.mr || '';
    return matchesSearch && (catEn === activeCategory || catMr === activeCategory);
  });

  return (
    <div className="flex flex-col gap-8 text-left max-w-6xl mx-auto py-4">
      <SEOHead 
        title={language === 'mr' ? 'कृषी सल्ला व्हिडिऑज - प्राची अॅग्रो' : 'Agricultural Guidance Videos - Prachi Agro'} 
        description="Watch official Prachi Agro farming guidance videos, crop protection tips, and product usage tutorials directly on our website."
      />

      {/* Main Channel Subscription Showcase Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white p-6 sm:p-10 rounded-3xl shadow-2xl border-2 border-red-600/40 text-center sm:text-left">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center sm:items-start gap-6">
          
          {/* Header Badge */}
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white font-black text-xs uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
              <Sparkles size={13} />
              OFFICIAL YOUTUBE CHANNEL
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
            {/* Logo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white flex items-center justify-center p-3 flex-shrink-0 shadow-2xl border-4 border-white/80">
              <img
                src="/assets/logo.png"
                alt="Prachi Agro Industries Official Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white m-0">
                  PRACHI AGRO INDUSTRIES
                </h1>
                <CheckCircle2 size={24} className="text-brand-green-bright fill-brand-green-bright/20 flex-shrink-0" />
              </div>
              
              <p className="text-red-400 font-bold text-sm sm:text-base mt-1">
                @prachiagroindustries03
              </p>

              <p className="text-slate-300 text-xs sm:text-sm mt-2 font-medium leading-relaxed">
                {language === 'mr' 
                  ? 'शेतकऱ्यांसाठी मोफत कृषी सल्ला, पीक संरक्षण, औषध फवारणी वेळापत्रक आणि आधुनिक शेतीचे मार्गदर्शक व्हिडिओ.'
                  : 'Free agricultural advice, crop protection schedules, and modern farming techniques.'}
              </p>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 my-2 text-xs font-extrabold text-slate-200">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-2.5">
              <span className="text-base">🌾</span>
              <span>कांदा व ऊस विशेष नियोजन</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-2.5">
              <span className="text-base">🛡️</span>
              <span>बुरशीनाशक व कीड नियंत्रण</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-2.5">
              <span className="text-base">🧪</span>
              <span>खात्रीशीर खत व्यवस्थापन</span>
            </div>
          </div>

          {/* Big Prominent Subscribe Action Button */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
              <Bell size={16} className="text-amber-400 animate-bounce" />
              <span>{language === 'mr' ? 'नवीन व्हिडिओंसाठी आजच सबस्क्राईब करा' : 'Subscribe today for regular video updates'}</span>
            </div>

            <a
              href={YOUTUBE_SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-base px-8 py-3.5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-red-600/50 hover:shadow-red-600/70 transition-all cursor-pointer border border-red-400/40"
            >
              <YoutubeIcon size={24} className="fill-current" />
              <span>{language === 'mr' ? 'चॅनेल सबस्क्राईब करा' : 'Subscribe on YouTube'}</span>
              <ExternalLink size={18} className="opacity-90" />
            </a>
          </div>

        </div>
      </div>

      {/* Video Search & Category Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-brand-green-dark tracking-tight">
              {language === 'mr' ? 'कृषी मार्गदर्शक व्हिडिऑज (Watch Videos)' : 'Farming Guidance Video Gallery'}
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {language === 'mr' ? 'पिकांवरील रोगांपासून ते खत नियोजनापर्यंत सर्व मार्गदर्शन व्हिडिओ थेट येथे पहा' : 'Watch step-by-step videos on crop diseases, fertilizers, and yield optimization'}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'mr' ? 'व्हिडिओ किंवा पीक शोधा...' : 'Search videos or crops...'}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-brand-green-dark focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
          {videoCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-brand-green-dark text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {t(cat.title)}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="bg-white border border-slate-100 p-12 rounded-3xl text-center shadow-sm">
          <Play size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-extrabold text-slate-700 text-base">
            {language === 'mr' ? 'कोणताही व्हिडिओ आढळला नाही' : 'No Videos Found'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'mr' ? 'कृपया दुसरा शब्द शोधून पहा किंवा श्रेणी बदला.' : 'Try adjusting your search query or category filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id || video._id} video={video} onPlayClick={handlePlayClick} />
          ))}
        </div>
      )}

      {/* In-Website YouTube Video Player Modal */}
      {activeVideoModal && (() => {
        const embedId = activeVideoModal.embedId || extractEmbedId(activeVideoModal.youtubeUrl);
        const titleText = t(activeVideoModal.title);

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
            <div className="bg-slate-950 text-white border border-slate-800 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col relative">
              
              {/* Modal Header */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/80">
                <div className="flex items-center gap-2 min-w-0 pr-4">
                  <YoutubeIcon size={20} className="text-red-600 flex-shrink-0" />
                  <h3 className="font-extrabold text-sm sm:text-base text-white truncate m-0">
                    {titleText}
                  </h3>
                </div>

                <button
                  onClick={closeModal}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-full transition-colors cursor-pointer flex-shrink-0"
                  aria-label="Close player"
                >
                  <X size={18} />
                </button>
              </div>

              {/* YouTube iFrame Player Container */}
              <div className="aspect-video w-full bg-black relative">
                {embedId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${embedId}?autoplay=1&rel=0`}
                    title={titleText}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900">
                    <Play size={48} className="text-red-500 mb-3" />
                    <p className="font-extrabold text-base text-white">{titleText}</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-md">
                      युट्युब चॅनेलवर हा व्हिडिओ पाहण्यासाठी खालील बटनावर क्लिक करा.
                    </p>
                    <a
                      href={activeVideoModal.youtubeUrl || YOUTUBE_SUBSCRIBE_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-full flex items-center gap-2 shadow-md"
                    >
                      <YoutubeIcon size={16} />
                      <span>Watch on YouTube</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Modal Footer Info */}
              <div className="p-4 sm:p-5 bg-slate-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
                <div>
                  <span className="bg-emerald-950 text-emerald-400 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-800 mr-2">
                    {t(activeVideoModal.category)}
                  </span>
                  <span className="font-bold text-slate-300">{t(activeVideoModal.crop)}</span>
                </div>

                <a
                  href={activeVideoModal.youtubeUrl || YOUTUBE_SUBSCRIBE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-400 hover:text-red-300 font-extrabold flex items-center gap-1 hover:underline"
                >
                  <span>Open directly in YouTube App</span>
                  <ExternalLink size={14} />
                </a>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};

export default Videos;
