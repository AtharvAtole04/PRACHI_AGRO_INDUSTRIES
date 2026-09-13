import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag, MessageCircle, Share2, Copy, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getBlogs } from '../data/blogs';

const BlogDetail = () => {
  const { id } = useParams();
  const [blogsList, setBlogsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getBlogs().then(data => {
      if (isMounted) {
        setBlogsList(data);
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  const { t, language } = useLanguage();

  // Find blog by id or _id
  const blog = blogsList.find(b => b.id === id || b._id === id);

  if (isLoading) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center p-12">
        <div className="w-12 h-12 border-4 border-brand-green-dark border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto">
        <h3 className="font-extrabold text-slate-800 text-lg mb-2">
          ब्लॉग सापडला नाही!
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          The requested article could not be found. Check the URL or return to the blog directory.
        </p>
        <Link
          to="/blog"
          className="bg-brand-green-dark hover:bg-brand-green-light text-white font-bold text-sm px-6 py-2.5 rounded-full cursor-pointer transition-all inline-block shadow-md"
        >
          ब्लॉगकडे परत (Back to Blogs)
        </Link>
      </div>
    );
  }

  const blogTitle = t(blog.title);
  const blogExcerpt = t(blog.excerpt);
  const currentUrl = window.location.href;

  const handleWhatsAppShare = () => {
    const text = `🌾 *${blogTitle}*\n\n${blogExcerpt}\n\nसविस्तर वाचण्यासाठी येथे क्लिक करा:\n${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blogTitle,
          text: blogExcerpt,
          url: currentUrl
        });
      } catch (err) {
        console.log('Share canceled:', err);
      }
    } else {
      handleWhatsAppShare();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const renderShareBar = () => (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100/80 my-2">
      <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
        <Share2 size={16} className="text-brand-green-dark" />
        <span>{language === 'mr' ? 'हा लेख मित्रांना शेयर करा:' : 'Share this article:'}</span>
      </span>

      <div className="flex items-center gap-2 flex-wrap">
        {/* WhatsApp Share Button */}
        <button
          onClick={handleWhatsAppShare}
          className="bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <MessageCircle size={15} className="fill-current" />
          <span>WhatsApp</span>
        </button>

        {/* Native Web Share */}
        {typeof navigator !== 'undefined' && navigator.share && (
          <button
            onClick={handleNativeShare}
            className="bg-brand-green-dark hover:bg-brand-green-light active:scale-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Share2 size={15} />
            <span>{language === 'mr' ? 'सोशल मीडिया' : 'Share'}</span>
          </button>
        )}

        {/* Facebook Share */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noreferrer"
          className="bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
        >
          <span>Facebook</span>
        </a>

        {/* Twitter / X Share */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blogTitle)}&url=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noreferrer"
          className="bg-slate-900 hover:bg-black text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
        >
          <span>X / Twitter</span>
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          <span>{copied ? (language === 'mr' ? 'कॉपी झाले!' : 'Copied!') : (language === 'mr' ? 'लिंक कॉपी' : 'Copy Link')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 text-left">
      
      {/* Back link */}
      <div>
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-brand-green-dark text-xs sm:text-sm font-bold transition-colors"
        >
          <ArrowLeft size={16} />
          <span>ब्लॉगकडे परत (Back to Blogs)</span>
        </Link>
      </div>

      {/* Blog Article */}
      <article className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        
        {/* Cover Image */}
        <div className="aspect-video w-full bg-slate-100 relative">
          <img 
            src={blog.image} 
            alt={t(blog.title)} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800';
            }}
          />
          <span className="absolute bottom-4 left-4 bg-brand-green-dark text-white font-bold text-xs px-3.5 py-1 rounded-full shadow-md">
            {t(blog.category)}
          </span>
        </div>

        {/* Content Panel */}
        <div className="p-6 sm:p-10 flex flex-col gap-5">
          
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-slate-400 text-xs sm:text-sm font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-brand-magenta" />
              {new Date(blog.date).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span className="text-slate-200">|</span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-brand-green-dark" />
              {blog.readTime}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight m-0">
            {t(blog.title)}
          </h1>

          {/* Intro Excerpt */}
          <p className="text-slate-500 font-bold text-sm sm:text-base border-l-4 border-brand-magenta pl-4 py-1 italic leading-relaxed bg-slate-50 p-3 rounded-r-xl">
            {t(blog.excerpt)}
          </p>

          {/* Top Share Bar */}
          {renderShareBar()}

          {/* Article Main Body */}
          <div className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line mt-4 flex flex-col gap-4">
            {t(blog.content)}
          </div>

          {/* Bottom Share Bar */}
          <div className="pt-6 border-t border-slate-100 mt-6">
            {renderShareBar()}
          </div>

        </div>

      </article>

      {/* Callout widget for products */}
      <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100/60 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h4 className="font-extrabold text-brand-green-dark text-base">
            पिकांवरील बुरशी व कीड रोगांविषयी अधिक माहिती हवी आहे?
          </h4>
          <p className="text-xs text-slate-500 mt-1 font-bold">
            आमचे कृषी तज्ज्ञ तुमच्या मदतीसाठी सदैव उपलब्ध आहेत. आजच संपर्क करा!
          </p>
        </div>
        <a
          href="https://wa.me/9021605160"
          target="_blank"
          rel="noreferrer"
          className="bg-brand-magenta hover:bg-brand-magenta-dark active:scale-95 text-white font-extrabold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1.5 shadow transition-all cursor-pointer whitespace-nowrap"
        >
          <MessageCircle size={16} className="fill-current" />
          <span>तज्ज्ञांशी चॅट करा (Chat Now)</span>
        </a>
      </div>

    </div>
  );
};

export default BlogDetail;
