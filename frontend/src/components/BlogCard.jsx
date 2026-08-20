import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const BlogCard = ({ blog }) => {
  const { t, language } = useLanguage();

  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group text-left">
      
      {/* Blog Thumbnail */}
      <Link to={`/blog/${blog.id}`} className="block relative aspect-video bg-slate-100 overflow-hidden">
        <img 
          src={blog.image} 
          alt={t(blog.title)} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback Unsplash agricultural background
            e.target.src = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=400';
          }}
        />
        {/* Category Badge overlay */}
        <span className="absolute top-3 left-3 bg-brand-green-dark text-white font-bold text-[10px] px-2.5 py-0.5 rounded shadow-sm">
          {t(blog.category)}
        </span>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Date & Read time */}
        <div className="flex items-center gap-4 text-slate-400 text-xs mb-3 font-medium">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(blog.date).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {blog.readTime}
          </span>
        </div>

        {/* Title */}
        <Link to={`/blog/${blog.id}`} className="hover:text-brand-green-dark transition-colors">
          <h3 className="font-extrabold text-slate-800 text-base md:text-lg tracking-tight leading-snug line-clamp-2">
            {t(blog.title)}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed flex-grow">
          {t(blog.excerpt)}
        </p>

        {/* Read More Link */}
        <div className="mt-4 pt-4 border-t border-slate-50">
          <Link 
            to={`/blog/${blog.id}`}
            className="text-brand-green-dark hover:text-brand-green-light font-extrabold text-xs flex items-center gap-1 group-hover:gap-2 transition-all"
          >
            <span>{t('readMore')}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>

    </div>
  );
};

export default BlogCard;
