import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getBlogs } from '../data/blogs';
import BlogCard from '../components/BlogCard';

const Blog = () => {
  const [blogsList, setBlogsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    let isMounted = true;
    getBlogs()
      .then(data => {
        if (isMounted) {
          setBlogsList(Array.isArray(data) ? data : []);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="flex flex-col gap-8 text-left">
      
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-black text-brand-green-dark tracking-tight m-0">
          {language === 'mr' ? 'शेती मार्गदर्शन ब्लॉग' : 'Farming Guidance Blogs'}
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1.5 font-semibold">
          {language === 'mr' ? 'पिकांच्या कीड नियंत्रणापासून ते खत नियोजनापर्यंत सर्व माहिती' : 'Expert articles covering crop growth, soil conditions, and organic pest protection'}
        </p>
      </div>

      {/* Blogs Content */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center">
          <div className="w-8 h-8 border-4 border-brand-green-dark border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-xs font-bold">{language === 'mr' ? 'ब्लॉग लोड होत आहेत...' : 'Loading blogs...'}</p>
        </div>
      ) : blogsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogsList.map((blog) => (
            <BlogCard key={blog.id || blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center">
          <p className="text-slate-500 font-bold text-base m-0">
            {language === 'mr' ? 'नवीन ब्लॉग लवकरच उपलब्ध होतील.' : 'No blog posts available.'}
          </p>
          <p className="text-slate-400 text-xs mt-1">
            {language === 'mr' ? 'कृपया नंतर पुन्हा तपासा.' : 'Please check back later for new articles.'}
          </p>
        </div>
      )}

    </div>
  );
};

export default Blog;
