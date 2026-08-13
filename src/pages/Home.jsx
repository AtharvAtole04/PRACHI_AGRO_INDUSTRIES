import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, X, Percent } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getProducts } from '../data/products';
import { categories } from '../data/categories';
import { getReviews } from '../data/reviews';
import { getVideos } from '../data/videos';
import { getBlogs } from '../data/blogs';

// Shared Components
import HeroSlider from '../components/HeroSlider';
import FeatureStrip from '../components/FeatureStrip';
import ProductCard from '../components/ProductCard';
import FarmerReviewCard from '../components/FarmerReviewCard';
import VideoCard from '../components/VideoCard';
import BlogCard from '../components/BlogCard';

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
      {/* 1. Hero Section Banner Slider */}
      <section aria-label="Hero Banner">
        <HeroSlider />
      </section>

      {/* 2. USP / Trust Feature Strip */}
      <section aria-label="Our Strengths" className="-mt-4 md:-mt-8 relative z-10">
        <FeatureStrip />
      </section>

      {/* 3. Product Categories Grid */}
      <section className="text-center">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-brand-green-dark tracking-tight">
            कृषी उत्पादनांच्या श्रेणी
          </h2>
          <div className="h-1 w-20 bg-brand-magenta mt-2.5 rounded-full" />
          <p className="text-slate-400 text-xs md:text-sm mt-3 font-semibold">
            {language === 'mr' ? 'आपल्या पिकांच्या प्रत्येक गरजेसाठी सर्वोत्तम उत्पादने' : 'Premium agricultural solutions for every crop cycle'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => navigate(`/products?category=${cat.id}`)}
              className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 text-center shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all duration-300 group flex flex-col items-center justify-between min-h-[180px]"
            >
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center p-2 mb-3 border border-slate-100 group-hover:bg-emerald-50 transition-colors">
                <img 
                  src={cat.image} 
                  alt={t(cat.title)}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to placeholder if category icon path doesn't exist
                    e.target.src = 'https://placehold.co/100x100?text=Agri';
                  }}
                />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm md:text-base leading-snug">
                  {t(cat.title)}
                </h3>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium mt-1 leading-snug">
                  {t(cat.subtitle)}
                </p>
              </div>
              <button className="text-[10px] md:text-xs font-black text-brand-green-dark bg-emerald-50 group-hover:bg-brand-green-dark group-hover:text-white px-3.5 py-1 rounded-full mt-3 transition-colors cursor-pointer">
                पहा / View
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Popular Products Grid */}
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

      {/* 5. Special Offers Strip banner */}
      {specialOffers.length > 0 && (
        <section className="bg-gradient-to-r from-brand-magenta to-brand-magenta-dark rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
          {/* Leaf decoration */}
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <svg className="w-80 h-80 fill-current" viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.12 5 21C3.9 15.65 6.07 9.8 11 6C7.54 8 4.25 11.23 3 16.5C3.21 11.36 7.42 5 13 3C9.5 4.5 7.17 7.66 6 11.5C9.33 6.67 14 5 19 4C18.67 6.33 18 8 17 8Z" />
            </svg>
          </div>

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
            
            <div className="flex gap-4 items-center">
              <Link 
                to="/products?filter=offers"
                className="bg-brand-gold hover:bg-brand-gold-hover active:scale-95 text-brand-green-dark font-black text-sm px-6 py-3 rounded-full shadow-md transition-all cursor-pointer"
              >
                ऑफर पहा (View Offers)
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6. New Products Grid Section */}
      {newProducts.length > 0 && (
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="text-left">
              <h2 className="text-2xl md:text-3xl font-black text-brand-green-dark tracking-tight">
                नवीन उत्पादने
              </h2>
              <div className="h-1 w-16 bg-brand-magenta mt-2.5 rounded-full" />
              <p className="text-slate-400 text-xs md:text-sm mt-3 font-semibold">
                {language === 'mr' ? 'आमची नव्याने लाँच झालेली अत्याधुनिक उत्पादने' : 'Discover newly launched innovative additions to our catalog'}
              </p>
            </div>
            <Link 
              to="/products?filter=new" 
              className="text-brand-green-dark hover:text-brand-green-light font-black text-xs sm:text-sm flex items-center gap-1 hover:gap-2 self-start sm:self-auto transition-all"
            >
              <span>सर्व पहा (View All)</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Latest Videos Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-black text-brand-green-dark tracking-tight">
              नवीन व्हिडिओ / शेतकरी मार्गदर्शन
            </h2>
            <div className="h-1 w-16 bg-brand-magenta mt-2.5 rounded-full" />
            <p className="text-slate-400 text-xs md:text-sm mt-3 font-semibold">
              {language === 'mr' ? 'पीक सल्ला, रोग नियंत्रण आणि प्रगत शेतीचे मार्गदर्शन' : 'Practical crop advice, pest solutions, and expert farming methodologies'}
            </p>
          </div>
          <Link 
            to="/videos" 
            className="text-brand-green-dark hover:text-brand-green-light font-black text-xs sm:text-sm flex items-center gap-1 hover:gap-2 self-start sm:self-auto transition-all"
          >
            <span>सर्व व्हिडिओ पहा (All Videos)</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videosList.slice(0, 3).map((video) => (
            <VideoCard key={video.id} video={video} onPlayClick={handlePlayVideo} />
          ))}
        </div>
      </section>

      {/* 8. Farmer Reviews (Testimonials) */}
      <section className="bg-brand-bg rounded-3xl p-6 md:p-10 border border-slate-100/50">
        <div className="flex flex-col items-center mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-brand-green-dark tracking-tight">
            शेतकऱ्यांचा विश्वास
          </h2>
          <div className="h-1 w-20 bg-brand-magenta mt-2.5 rounded-full" />
          <p className="text-slate-400 text-xs md:text-sm mt-3 font-semibold">
            {language === 'mr' ? 'प्राची अॅग्रो उत्पादने वापरून शेतकऱ्यांनी मिळविले विक्रमी उत्पादन!' : 'Real stories from proud farmers who transformed their crops with us'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviewsList.map((rev) => (
            <FarmerReviewCard key={rev.id} review={rev} />
          ))}
        </div>
      </section>

      {/* 9. Latest Blog Posts */}
      <section className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-black text-brand-green-dark tracking-tight">
              शेती मार्गदर्शन ब्लॉग
            </h2>
            <div className="h-1 w-16 bg-brand-magenta mt-2.5 rounded-full" />
            <p className="text-slate-400 text-xs md:text-sm mt-3 font-semibold">
              {language === 'mr' ? 'माती परीक्षण, खत नियोजन आणि आधुनिक शेती तंत्रज्ञान विषयक लेख' : 'Informative articles about crop cycles, soil testing, and pest controls'}
            </p>
          </div>
          <Link 
            to="/blog" 
            className="text-brand-green-dark hover:text-brand-green-light font-black text-xs sm:text-sm flex items-center gap-1 hover:gap-2 self-start sm:self-auto transition-all"
          >
            <span>सर्व ब्लॉग पहा (View Blogs)</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogsList.slice(0, 3).map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>

      {/* YouTube Video Modal Iframe Pop-up */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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

export default Home;
