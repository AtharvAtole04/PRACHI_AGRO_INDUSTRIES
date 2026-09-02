import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, X, Percent, Sparkles, Sprout, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getProducts } from '../data/products';
import { categories } from '../data/categories';
import { getReviews } from '../data/reviews';
import { getVideos } from '../data/videos';
import { getBlogs } from '../data/blogs';

// Shared Components
import HeroSlider from '../components/HeroSlider';
import FeatureStrip from '../components/FeatureStrip';
import CropFinder from '../components/CropFinder';
import ProductCard from '../components/ProductCard';
import FarmerReviewCard from '../components/FarmerReviewCard';
import VideoCard from '../components/VideoCard';
import BlogCard from '../components/BlogCard';
import SEOHead from '../components/SEOHead';
import MemberBanner from '../components/MemberBanner';

// Main Focus Crops with high-quality agricultural imagery
const FOCUS_CROPS = [
  {
    id: "onion",
    name_mr: "कांदा (Onion)",
    tag_mr: "कंद फुगवण, वजन व पात टिकवण्यासाठी",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=600",
    solutions: "BHOORATNA + MAGIC GOLD",
    query: "कांदा"
  },
  {
    id: "sugarcane",
    name_mr: "ऊस (Sugarcane)",
    tag_mr: "कांडीची लांबी, जाडी व जोमदार फुटवे",
    image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=600",
    solutions: "HUMIC 98% + FAST RESULT",
    query: "ऊस"
  },
  {
    id: "tomato",
    name_mr: "टोमॅटो (Tomato)",
    tag_mr: "फुलगळ नियंत्रण, फळांची चमक व आकार",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600",
    solutions: "MAGIC GOLD + BACTRIKILLER",
    query: "टोमॅटो"
  },
  {
    id: "papaya",
    name_mr: "पपई (Papaya)",
    tag_mr: "व्हायरस व बुरशी रक्षण, गोडवा व वजन",
    image: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&q=80&w=600",
    solutions: "SRPF + MYCRODIFENCE",
    query: "पपई"
  },
  {
    id: "chilli",
    name_mr: "मिरची (Chilli)",
    tag_mr: "बोकड्या/चुरडा-मुरडा नियंत्रण व अधिक फुले",
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=600",
    solutions: "BACTRIKILLER + MAGIC GOLD",
    query: "मिरची"
  }
];

const Home = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Dynamic States for localStorage datasets
  const [productsList, setProductsList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [videosList, setVideosList] = useState([]);
  const [blogsList, setBlogsList] = useState([]);

  useEffect(() => {
    getProducts().then(data => setProductsList(data));
    getReviews().then(data => setReviewsList(data));
    getVideos().then(data => setVideosList(data));
    getBlogs().then(data => setBlogsList(data));
  }, []);

  // Filter popular and new products
  const popularProducts = productsList.filter(p => p.isPopular).slice(0, 6);
  const newProducts = productsList.filter(p => p.isNew).slice(0, 4);
  const specialOffers = productsList.filter(p => p.originalPrice > p.basePrice).slice(0, 3);

  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
  };

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      <SEOHead 
        title={language === 'mr' ? 'प्राची ॲग्रो इंडस्ट्रीज - शेतकऱ्यांच्या प्रगतीचा विश्वासू साथीदार!' : 'Prachi Agro Industries - Trusted Partner in Farmer\'s Progress!'} 
        description="Manufacturer of premium plant growth promoters, crop tonics, and granular fertilizers."
      />

      {/* 1. Hero Section Banner Slider with Commercial Product Ads */}
      <section aria-label="Hero Banner">
        <HeroSlider />
      </section>

      {/* 2. USP / Trust Feature Strip */}
      <section aria-label="Our Strengths" className="-mt-4 md:-mt-8 relative z-10">
        <FeatureStrip />
      </section>

      {/* Dynamic Member & Role Announcement Banner */}
      <section aria-label="Member Notification">
        <MemberBanner />
      </section>

      {/* 3. Focused 6 Product Categories Grid (Bolder & Sharper) */}
      <section className="text-center">
        <div className="flex flex-col items-center mb-8">
          <span className="bg-emerald-50 text-brand-green-dark text-[10px] sm:text-xs font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full mb-2">
            उत्कृष्ट उत्पादने
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-brand-green-dark tracking-tight">
            कृषी उत्पादनांच्या मुख्य श्रेणी
          </h2>
          <div className="h-1 w-20 bg-brand-magenta mt-2.5 rounded-full" />
          <p className="text-slate-500 text-xs md:text-sm mt-3 font-semibold">
            {language === 'mr' ? 'पिकांच्या प्रत्येक अवस्थेसाठी दर्जेदार टॉनिक, खते व पीक संरक्षण' : 'Premium agricultural solutions for every crop growth cycle'}
          </p>
        </div>

        {/* 6 Grid items in 2 rows on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => navigate(`/products?category=${cat.id}`)}
              className="bg-white border-2 border-slate-100/80 rounded-2xl p-5 md:p-6 text-center shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1.5 cursor-pointer transition-all duration-300 group flex flex-col items-center justify-between min-h-[190px]"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50/60 flex items-center justify-center p-3 mb-3 border border-emerald-100 group-hover:bg-brand-green-dark group-hover:scale-110 transition-all duration-300 shadow-sm">
                <img 
                  src={cat.image} 
                  alt={t(cat.title)}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.src = '/assets/logo.png';
                  }}
                />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-sm md:text-base leading-snug group-hover:text-brand-green-dark transition-colors">
                  {t(cat.title)}
                </h3>
                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1 leading-snug">
                  {t(cat.subtitle)}
                </p>
              </div>
              <button className="text-[10px] md:text-xs font-black text-brand-green-dark bg-emerald-50 group-hover:bg-brand-green-dark group-hover:text-white px-4 py-1.5 rounded-full mt-3.5 transition-all shadow-xs cursor-pointer">
                पहा / View Category
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Special Crop Focus Spotlight (कांदा, ऊस, टोमॅटो, पपई, मिरची) */}
      <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-brand-green-dark text-white rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="bg-brand-gold text-slate-900 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-3 py-0.5 rounded-full inline-block shadow-sm">
              विशेष पीक मार्गदर्शन
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
              कांदा, ऊस, टोमॅटो, पपई व मिरची विशेष सोल्यूशन्स
            </h2>
            <p className="text-emerald-200 text-xs sm:text-sm font-medium mt-1">
              आपल्या पिकाच्या प्रत्येक अवस्थेसाठी सिद्ध झालेले खात्रीशीर रिझल्ट्स
            </p>
          </div>
          <Link
            to="/products"
            className="text-brand-gold hover:text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>सर्व पिकांची उत्पादने</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* 5 Crop Focus Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FOCUS_CROPS.map((crop) => (
            <div
              key={crop.id}
              onClick={() => navigate(`/products`)}
              className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/15 hover:border-brand-gold hover:bg-white/15 transition-all duration-300 cursor-pointer flex flex-col group"
            >
              <div className="h-36 w-full overflow-hidden relative">
                <img
                  src={crop.image}
                  alt={crop.name_mr}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute bottom-2 left-3 font-black text-white text-base">
                  {crop.name_mr}
                </span>
              </div>

              <div className="p-3.5 flex flex-col justify-between flex-grow text-left">
                <p className="text-[11px] text-emerald-100 font-medium leading-snug">
                  {crop.tag_mr}
                </p>
                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-black text-brand-gold truncate">
                    {crop.solutions}
                  </span>
                  <ArrowRight size={14} className="text-white/60 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Interactive Crop Finder Widget */}
      <section aria-label="Crop Finder">
        <CropFinder />
      </section>

      {/* 6. Popular Products Grid */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-black text-brand-green-dark tracking-tight flex items-center gap-1.5">
              <span>लोकप्रिय उत्पादने</span>
            </h2>
            <div className="h-1 w-16 bg-brand-magenta mt-2.5 rounded-full" />
            <p className="text-slate-400 text-xs md:text-sm mt-3 font-semibold">
              {language === 'mr' ? 'शेतकऱ्यांनी सर्वात जास्त खरेदी केलेली उत्पादने' : 'Our highest rated, top-selling agricultural solutions'}
            </p>
          </div>
          <Link 
            to="/products" 
            className="text-brand-green-dark hover:text-brand-green-light font-black text-xs sm:text-sm flex items-center gap-1 hover:gap-2 self-start sm:self-auto transition-all"
          >
            <span>सर्व उत्पादने पहा (View All)</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Special Offers Strip banner */}
      {specialOffers.length > 0 && (
        <section className="bg-gradient-to-r from-brand-magenta to-brand-magenta-dark rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <span className="bg-brand-gold text-brand-green-dark font-extrabold text-[10px] md:text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block">
                लिमिटेड टाईम ऑफर (Limited Offer)
              </span>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight">
                {t('specialOffers')}
              </h2>
              <p className="text-sm text-pink-100 font-bold mt-2">
                {language === 'mr' ? 'उच्च गुणवत्तेच्या उत्पादनांवर विशेष सवलत मिळवा. आजच खरेदी करा आणि नफा वाढवा!' : 'Get high-performance products at reduced price points. Grow healthier crops for less.'}
              </p>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="bg-brand-gold hover:bg-brand-gold-hover active:scale-95 text-brand-green-dark font-extrabold text-sm px-8 py-3.5 rounded-full cursor-pointer shadow-lg transition-all flex items-center gap-2 flex-shrink-0"
            >
              <span>ऑफर पहा (Shop Offers)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* 8. YouTube Channel Subscribe Banner */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-red-500/30">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-white text-red-600 flex items-center justify-center flex-shrink-0 shadow-lg p-2">
            <img
              src="/assets/logo.png"
              alt="Prachi Agro Logo"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1">
              OFFICIAL YOUTUBE CHANNEL
            </span>
            <h3 className="text-lg sm:text-xl font-black">
              {language === 'mr' ? 'मोफत कृषी सल्ल्यासाठी आमचे युट्युब चॅनेल सबस्क्राईब करा' : 'Subscribe to Our Official YouTube Channel'}
            </h3>
            <p className="text-xs sm:text-sm text-red-100 mt-1 font-medium">
              @prachiagroindustries03 • {language === 'mr' ? 'पीक मार्गदर्शन, औषध फवारणी वेळापत्रक आणि आधुनिक शेतीचे उपाय' : 'Free farming guidance & crop spray schedules'}
            </p>
          </div>
        </div>
        
        <a
          href="https://www.youtube.com/@prachiagroindustries03?sub_confirmation=1"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-red-600 hover:bg-red-50 active:scale-95 font-black text-sm px-7 py-3.5 rounded-2xl shadow-lg transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer"
        >
          <span>{language === 'mr' ? 'चॅनेल सबस्क्राईब करा' : 'Subscribe on YouTube'}</span>
          <ArrowRight size={16} />
        </a>
      </section>

      {/* 9. Agri Blogs Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-black text-brand-green-dark tracking-tight">
              {t('viewAllBlogs')}
            </h2>
            <div className="h-1 w-16 bg-brand-magenta mt-2.5 rounded-full" />
            <p className="text-slate-400 text-xs md:text-sm mt-3 font-semibold">
              {language === 'mr' ? 'हंगामी पिकांचे रोग नियंत्रण आणि खत व्यवस्थापन मार्गदर्शिका' : 'Season-wise crop disease and fertilizer management tips'}
            </p>
          </div>
          <Link 
            to="/blog" 
            className="text-brand-green-dark hover:text-brand-green-light font-black text-xs sm:text-sm flex items-center gap-1 hover:gap-2 self-start sm:self-auto transition-all"
          >
            <span>सर्व ब्लॉग पहा (View All Blogs)</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogsList.slice(0, 3).map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>

      {/* 10. Farmer Testimonials */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-brand-green-dark tracking-tight">
            {t('farmerTrust')}
          </h2>
          <div className="h-1 w-16 bg-brand-magenta mx-auto mt-2.5 rounded-full" />
          <p className="text-slate-400 text-xs md:text-sm mt-3 font-semibold">
            {language === 'mr' ? 'प्राची अॅग्रो उत्पादने वापरणाऱ्या समाधानी शेतकऱ्यांचे अनुभव' : 'Verified testimonials from progressive farmers'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsList.slice(0, 3).map((review) => (
            <FarmerReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      {/* Video Modal Popup */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full relative">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm sm:text-base truncate pr-4">{selectedVideo.title[language]}</h3>
              <button onClick={() => setSelectedVideo(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="aspect-video w-full">
              <iframe
                title={selectedVideo.title[language]}
                className="w-full h-full"
                src={
                  selectedVideo.embedId && selectedVideo.embedId !== 'dQw4w9WgXcQ'
                    ? `https://www.youtube.com/embed/${selectedVideo.embedId}?autoplay=1`
                    : `https://www.youtube.com/embed?listType=user_uploads&list=prachiagroindustries03&autoplay=1`
                }
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
