import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Plus, Edit, Trash2, LayoutDashboard, PlusCircle, CheckCircle, Video, BookOpen, Users, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../data/products';
import { getVideos, addVideo, deleteVideo } from '../data/videos';
import { getBlogs, addBlog, deleteBlog } from '../data/blogs';
import { getReviews, addReview, deleteReview } from '../data/reviews';

const Admin = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState('products');

  // Database lists
  const [productsList, setProductsList] = useState([]);
  const [videosList, setVideosList] = useState([]);
  const [blogsList, setBlogsList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);

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
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError(language === 'mr' ? 'चुकीचा पासवर्ड! कृपया पुन्हा प्रयत्न करा.' : 'Incorrect passcode. Try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
  };

  // Product CRUD
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    // Structure packSizes
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
      setSuccessMsg(language === 'mr' ? 'उत्पादन यशस्वीरित्या सुधारित केले गेले!' : 'Product updated successfully!');
    } else {
      await addProduct(formattedProduct);
      setSuccessMsg(language === 'mr' ? 'नवीन उत्पादन यशस्वीरित्या जोडले गेले!' : 'New product added successfully!');
    }

    // Reset forms & reload
    resetProductForm();
    loadAllData();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const startEditProduct = (prod) => {
    setProductForm({
      id: prod.id,
      name: prod.name,
      category: prod.category,
      tagline_mr: prod.tagline.mr || '',
      tagline_en: prod.tagline.en || '',
      shortDesc_mr: prod.shortDescription.mr || '',
      shortDesc_en: prod.shortDescription.en || '',
      desc_mr: prod.description.mr || '',
      desc_en: prod.description.en || '',
      basePrice: prod.basePrice,
      originalPrice: prod.originalPrice || '',
      pack1_size: prod.packSizes[0]?.size || '250 ml',
      pack1_price: prod.packSizes[0]?.price || '',
      pack2_size: prod.packSizes[1]?.size || '500 ml',
      pack2_price: prod.packSizes[1]?.price || '',
      pack3_size: prod.packSizes[2]?.size || '1 L',
      pack3_price: prod.packSizes[2]?.price || '',
      crops_mr: prod.crops?.mr || '',
      crops_en: prod.crops?.en || '',
      benefit1_mr: prod.benefits?.mr[0] || '',
      benefit1_en: prod.benefits?.en[0] || '',
      benefit2_mr: prod.benefits?.mr[1] || '',
      benefit2_en: prod.benefits?.en[1] || '',
      usage_mr: prod.usage?.mr || '',
      usage_en: prod.usage?.en || '',
      image: prod.image || '/assets/products/placeholder.svg'
    });
    setIsEditingProduct(true);
    window.scrollTo(0, 300);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm(language === 'mr' ? 'हे उत्पादन हटवायचे आहे का?' : 'Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      loadAllData();
    }
  };

  const resetProductForm = () => {
    setProductForm({
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
    setIsEditingProduct(false);
  };

  // Video CRUD
  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    
    const newVideo = {
      title: { mr: videoForm.title_mr, en: videoForm.title_en },
      crop: { mr: videoForm.crop_mr, en: videoForm.crop_en },
      category: { mr: videoForm.category_mr, en: videoForm.category_en },
      duration: videoForm.duration,
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
      image: blogForm.image
    };
    await addBlog(newBlog);
    setSuccessMsg(language === 'mr' ? 'ब्लॉग प्रसिद्ध केला गेला!' : 'Blog published successfully!');
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

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-4">
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
              placeholder="पासकोड प्रविष्ट करा..."
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
            <p className="text-xs text-slate-400 font-bold leading-none mt-1 uppercase">Website Database Management</p>
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
        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'products' ? 'bg-brand-green-dark text-white' : 'bg-white border border-slate-200/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <PlusCircle size={14} />
          <span>उत्पादने (Products: {productsList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'videos' ? 'bg-brand-green-dark text-white' : 'bg-white border border-slate-200/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Video size={14} />
          <span>व्हिडिओ (Videos: {videosList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('blogs')}
          className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'blogs' ? 'bg-brand-green-dark text-white' : 'bg-white border border-slate-200/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BookOpen size={14} />
          <span>ब्लॉग (Blogs: {blogsList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'reviews' ? 'bg-brand-green-dark text-white' : 'bg-white border border-slate-200/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users size={14} />
          <span>अभिप्राय (Reviews: {reviewsList.length})</span>
        </button>
      </div>

      {/* Tab Contents: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Add / Edit Form */}
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-5">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3">
              {isEditingProduct ? 'उत्पादन सुधारित करा (Edit Product)' : 'नवीन उत्पादन जोडा (Add Product)'}
            </h2>
            <form onSubmit={handleProductSubmit} className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Product Name (English)</label>
                <input 
                  type="text" required value={productForm.name} 
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})} 
                  placeholder="e.g. BACTRIKILLER" 
                  className="border border-slate-200 rounded px-2.5 py-1.5 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                <select 
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  className="border border-slate-200 rounded px-2.5 py-1.5 text-sm"
                >
                  <option value="insecticides">कीटकनाशके (Insecticides)</option>
                  <option value="fungicides">बुरशीनाशके (Fungicides)</option>
                  <option value="plant-growth">वनस्पती वाढ प्रवर्तक (Plant Growth)</option>
                  <option value="micronutrients">मायक्रोन्युट्रिएंट्स (Micronutrients)</option>
                  <option value="silicon-based">सिलिकॉन उत्पादने (Silicon)</option>
                  <option value="bio-products">जैविक उत्पादने (Bio Products)</option>
                  <option value="fertilizers">खत / पोषण (Fertilizers)</option>
                  <option value="other">इतर (Other)</option>
                </select>
              </div>

              {/* Taglines */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Tagline (Marathi)</label>
                  <input type="text" value={productForm.tagline_mr} onChange={(e) => setProductForm({...productForm, tagline_mr: e.target.value})} placeholder="उदा. प्रणालीगत बुरशीनाशक" className="border border-slate-200 rounded px-2 py-1 text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Tagline (English)</label>
                  <input type="text" value={productForm.tagline_en} onChange={(e) => setProductForm({...productForm, tagline_en: e.target.value})} placeholder="e.g. SYSTEMIC FUNGICIDE" className="border border-slate-200 rounded px-2 py-1 text-xs" />
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Offer Price (Base ₹)</label>
                  <input type="number" required value={productForm.basePrice} onChange={(e) => setProductForm({...productForm, basePrice: e.target.value})} placeholder="e.g. 450" className="border border-slate-200 rounded px-2 py-1 text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Original Price (Base ₹)</label>
                  <input type="number" value={productForm.originalPrice} onChange={(e) => setProductForm({...productForm, originalPrice: e.target.value})} placeholder="e.g. 550" className="border border-slate-200 rounded px-2 py-1 text-xs" />
                </div>
              </div>

              {/* Pack Sizes */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Pack Sizes &amp; Prices</label>
                <div className="flex flex-col gap-2 bg-slate-50 p-2 rounded">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={productForm.pack1_size} onChange={(e) => setProductForm({...productForm, pack1_size: e.target.value})} className="border border-slate-200 bg-white rounded p-1 text-xs text-center" />
                    <input type="number" placeholder="किंमत (₹)" value={productForm.pack1_price} onChange={(e) => setProductForm({...productForm, pack1_price: e.target.value})} className="border border-slate-200 bg-white rounded p-1 text-xs text-center" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={productForm.pack2_size} onChange={(e) => setProductForm({...productForm, pack2_size: e.target.value})} className="border border-slate-200 bg-white rounded p-1 text-xs text-center" />
                    <input type="number" placeholder="किंमत (₹)" value={productForm.pack2_price} onChange={(e) => setProductForm({...productForm, pack2_price: e.target.value})} className="border border-slate-200 bg-white rounded p-1 text-xs text-center" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={productForm.pack3_size} onChange={(e) => setProductForm({...productForm, pack3_size: e.target.value})} className="border border-slate-200 bg-white rounded p-1 text-xs text-center" />
                    <input type="number" placeholder="किंमत (₹)" value={productForm.pack3_price} onChange={(e) => setProductForm({...productForm, pack3_price: e.target.value})} className="border border-slate-200 bg-white rounded p-1 text-xs text-center" />
                  </div>
                </div>
              </div>

              {/* Short Descriptions */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Short Description (Marathi)</label>
                <textarea rows="2" value={productForm.shortDesc_mr} onChange={(e) => setProductForm({...productForm, shortDesc_mr: e.target.value})} placeholder="पिकांवरील रोगांसाठी सर्वोत्तम..." className="border border-slate-200 rounded px-2.5 py-1 text-xs resize-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Short Description (English)</label>
                <textarea rows="2" value={productForm.shortDesc_en} onChange={(e) => setProductForm({...productForm, shortDesc_en: e.target.value})} placeholder="Highly recommended for crop diseases..." className="border border-slate-200 rounded px-2.5 py-1 text-xs resize-none" />
              </div>

              {/* Detailed Descriptions */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Full Description (Marathi)</label>
                <textarea rows="3" value={productForm.desc_mr} onChange={(e) => setProductForm({...productForm, desc_mr: e.target.value})} className="border border-slate-200 rounded px-2.5 py-1 text-xs resize-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Full Description (English)</label>
                <textarea rows="3" value={productForm.desc_en} onChange={(e) => setProductForm({...productForm, desc_en: e.target.value})} className="border border-slate-200 rounded px-2.5 py-1 text-xs resize-none" />
              </div>

              {/* Suitable Crops */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Crops (Marathi)</label>
                  <input type="text" value={productForm.crops_mr} onChange={(e) => setProductForm({...productForm, crops_mr: e.target.value})} placeholder="उदा. कापूस, मिरची" className="border border-slate-200 rounded px-2 py-1 text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Crops (English)</label>
                  <input type="text" value={productForm.crops_en} onChange={(e) => setProductForm({...productForm, crops_en: e.target.value})} placeholder="e.g. Cotton, Chilli" className="border border-slate-200 rounded px-2 py-1 text-xs" />
                </div>
              </div>

              {/* Benefits */}
              <div className="flex flex-col gap-1.5 bg-slate-50 p-2 rounded">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Benefits</label>
                <input type="text" placeholder="फायदा १ (MR)" value={productForm.benefit1_mr} onChange={(e) => setProductForm({...productForm, benefit1_mr: e.target.value})} className="border border-slate-200 bg-white rounded p-1 text-xs" />
                <input type="text" placeholder="Benefit 1 (EN)" value={productForm.benefit1_en} onChange={(e) => setProductForm({...productForm, benefit1_en: e.target.value})} className="border border-slate-200 bg-white rounded p-1 text-xs" />
                <input type="text" placeholder="फायदा २ (MR)" value={productForm.benefit2_mr} onChange={(e) => setProductForm({...productForm, benefit2_mr: e.target.value})} className="border border-slate-200 bg-white rounded p-1 text-xs" />
                <input type="text" placeholder="Benefit 2 (EN)" value={productForm.benefit2_en} onChange={(e) => setProductForm({...productForm, benefit2_en: e.target.value})} className="border border-slate-200 bg-white rounded p-1 text-xs" />
              </div>

              {/* Dosage/Usage */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Usage (Marathi)</label>
                  <input type="text" value={productForm.usage_mr} onChange={(e) => setProductForm({...productForm, usage_mr: e.target.value})} placeholder="उदा. १ ते २ मिली प्रति लिटर" className="border border-slate-200 rounded px-2 py-1 text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Usage (English)</label>
                  <input type="text" value={productForm.usage_en} onChange={(e) => setProductForm({...productForm, usage_en: e.target.value})} placeholder="e.g. 1 to 2 ml per liter" className="border border-slate-200 rounded px-2 py-1 text-xs" />
                </div>
              </div>

              {/* Image selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Product Image Vector</label>
                <select
                  value={productForm.image}
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                  className="border border-slate-200 rounded px-2 py-1 text-xs bg-white"
                >
                  <option value="/assets/products/bactrikiller.svg">BACTRIKILLER (Green/White)</option>
                  <option value="/assets/products/magic_gold.svg">MAGIC GOLD (White/Gold)</option>
                  <option value="/assets/products/mycrodifence.svg">MYCRODIFENCE (Green/Blue)</option>
                  <option value="/assets/products/srpf.svg">SRPF (Silver Bag)</option>
                  <option value="/assets/products/fast_result.svg">FAST RESULT (White/Magenta)</option>
                  <option value="/assets/products/nutri_grow_50.svg">NUTRI GROW-50 (Green/Gold)</option>
                  <option value="/assets/products/placeholder.svg">Generic Placeholder</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-2.5 mt-2">
                <button
                  type="submit"
                  className="flex-1 bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold text-xs py-2.5 rounded-lg cursor-pointer transition-all"
                >
                  {isEditingProduct ? 'सुधारित करा (Update)' : 'जोडा (Save Product)'}
                </button>
                {isEditingProduct && (
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-lg cursor-pointer"
                  >
                    रद्द (Cancel)
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* Listings Table */}
          <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm overflow-hidden flex flex-col gap-4">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3">
              उत्पादने यादी (Products Directory)
            </h2>
            
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs border-collapse divide-y divide-slate-100">
                <thead>
                  <tr className="text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5 pl-2">उत्पादन (Product)</th>
                    <th className="py-2.5">श्रेणी (Category)</th>
                    <th className="py-2.5">किंमत (Price)</th>
                    <th className="py-2.5 text-center">कृती (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                  {productsList.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 pl-2 flex items-center gap-2">
                        <div className="w-8 h-8 rounded border border-slate-100 p-0.5 bg-slate-50 flex items-center justify-center">
                          <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <span className="font-bold text-slate-800">{prod.name}</span>
                      </td>
                      <td className="py-3 uppercase text-[10px] font-bold text-slate-400">{prod.category}</td>
                      <td className="py-3 font-bold text-brand-green-dark">₹{prod.basePrice}</td>
                      <td className="py-3 text-center flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => startEditProduct(prod)}
                          className="p-1.5 text-slate-400 hover:text-brand-green-dark hover:bg-emerald-50 rounded transition-all cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit size={13} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 text-slate-400 hover:text-brand-magenta hover:bg-red-50 rounded transition-all cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Tab Contents: VIDEOS */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Video Form */}
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-5">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3">
              नवीन व्हिडिओ जोडा (Add YouTube Video)
            </h2>
            
            <form onSubmit={handleVideoSubmit} className="flex flex-col gap-4">
              
              {/* Title */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Video Title (Marathi)</label>
                <input 
                  type="text" required value={videoForm.title_mr} 
                  onChange={(e) => setVideoForm({...videoForm, title_mr: e.target.value})} 
                  placeholder="उदा. सोयाबीन कीड नियंत्रण मार्गदर्शक" 
                  className="border border-slate-200 rounded px-2.5 py-1.5 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Video Title (English)</label>
                <input 
                  type="text" required value={videoForm.title_en} 
                  onChange={(e) => setVideoForm({...videoForm, title_en: e.target.value})} 
                  placeholder="e.g. Soybean Pest Control Guide" 
                  className="border border-slate-200 rounded px-2.5 py-1.5 text-sm"
                />
              </div>

              {/* Crop Targets */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Crop (Marathi)</label>
                  <input type="text" required value={videoForm.crop_mr} onChange={(e) => setVideoForm({...videoForm, crop_mr: e.target.value})} placeholder="उदा. सोयाबीन" className="border border-slate-200 rounded px-2 py-1 text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Crop (English)</label>
                  <input type="text" required value={videoForm.crop_en} onChange={(e) => setVideoForm({...videoForm, crop_en: e.target.value})} placeholder="e.g. Soybean" className="border border-slate-200 rounded px-2 py-1 text-xs" />
                </div>
              </div>

              {/* Duration and URL */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Duration</label>
                  <input type="text" required value={videoForm.duration} onChange={(e) => setVideoForm({...videoForm, duration: e.target.value})} placeholder="e.g. 8:30" className="border border-slate-200 rounded px-2 py-1 text-xs" />
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">YouTube Link</label>
                  <input type="url" required value={videoForm.youtubeUrl} onChange={(e) => setVideoForm({...videoForm, youtubeUrl: e.target.value})} placeholder="https://www.youtube.com/watch?..." className="border border-slate-200 rounded px-2 py-1 text-xs" />
                </div>
              </div>

              {/* Category Select */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Video Category (Marathi / English)</label>
                <select
                  value={videoForm.category_en}
                  onChange={(e) => {
                    const val = e.target.value;
                    const mrMap = {
                      'Crop Guidance': 'पीक मार्गदर्शन',
                      'Product Info': 'उत्पादन माहिती',
                      'Farmer Guidance': 'शेतकरी मार्गदर्शन',
                      'Pest & Disease Management': 'कीड व रोग व्यवस्थापन',
                      'Fertilizer Management': 'खत व्यवस्थापन',
                      'Prachi Agro Products': 'प्राची अॅग्रो उत्पादने'
                    };
                    setVideoForm({
                      ...videoForm,
                      category_en: val,
                      category_mr: mrMap[val] || 'पीक मार्गदर्शन'
                    });
                  }}
                  className="border border-slate-200 rounded px-2.5 py-1 text-xs bg-white"
                >
                  <option value="Crop Guidance">Crop Guidance (पीक मार्गदर्शन)</option>
                  <option value="Product Info">Product Info (उत्पादन माहिती)</option>
                  <option value="Farmer Guidance">Farmer Guidance (शेतकरी मार्गदर्शन)</option>
                  <option value="Pest & Disease Management">Pest &amp; Disease (कीड व रोग व्यवस्थापन)</option>
                  <option value="Fertilizer Management">Fertilizer (खत व्यवस्थापन)</option>
                  <option value="Prachi Agro Products">Prachi Agro Products (प्राची उत्पादने)</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold text-xs py-2.5 rounded-lg cursor-pointer transition-all"
              >
                व्हिडिओ जोडा (Save Video)
              </button>

            </form>
          </div>

          {/* Videos List Table */}
          <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3">
              व्हिडिओ डिरेक्टरी (Videos Directory)
            </h2>
            <div className="flex flex-col gap-3">
              {videosList.map((vid) => (
                <div key={vid.id} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <div className="w-16 aspect-video bg-slate-900 rounded overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                      <img src={vid.thumbnail} alt={vid.title.en} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <Video size={14} className="text-white" />
                      </div>
                    </div>
                    <div className="text-left min-w-0">
                      <h4 className="font-bold text-slate-800 text-xs truncate">{vid.title[language]}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{vid.category[language]} • Qty: {vid.duration}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteVideo(vid.id)}
                    className="p-2 text-slate-300 hover:text-brand-magenta hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Contents: BLOGS */}
      {activeTab === 'blogs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Blog Form */}
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-5">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3">
              नवीन लेख प्रसिद्ध करा (Publish Blog Post)
            </h2>
            <form onSubmit={handleBlogSubmit} className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Blog Title (Marathi)</label>
                <input type="text" required value={blogForm.title_mr} onChange={(e) => setBlogForm({...blogForm, title_mr: e.target.value})} className="border border-slate-200 rounded px-2.5 py-1.5 text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Blog Title (English)</label>
                <input type="text" required value={blogForm.title_en} onChange={(e) => setBlogForm({...blogForm, title_en: e.target.value})} className="border border-slate-200 rounded px-2.5 py-1.5 text-sm" />
              </div>

              {/* Excerpts */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Short Summary (Marathi)</label>
                <textarea rows="2" value={blogForm.excerpt_mr} onChange={(e) => setBlogForm({...blogForm, excerpt_mr: e.target.value})} className="border border-slate-200 rounded p-2 text-xs resize-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Short Summary (English)</label>
                <textarea rows="2" value={blogForm.excerpt_en} onChange={(e) => setBlogForm({...blogForm, excerpt_en: e.target.value})} className="border border-slate-200 rounded p-2 text-xs resize-none" />
              </div>

              {/* Content Body */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Content (Marathi)</label>
                <textarea rows="4" value={blogForm.content_mr} onChange={(e) => setBlogForm({...blogForm, content_mr: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Content (English)</label>
                <textarea rows="4" value={blogForm.content_en} onChange={(e) => setBlogForm({...blogForm, content_en: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" />
              </div>

              <button type="submit" className="bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold text-xs py-2.5 rounded-lg cursor-pointer">प्रसिद्ध करा (Publish)</button>
            </form>
          </div>

          {/* Blogs Directory */}
          <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3">
              ब्लॉग लेख सूची (Blogs Directory)
            </h2>
            <div className="flex flex-col gap-3">
              {blogsList.map((blog) => (
                <div key={blog.id} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="text-left min-w-0 pr-4">
                    <h4 className="font-bold text-slate-800 text-xs truncate">{blog.title[language]}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{blog.date} • {blog.readTime}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteBlog(blog.id)}
                    className="p-2 text-slate-300 hover:text-brand-magenta hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Contents: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Review Form */}
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-5">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3">
              शेतकरी अभिप्राय जोडा (Add Testimonial)
            </h2>
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Farmer Name</label>
                  <input type="text" required value={reviewForm.name} onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" placeholder="उदा. राम पाटील" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">District (जिल्हा)</label>
                  <input type="text" required value={reviewForm.location} onChange={(e) => setReviewForm({...reviewForm, location: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" placeholder="उदा. सांगली" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Crop (Marathi)</label>
                  <input type="text" required value={reviewForm.crop_mr} onChange={(e) => setReviewForm({...reviewForm, crop_mr: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" placeholder="उदा. हळद" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Crop (English)</label>
                  <input type="text" required value={reviewForm.crop_en} onChange={(e) => setReviewForm({...reviewForm, crop_en: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" placeholder="e.g. Turmeric" />
                </div>
              </div>

              {/* Review Text */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Review (Marathi)</label>
                <textarea rows="3" required value={reviewForm.review_mr} onChange={(e) => setReviewForm({...reviewForm, review_mr: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Review (English)</label>
                <textarea rows="3" required value={reviewForm.review_en} onChange={(e) => setReviewForm({...reviewForm, review_en: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" />
              </div>

              <button type="submit" className="bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold text-xs py-2.5 rounded-lg cursor-pointer">अभिप्राय जोडा (Save Review)</button>
            </form>
          </div>

          {/* Reviews Directory */}
          <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3">
              अभिप्राय सूची (Reviews Directory)
            </h2>
            <div className="flex flex-col gap-3">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-left">
                  <div className="min-w-0 pr-4">
                    <h4 className="font-bold text-slate-800 text-xs">{rev.name} ({rev.location})</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">पिक: {rev.crop[language]} • रेटिंग: {rev.rating}★</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 font-medium">"{rev.review[language]}"</p>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="p-2 text-slate-300 hover:text-brand-magenta hover:bg-red-50 rounded-lg cursor-pointer flex-shrink-0 transition-colors"
                  >
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
