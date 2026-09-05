import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Plus, Edit, Trash2, LayoutDashboard, PlusCircle, CheckCircle, Video, BookOpen, Users, LogOut, FileText, UserCheck, ShieldCheck, Sparkles, AlertCircle, Save, Store, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../data/products';
import { getVideos, addVideo, deleteVideo } from '../data/videos';
import { getBlogs, addBlog, deleteBlog } from '../data/blogs';
import { getReviews, addReview, deleteReview } from '../data/reviews';
import { getSiteContent, updateSiteContent, defaultSiteContent } from '../data/siteContent';
import { apiUrl } from '../config';
import SEOHead from '../components/SEOHead';

const Admin = () => {
  const { t, language } = useLanguage();
  const { user, isAdmin, login, logout } = useAuth();
  const navigate = useNavigate();

  // Authentication states (supports both context auth and direct passcode fallback)
  const [isAuthenticated, setIsAuthenticated] = useState(isAdmin);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState('content');

  // Database lists
  const [productsList, setProductsList] = useState([]);
  const [videosList, setVideosList] = useState([]);
  const [blogsList, setBlogsList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // CMS Content state
  const [siteContent, setSiteContent] = useState(defaultSiteContent);

  // Form states for Products
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    category: 'plant-growth',
    tagline_mr: '', tagline_en: '',
    shortDesc_mr: '', shortDesc_en: '',
    desc_mr: '', desc_en: '',
    basePrice: '', originalPrice: '',
    pack1_size: '250 ml', pack1_price: '',
    pack2_size: '500 ml', pack2_price: '',
    pack3_size: '1 L', pack3_price: '',
    crops_mr: '', crops_en: '',
    benefit1_mr: '', benefit1_en: '',
    benefit2_mr: '', benefit2_en: '',
    usage_mr: '', usage_en: '',
    image: '/assets/products/placeholder.svg'
  });
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states for Videos
  const [videoForm, setVideoForm] = useState({
    title_mr: '', title_en: '',
    crop_mr: '', crop_en: '',
    category_mr: 'पीक मार्गदर्शन', category_en: 'Crop Guidance',
    duration: '',
    youtubeUrl: '',
    thumbnail: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&q=80&w=400'
  });

  // Form states for Blogs
  const [blogForm, setBlogForm] = useState({
    title_mr: '', title_en: '',
    category_mr: 'पीक मार्गदर्शन', category_en: 'Crop Guidance',
    readTime: '5 min read',
    excerpt_mr: '', excerpt_en: '',
    content_mr: '', content_en: '',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=400'
  });

  // Form states for Reviews
  const [reviewForm, setReviewForm] = useState({
    name: '',
    location: '',
    crop_mr: '', crop_en: '',
    rating: '5',
    review_mr: '', review_en: ''
  });

  // Keep authenticated in sync with AuthContext
  useEffect(() => {
    if (isAdmin) {
      setIsAuthenticated(true);
    }
  }, [isAdmin]);

  // Load datasets on mount and authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = () => {
    getProducts().then(data => setProductsList(data));
    getVideos().then(data => setVideosList(data));
    getBlogs().then(data => setBlogsList(data));
    getReviews().then(data => setReviewsList(data));
    getSiteContent().then(data => setSiteContent(data));
    loadUsers();
  };

  const loadUsers = async () => {
    try {
      const res = await fetch(apiUrl('/api/auth/users'));
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
        return;
      }
    } catch (err) {
      console.warn('Backend users API offline, loading from localStorage...');
    }

    // Local fallback
    const localUsers = JSON.parse(localStorage.getItem('prachi_registered_users') || '[]');
    setUsersList(localUsers);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'admin') {
      await login('admin@prachiagro.com', 'admin123', 'admin');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError(language === 'mr' ? 'चुकीचा पासवर्ड! कृपया पुन्हा प्रयत्न करा.' : 'Incorrect passcode. Try again.');
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setPasscode('');
  };

  // CMS Content Update
  const handleSaveCMSContent = async (e) => {
    e.preventDefault();
    await updateSiteContent(siteContent);
    setSuccessMsg(language === 'mr' ? 'वेबसाईट कन्टेन्ट व नोटिसेस यशस्वीरित्या अपडेट झाल्या!' : 'CMS Content & Notices updated successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // User / Dealer Verification & Margins
  const handleVerifyDealer = async (userId, newStatus, newMargin) => {
    try {
      await fetch(apiUrl(`/api/auth/users/${userId}/verify`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isVerifiedDealer: newStatus, 
          dealerDiscountPercent: newMargin,
          status: newStatus ? 'active' : 'pending'
        })
      });
    } catch (err) {
      console.warn('Backend offline, updating local users...');
    }

    // Update locally
    const localUsers = JSON.parse(localStorage.getItem('prachi_registered_users') || '[]');
    const updated = localUsers.map(u => {
      if (u.id === userId || u._id === userId) {
        return {
          ...u,
          isVerifiedDealer: newStatus,
          dealerDiscountPercent: newMargin || u.dealerDiscountPercent,
          status: newStatus ? 'active' : 'pending'
        };
      }
      return u;
    });
    localStorage.setItem('prachi_registered_users', JSON.stringify(updated));
    setUsersList(updated);
    setSuccessMsg(language === 'mr' ? 'डीलर स्थिती व मार्जिन अपडेट केले गेले!' : 'Dealer verification status and margin updated!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Product CRUD
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    const packSizes = [];
    if (productForm.pack1_size && productForm.pack1_price) {
      packSizes.push({ size: productForm.pack1_size, price: Number(productForm.pack1_price) });
    }
    if (productForm.pack2_size && productForm.pack2_price) {
      packSizes.push({ size: productForm.pack2_size, price: Number(productForm.pack2_price) });
    }
    if (productForm.pack3_size && productForm.pack3_price) {
      packSizes.push({ size: productForm.pack3_size, price: Number(productForm.pack3_price) });
    }

    const formattedProduct = {
      name: productForm.name,
      category: productForm.category,
      tagline: { mr: productForm.tagline_mr, en: productForm.tagline_en },
      shortDescription: { mr: productForm.shortDesc_mr, en: productForm.shortDesc_en },
      description: { mr: productForm.desc_mr, en: productForm.desc_en },
      basePrice: Number(productForm.basePrice),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : null,
      packSizes: packSizes.length > 0 ? packSizes : [{ size: "250 ml", price: Number(productForm.basePrice) }],
      image: productForm.image,
      rating: 4.8,
      reviewsCount: 12,
      crops: { mr: productForm.crops_mr, en: productForm.crops_en },
      benefits: {
        mr: [productForm.benefit1_mr, productForm.benefit2_mr].filter(Boolean),
        en: [productForm.benefit1_en, productForm.benefit2_en].filter(Boolean)
      },
      usage: { mr: productForm.usage_mr, en: productForm.usage_en }
    };

    if (isEditingProduct) {
      await updateProduct(productForm.id, formattedProduct);
      setSuccessMsg(language === 'mr' ? 'उत्पादन यशस्वीरित्या सुधारित केले!' : 'Product updated successfully!');
    } else {
      await addProduct(formattedProduct);
      setSuccessMsg(language === 'mr' ? 'नवीन उत्पादन यशस्वीरित्या जोडले!' : 'Product added successfully!');
    }

    resetProductForm();
    loadAllData();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleEditProduct = (prod) => {
    setIsEditingProduct(true);
    setProductForm({
      id: prod.id,
      name: prod.name,
      category: prod.category,
      tagline_mr: prod.tagline.mr, tagline_en: prod.tagline.en,
      shortDesc_mr: prod.shortDescription.mr, shortDesc_en: prod.shortDescription.en,
      desc_mr: prod.description.mr, desc_en: prod.description.en,
      basePrice: prod.basePrice,
      originalPrice: prod.originalPrice || '',
      pack1_size: prod.packSizes[0]?.size || '250 ml', pack1_price: prod.packSizes[0]?.price || '',
      pack2_size: prod.packSizes[1]?.size || '500 ml', pack2_price: prod.packSizes[1]?.price || '',
      pack3_size: prod.packSizes[2]?.size || '1 L', pack3_price: prod.packSizes[2]?.price || '',
      crops_mr: prod.crops.mr, crops_en: prod.crops.en,
      benefit1_mr: prod.benefits.mr[0] || '', benefit1_en: prod.benefits.en[0] || '',
      benefit2_mr: prod.benefits.mr[1] || '', benefit2_en: prod.benefits.en[1] || '',
      usage_mr: prod.usage.mr, usage_en: prod.usage.en,
      image: prod.image
    });
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm(language === 'mr' ? 'हे उत्पादन हटवायचे आहे का?' : 'Delete this product?')) {
      await deleteProduct(id);
      loadAllData();
    }
  };

  const resetProductForm = () => {
    setIsEditingProduct(false);
    setProductForm({
      id: '', name: '', category: 'plant-growth',
      tagline_mr: '', tagline_en: '',
      shortDesc_mr: '', shortDesc_en: '',
      desc_mr: '', desc_en: '',
      basePrice: '', originalPrice: '',
      pack1_size: '250 ml', pack1_price: '',
      pack2_size: '500 ml', pack2_price: '',
      pack3_size: '1 L', pack3_price: '',
      crops_mr: '', crops_en: '',
      benefit1_mr: '', benefit1_en: '',
      benefit2_mr: '', benefit2_en: '',
      usage_mr: '', usage_en: '',
      image: '/assets/products/placeholder.svg'
    });
  };

  // Video CRUD
  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    const newVideo = {
      title: { mr: videoForm.title_mr, en: videoForm.title_en },
      crop: { mr: videoForm.crop_mr, en: videoForm.crop_en },
      category: { mr: videoForm.category_mr, en: videoForm.category_en },
      duration: videoForm.duration || '5:00',
      youtubeUrl: videoForm.youtubeUrl,
      thumbnail: videoForm.thumbnail
    };
    await addVideo(newVideo);
    setSuccessMsg(language === 'mr' ? 'व्हिडिओ जोडला गेला!' : 'Video added successfully!');
    setVideoForm({
      title_mr: '', title_en: '',
      crop_mr: '', crop_en: '',
      category_mr: 'पीक मार्गदर्शन', category_en: 'Crop Guidance',
      duration: '',
      youtubeUrl: '',
      thumbnail: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&q=80&w=400'
    });
    loadAllData();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteVideo = async (id) => {
    if (window.confirm(language === 'mr' ? 'व्हिडिओ हटवायचा आहे का?' : 'Delete this video?')) {
      await deleteVideo(id);
      loadAllData();
    }
  };

  // Blog CRUD
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    const newBlog = {
      title: { mr: blogForm.title_mr, en: blogForm.title_en },
      category: { mr: blogForm.category_mr, en: blogForm.category_en },
      readTime: blogForm.readTime,
      excerpt: { mr: blogForm.excerpt_mr, en: blogForm.excerpt_en },
      content: { mr: blogForm.content_mr, en: blogForm.content_en },
      image: blogForm.image,
      date: new Date().toLocaleDateString('mr-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    await addBlog(newBlog);
    setSuccessMsg(language === 'mr' ? 'ब्लॉग जोडला गेला!' : 'Blog post added successfully!');
    setBlogForm({
      title_mr: '', title_en: '',
      category_mr: 'पीक मार्गदर्शन', category_en: 'Crop Guidance',
      readTime: '5 min read',
      excerpt_mr: '', excerpt_en: '',
      content_mr: '', content_en: '',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=400'
    });
    loadAllData();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm(language === 'mr' ? 'ब्लॉग हटवायचा आहे का?' : 'Delete this blog?')) {
      await deleteBlog(id);
      loadAllData();
    }
  };

  // Review CRUD
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const newReview = {
      name: reviewForm.name,
      location: reviewForm.location,
      crop: { mr: reviewForm.crop_mr, en: reviewForm.crop_en },
      rating: Number(reviewForm.rating),
      review: { mr: reviewForm.review_mr, en: reviewForm.review_en }
    };
    await addReview(newReview);
    setSuccessMsg(language === 'mr' ? 'अभिप्राय जोडला गेला!' : 'Review added successfully!');
    setReviewForm({
      name: '', location: '',
      crop_mr: '', crop_en: '',
      rating: '5',
      review_mr: '', review_en: ''
    });
    loadAllData();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm(language === 'mr' ? 'अभिप्राय हटवायचा आहे का?' : 'Delete this review?')) {
      await deleteReview(id);
      loadAllData();
    }
  };

  // Passcode Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-4">
        <SEOHead title="Admin Login - Prachi Agro" />
        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-lg max-w-md w-full text-center flex flex-col gap-6">
          <div className="w-16 h-16 rounded-full bg-brand-green-dark/10 text-brand-green-dark flex items-center justify-center mx-auto shadow-inner">
            <Lock size={28} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Admin Gate</h1>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
              प्राची अॅग्रो एडमिन पोर्टल
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg text-left">
            <p className="text-[10px] sm:text-xs text-amber-700 font-bold">
              🔑 Demonstration Passcode: <span className="underline font-black text-sm">admin123</span>
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="पासकोड प्रविष्ट करा (e.g. admin123)..."
              className="w-full text-center border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50"
            />
            <button
              type="submit"
              className="w-full bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold py-3 rounded-xl cursor-pointer shadow transition-all active:scale-[0.98]"
            >
              लॉगिन (Log In)
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left">
      <SEOHead title="Admin Dashboard - Prachi Agro Industries" />
      
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-green-dark flex items-center justify-center">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-brand-green-dark tracking-tight m-0">
              Admin Portal
            </h1>
            <p className="text-xs text-slate-400 font-bold leading-none mt-1 uppercase">Website CMS & User Management</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-slate-50 hover:bg-slate-100 hover:text-brand-magenta text-slate-600 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <LogOut size={14} />
          <span>लॉगआउट (Log Out)</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-brand-green-dark text-sm font-bold rounded-xl flex items-center gap-2 animate-pulse">
          <CheckCircle size={18} className="text-brand-green-bright" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs list */}
      <div className="flex gap-2 border-b border-slate-100 overflow-x-auto pb-1 no-scrollbar">
        
        {/* Tab: CMS & Visibility */}
        <button
          onClick={() => setActiveTab('content')}
          className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'content' ? 'bg-brand-green-dark text-white' : 'bg-white border border-slate-200/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Sparkles size={14} />
          <span>कन्टेन्ट व नोटिसेस (Content CMS)</span>
        </button>

        {/* Tab: Users & Dealers */}
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'users' ? 'bg-brand-green-dark text-white' : 'bg-white border border-slate-200/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <UserCheck size={14} />
          <span>युझर्स व डीलर मंजुरी (Users: {usersList.length})</span>
        </button>

        {/* Tab: Products */}
        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'products' ? 'bg-brand-green-dark text-white' : 'bg-white border border-slate-200/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <PlusCircle size={14} />
          <span>उत्पादने (Products: {productsList.length})</span>
        </button>



        {/* Tab: Blogs */}
        <button
          onClick={() => setActiveTab('blogs')}
          className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'blogs' ? 'bg-brand-green-dark text-white' : 'bg-white border border-slate-200/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BookOpen size={14} />
          <span>ब्लॉग (Blogs: {blogsList.length})</span>
        </button>

        {/* Tab: Reviews */}
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'reviews' ? 'bg-brand-green-dark text-white' : 'bg-white border border-slate-200/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users size={14} />
          <span>अभिप्राय (Reviews: {reviewsList.length})</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 1. Tab Contents: CONTENT CMS (Public vs Logged-In Visibility) */}
      {/* ============================================================ */}
      {activeTab === 'content' && (
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col gap-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Sparkles className="text-brand-magenta" size={20} />
              <span>वेबसाईट कन्टेन्ट व नोटिसेस मॅनेजमेंट (What Users See)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              लॉगिन करण्यापूर्वी आणि लॉगिन केल्यानंतर ग्राहकांना, शेतकऱ्यांना व डीलर्सना दिसणारे मेसेज येथे संपादित करा.
            </p>
          </div>

          <form onSubmit={handleSaveCMSContent} className="flex flex-col gap-6">
            
            {/* Section A: Public Announcement (Before Login) */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-brand-green-dark uppercase tracking-wide flex items-center gap-1.5">
                  <span>🌾</span>
                  <span>१. पब्लिक अनाउन्समेंट बार (सर्व व्हिजिटर्ससाठी - Before Login)</span>
                </span>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={siteContent.publicAnnouncement?.isActive}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      publicAnnouncement: { ...siteContent.publicAnnouncement, isActive: e.target.checked }
                    })}
                  />
                  <span>सक्रिय (Active)</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">मजकूर (मराठी)</label>
                  <input
                    type="text"
                    value={siteContent.publicAnnouncement?.mr || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      publicAnnouncement: { ...siteContent.publicAnnouncement, mr: e.target.value }
                    })}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-brand-green-dark"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">Text (English)</label>
                  <input
                    type="text"
                    value={siteContent.publicAnnouncement?.en || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      publicAnnouncement: { ...siteContent.publicAnnouncement, en: e.target.value }
                    })}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-brand-green-dark"
                  />
                </div>
              </div>
            </div>

            {/* Section B: Farmer Notice (After Login) */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Tag size={16} className="text-amber-600" />
                  <span>२. शेतकरी विशेष नोटीस (केवळ लॉगिन केलेल्या शेतकऱ्यांना - Farmer Member Notice)</span>
                </span>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={siteContent.farmerNotice?.isActive}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      farmerNotice: { ...siteContent.farmerNotice, isActive: e.target.checked }
                    })}
                  />
                  <span>सक्रिय (Active)</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">मजकूर (मराठी)</label>
                  <input
                    type="text"
                    value={siteContent.farmerNotice?.mr || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      farmerNotice: { ...siteContent.farmerNotice, mr: e.target.value }
                    })}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">Text (English)</label>
                  <input
                    type="text"
                    value={siteContent.farmerNotice?.en || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      farmerNotice: { ...siteContent.farmerNotice, en: e.target.value }
                    })}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Section C: Dealer Notice (After Login) */}
            <div className="bg-pink-50/50 border border-pink-200 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-brand-magenta uppercase tracking-wide flex items-center gap-1.5">
                  <Store size={16} />
                  <span>३. अधिकृत डीलर बुलेटिन (केवळ लॉगिन केलेल्या डीलर्सना - Dealer B2B Notice)</span>
                </span>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={siteContent.dealerNotice?.isActive}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      dealerNotice: { ...siteContent.dealerNotice, isActive: e.target.checked }
                    })}
                  />
                  <span>सक्रिय (Active)</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">मजकूर (मराठी)</label>
                  <input
                    type="text"
                    value={siteContent.dealerNotice?.mr || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      dealerNotice: { ...siteContent.dealerNotice, mr: e.target.value }
                    })}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">Text (English)</label>
                  <input
                    type="text"
                    value={siteContent.dealerNotice?.en || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      dealerNotice: { ...siteContent.dealerNotice, en: e.target.value }
                    })}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all self-start"
            >
              <Save size={16} />
              <span>कन्टेन्ट सेव्ह करा (Save CMS Settings)</span>
            </button>

          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. Tab Contents: USERS & DEALER APPROVALS                     */}
      {/* ============================================================ */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col gap-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <UserCheck className="text-brand-green-dark" size={20} />
              <span>नोंदणीकृत युझर्स व डीलर मंजुरी (Users & Dealers Directory)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              येथून आपण नवीन डीलर खाती अप्रूव्ह करू शकता आणि त्यांचा होलसेल डिस्काउंट मार्जिन सेट करू शकता.
            </p>
          </div>

          {usersList.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <Users size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-500">अद्याप नवीन युझर्स नोंदणीकृत नाहीत.</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3">नाव / केंद्र (Name / Shop)</th>
                    <th className="p-3">भूमिका (Role)</th>
                    <th className="p-3">संपर्क (Contact)</th>
                    <th className="p-3">गाव / जिल्हा</th>
                    <th className="p-3 text-center">स्थिती (Status)</th>
                    <th className="p-3 text-center">होलसेल मार्जिन (%)</th>
                    <th className="p-3 text-right">कृती (Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {usersList.map((usr) => (
                    <tr key={usr.id || usr._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-800">
                        <div>{usr.name}</div>
                        {usr.businessName && (
                          <div className="text-[11px] text-brand-magenta font-extrabold">{usr.businessName}</div>
                        )}
                        {usr.gstNumber && (
                          <div className="text-[10px] text-slate-400">GST: {usr.gstNumber}</div>
                        )}
                      </td>

                      <td className="p-3">
                        {usr.role === 'dealer' ? (
                          <span className="bg-pink-100 text-brand-magenta font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase">
                            🏪 Dealer
                          </span>
                        ) : usr.role === 'admin' ? (
                          <span className="bg-slate-900 text-brand-gold font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase">
                            👑 Admin
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-brand-green-dark font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase">
                            🌾 Farmer
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-slate-600">
                        <div>{usr.phone}</div>
                        <div className="text-[10px] text-slate-400">{usr.email}</div>
                      </td>

                      <td className="p-3 text-slate-600">
                        {usr.city}, {usr.district}
                      </td>

                      <td className="p-3 text-center">
                        {usr.role === 'dealer' ? (
                          usr.isVerifiedDealer ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                              ✓ Approved
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                              ⏳ Pending
                            </span>
                          )
                        ) : (
                          <span className="text-emerald-600 font-bold">Active</span>
                        )}
                      </td>

                      <td className="p-3 text-center">
                        {usr.role === 'dealer' ? (
                          <span className="font-extrabold text-brand-magenta text-sm">
                            {usr.dealerDiscountPercent || 25}%
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        {usr.role === 'dealer' && (
                          <div className="flex items-center justify-end gap-1.5">
                            {usr.isVerifiedDealer ? (
                              <button
                                onClick={() => handleVerifyDealer(usr.id || usr._id, false, usr.dealerDiscountPercent)}
                                className="bg-amber-50 hover:bg-amber-100 text-amber-800 px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer"
                              >
                                Revoke
                              </button>
                            ) : (
                              <button
                                onClick={() => handleVerifyDealer(usr.id || usr._id, true, 25)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-[11px] font-bold cursor-pointer shadow-sm"
                              >
                                ✓ Approve Dealer
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. Tab Contents: PRODUCTS                                     */}
      {/* ============================================================ */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Add / Edit Form */}
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-5">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3">
              {isEditingProduct ? 'उत्पादन सुधारित करा (Edit Product)' : 'नवीन उत्पादन जोडा (Add Product)'}
            </h2>

            <form onSubmit={handleProductSubmit} className="flex flex-col gap-4">
              
              {/* Product Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Product Name (उत्पादनाचे नाव)</label>
                <input 
                  type="text" 
                  required 
                  value={productForm.name} 
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="उदा. MAGIC GOLD"
                  className="border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-brand-green-dark"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Category (श्रेणी)</label>
                <select 
                  value={productForm.category} 
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-brand-green-dark bg-white"
                >
                  <option value="plant-growth">कृषी टॉनिक व वाढ संजीवक (Plant Tonics)</option>
                  <option value="fertilizers">दाणेदार खते व माती सुधारक (Fertilizers)</option>
                  <option value="fungicides">बुरशीनाशके (Fungicides)</option>
                  <option value="micronutrients">सूक्ष्म अन्नद्रव्ये (Micronutrients)</option>
                  <option value="silicon-based">सिलिकॉन उत्पादने (Silicon)</option>
                  <option value="bio-products">जैविक उत्पादने (Bio)</option>
                  <option value="insecticides">कीटकनाशके (Insecticides)</option>
                  <option value="other">इतर (Other)</option>
                </select>
              </div>

              {/* Taglines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Tagline (Marathi)</label>
                  <input 
                    type="text" 
                    required 
                    value={productForm.tagline_mr} 
                    onChange={(e) => setProductForm({ ...productForm, tagline_mr: e.target.value })}
                    placeholder="उदा. विशेष पीक टॉनिक"
                    className="border border-slate-200 rounded p-2 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Tagline (English)</label>
                  <input 
                    type="text" 
                    required 
                    value={productForm.tagline_en} 
                    onChange={(e) => setProductForm({ ...productForm, tagline_en: e.target.value })}
                    placeholder="e.g. Plant Growth Promoter"
                    className="border border-slate-200 rounded p-2 text-xs"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Base Price ₹</label>
                  <input 
                    type="number" 
                    required 
                    value={productForm.basePrice} 
                    onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
                    placeholder="750"
                    className="border border-slate-200 rounded p-2 text-xs font-bold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Original Price ₹ (MRP)</label>
                  <input 
                    type="number" 
                    value={productForm.originalPrice} 
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    placeholder="900"
                    className="border border-slate-200 rounded p-2 text-xs"
                  />
                </div>
              </div>

              {/* Pack Sizes */}
              <div className="flex flex-col gap-1.5 bg-slate-50 p-2.5 rounded border border-slate-100">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Pack Sizes & Prices (पॅक आकार व किंमत)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" value={productForm.pack1_size} onChange={(e) => setProductForm({...productForm, pack1_size: e.target.value})} className="border p-1.5 rounded text-xs" placeholder="250 ml" />
                  <input type="number" value={productForm.pack1_price} onChange={(e) => setProductForm({...productForm, pack1_price: e.target.value})} className="border p-1.5 rounded text-xs col-span-2" placeholder="Price ₹" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" value={productForm.pack2_size} onChange={(e) => setProductForm({...productForm, pack2_size: e.target.value})} className="border p-1.5 rounded text-xs" placeholder="500 ml" />
                  <input type="number" value={productForm.pack2_price} onChange={(e) => setProductForm({...productForm, pack2_price: e.target.value})} className="border p-1.5 rounded text-xs col-span-2" placeholder="Price ₹" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" value={productForm.pack3_size} onChange={(e) => setProductForm({...productForm, pack3_size: e.target.value})} className="border p-1.5 rounded text-xs" placeholder="1 L" />
                  <input type="number" value={productForm.pack3_price} onChange={(e) => setProductForm({...productForm, pack3_price: e.target.value})} className="border p-1.5 rounded text-xs col-span-2" placeholder="Price ₹" />
                </div>
              </div>

              {/* Crops */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Crops (Marathi)</label>
                  <input type="text" required value={productForm.crops_mr} onChange={(e) => setProductForm({ ...productForm, crops_mr: e.target.value })} placeholder="कापूस, सोयाबीन, कांदा" className="border border-slate-200 rounded p-2 text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Crops (English)</label>
                  <input type="text" required value={productForm.crops_en} onChange={(e) => setProductForm({ ...productForm, crops_en: e.target.value })} placeholder="Cotton, Soybean, Onion" className="border border-slate-200 rounded p-2 text-xs" />
                </div>
              </div>

              {/* Benefits */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Benefits (Marathi)</label>
                <input type="text" value={productForm.benefit1_mr} onChange={(e) => setProductForm({ ...productForm, benefit1_mr: e.target.value })} placeholder="फायदा १: कळ्या आणि फुलांची वाढ" className="border border-slate-200 rounded p-2 text-xs mb-1" />
                <input type="text" value={productForm.benefit2_mr} onChange={(e) => setProductForm({ ...productForm, benefit2_mr: e.target.value })} placeholder="फायदा २: पांढऱ्या मुळांचा विकास" className="border border-slate-200 rounded p-2 text-xs" />
              </div>

              {/* Product Photo Upload & Live Preview */}
              <div className="flex flex-col gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <label className="text-[11px] font-black text-brand-green-dark uppercase tracking-wide flex items-center gap-1.5">
                  <span>🖼️</span>
                  <span>उत्पादनाचा फोटो (Product Photo)</span>
                </label>

                {/* Option 1: File Upload */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500">
                    १. संगणक किंवा मोबाईलवरून फोटो निवडा (Choose File):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-brand-green-dark file:text-white hover:file:bg-brand-green-light cursor-pointer border border-slate-200 rounded-lg bg-white p-1"
                  />
                </div>

                <div className="relative flex py-0.5 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-2 text-[10px] text-slate-400 font-bold uppercase">किंवा (OR)</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Option 2: Image URL Path */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500">
                    २. फोटोची वेब URL किंवा पाथ (Image Path / URL):
                  </label>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="/assets/products/magic_gold_500.png"
                    className="border border-slate-200 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-brand-green-dark"
                  />
                </div>

                {/* Live Image Preview */}
                {productForm.image && (
                  <div className="flex items-center gap-3 mt-1 p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <div className="w-14 h-14 rounded-lg bg-slate-50 p-1 flex items-center justify-center border border-slate-200 flex-shrink-0 overflow-hidden">
                      <img
                        src={productForm.image}
                        alt="Product Preview"
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => { e.target.src = '/assets/logo.png'; }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-black text-brand-green-dark uppercase">फोटो प्रिव्ह्यू (Live Preview)</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[210px]">{productForm.image}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex gap-2 mt-2">
                <button type="submit" className="flex-1 bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold text-xs py-2.5 rounded-lg cursor-pointer transition-colors shadow">
                  {isEditingProduct ? 'सुधारणा सेव्ह करा (Update)' : 'उत्पादन जोडा (Save Product)'}
                </button>
                {isEditingProduct && (
                  <button type="button" onClick={resetProductForm} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs px-3 rounded-lg font-bold cursor-pointer">
                    रद्द (Cancel)
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* Products Directory */}
          <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3">
              विद्यमान उत्पादने (Existing Products: {productsList.length})
            </h2>

            <div className="flex flex-col gap-3">
              {productsList.map((prod) => (
                <div key={prod.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl p-1 flex items-center justify-center flex-shrink-0">
                      <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-slate-800 text-xs sm:text-sm truncate">{prod.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{prod.category}</p>
                      <p className="text-xs font-black text-brand-green-dark mt-0.5">₹{prod.basePrice}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleEditProduct(prod)}
                      className="p-2 text-slate-400 hover:text-brand-green-dark hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-2 text-slate-400 hover:text-brand-magenta hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}



      {/* ============================================================ */}
      {/* 5. Tab Contents: BLOGS                                        */}
      {/* ============================================================ */}
      {activeTab === 'blogs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3">नवीन ब्लॉग जोडा (Add Blog Post)</h2>
            <form onSubmit={handleBlogSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Blog Title (Marathi)</label>
                <input type="text" required value={blogForm.title_mr} onChange={(e) => setBlogForm({...blogForm, title_mr: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Blog Title (English)</label>
                <input type="text" required value={blogForm.title_en} onChange={(e) => setBlogForm({...blogForm, title_en: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Excerpt (Marathi)</label>
                <textarea rows="2" required value={blogForm.excerpt_mr} onChange={(e) => setBlogForm({...blogForm, excerpt_mr: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Full Content (Marathi)</label>
                <textarea rows="4" required value={blogForm.content_mr} onChange={(e) => setBlogForm({...blogForm, content_mr: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" />
              </div>
              <button type="submit" className="bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold text-xs py-2.5 rounded-lg cursor-pointer">ब्लॉग सेव्ह करा (Save Blog)</button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3">ब्लॉग यादी (Blogs Directory)</h2>
            <div className="flex flex-col gap-3">
              {blogsList.map((b) => (
                <div key={b.id} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="min-w-0 pr-4">
                    <h4 className="font-bold text-slate-800 text-xs truncate">{b.title[language]}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{b.date} • {b.category[language]}</p>
                  </div>
                  <button onClick={() => handleDeleteBlog(b.id)} className="p-2 text-slate-300 hover:text-brand-magenta hover:bg-red-50 rounded-lg cursor-pointer flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. Tab Contents: REVIEWS                                      */}
      {/* ============================================================ */}
      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3">शेतकरी अभिप्राय जोडा (Add Farmer Review)</h2>
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Farmer Name</label>
                  <input type="text" required value={reviewForm.name} onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Location</label>
                  <input type="text" required value={reviewForm.location} onChange={(e) => setReviewForm({...reviewForm, location: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Review (Marathi)</label>
                <textarea rows="3" required value={reviewForm.review_mr} onChange={(e) => setReviewForm({...reviewForm, review_mr: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" />
              </div>
              <button type="submit" className="bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold text-xs py-2.5 rounded-lg cursor-pointer">अभिप्राय जोडा (Save Review)</button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3">अभिप्राय सूची (Reviews Directory)</h2>
            <div className="flex flex-col gap-3">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="min-w-0 pr-4">
                    <h4 className="font-bold text-slate-800 text-xs">{rev.name} ({rev.location})</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">पिक: {rev.crop[language]} • रेटिंग: {rev.rating}★</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 font-medium">"{rev.review[language]}"</p>
                  </div>
                  <button onClick={() => handleDeleteReview(rev.id)} className="p-2 text-slate-300 hover:text-brand-magenta hover:bg-red-50 rounded-lg cursor-pointer flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
