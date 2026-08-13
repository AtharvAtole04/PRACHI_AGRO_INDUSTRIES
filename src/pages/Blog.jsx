import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getBlogs } from '../data/blogs';
import BlogCard from '../components/BlogCard';

const Blog = () => {
  const [blogsList, setBlogsList] = useState([]);
  useEffect(() => {
    getBlogs().then(data => setBlogsList(data));
  }, []);
  const { language } = useLanguage();

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

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogsList.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

    </div>
  );
};

export default Blog;
