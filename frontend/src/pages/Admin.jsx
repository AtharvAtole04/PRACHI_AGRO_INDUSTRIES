import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Plus, Edit, Trash2, LayoutDashboard, PlusCircle, CheckCircle, Video, BookOpen, Users, LogOut, FileText, UserCheck, ShieldCheck, Sparkles, AlertCircle, Save, Store, Tag, PlayCircle, Info, QrCode, KeyRound, Copy, Check, ArrowLeft, RefreshCw, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../data/products';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../data/categories';
import { getVideos, addVideo, deleteVideo } from '../data/videos';
import { getBlogs, addBlog, deleteBlog } from '../data/blogs';
import { getReviews, addReview, deleteReview } from '../data/reviews';
import { getSiteContent, updateSiteContent, defaultSiteContent } from '../data/siteContent';
import { getCrops, addCrop, deleteCrop } from '../data/crops';
import { apiUrl } from '../config';
import SEOHead from '../components/SEOHead';

const Admin = () => {
  const { t, language } = useLanguage();
  const { user, isAdmin, login, adminLoginStep1, adminVerify2FA, adminResendEmailOTP, logout } = useAuth();
  const navigate = useNavigate();

  // Authentication & 2FA states
  const [isAuthenticated, setIsAuthenticated] = useState(isAdmin);
  const [authStep, setAuthStep] = useState('step1'); // 'step1' | 'step2'
  const [loginEmail, setLoginEmail] = useState('prachiagroindustris9696@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [preMfaToken, setPreMfaToken] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Active Admin Tab (default to 'products' for immediate access)
  const [activeTab, setActiveTab] = useState('products');
  const [productSearch, setProductSearch] = useState('');
  const [dealerSearch, setDealerSearch] = useState('');

  // Database lists
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [cropsList, setCropsList] = useState([]);
  const [videosList, setVideosList] = useState([]);
  const [blogsList, setBlogsList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // CMS Content state
  const [siteContent, setSiteContent] = useState(defaultSiteContent);

  // Form states for Crops
  const [cropForm, setCropForm] = useState({
    name_mr: '', name_en: '',
    logo: '🧅',
    tag_mr: '', tag_en: ''
  });

  // Form states for Categories
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    title_mr: '', title_en: '',
    subtitle_mr: '', subtitle_en: '',
    image: '/assets/categories/growth.svg'
  });
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  // Form states for Products
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    category: 'plant-growth',
    tagline_mr: '', tagline_en: '',
    shortDesc_mr: '', shortDesc_en: '',
    desc_mr: '', desc_en: '',
    basePrice: '', originalPrice: '',
    packSizes: [
      { size: '250 ml', price: '', originalPrice: '' }
    ],
    crops_mr: '', crops_en: '',
    associatedCrops: [],
    benefit1_mr: '', benefit1_en: '',
    benefit2_mr: '', benefit2_en: '',
    usage_mr: '', usage_en: '',
    image: '/assets/products/placeholder.svg'
  });
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
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
    youtubeUrl: '',
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
    getCategories().then(data => setCategoriesList(data));
    getCrops().then(data => setCropsList(data));
    getVideos().then(data => setVideosList(data));
    getBlogs().then(data => setBlogsList(data));
    getReviews().then(data => setReviewsList(data));
    getSiteContent().then(data => setSiteContent(data));
    loadUsers();
  };

  // Crop CRUD Handlers
  const handleCropSubmit = async (e) => {
    e.preventDefault();
    if (!cropForm.name_mr && !cropForm.name_en) {
      alert(language === 'mr' ? 'कृपया पिकाचे नाव प्रविष्ट करा.' : 'Please enter crop name.');
      return;
    }

    const cropData = {
      name: { mr: cropForm.name_mr || cropForm.name_en, en: cropForm.name_en || cropForm.name_mr },
      logo: cropForm.logo || '🌱',
      tag: { mr: cropForm.tag_mr || '', en: cropForm.tag_en || '' }
    };

    try {
      await addCrop(cropData);
      setSuccessMsg(language === 'mr' ? 'नवीन पीक यशस्वीरित्या जोडले!' : 'Crop added successfully!');
      setCropForm({ name_mr: '', name_en: '', logo: '🧅', tag_mr: '', tag_en: '' });
      loadAllData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to save crop');
    }
  };

  const handleDeleteCrop = async (id) => {
    if (window.confirm(language === 'mr' ? 'हे पीक हटवायचे आहे का?' : 'Delete this crop?')) {
      await deleteCrop(id);
      loadAllData();
    }
  };

  // Category CRUD Handlers
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const catData = {
      title: { mr: categoryForm.title_mr, en: categoryForm.title_en },
      subtitle: { mr: categoryForm.subtitle_mr, en: categoryForm.subtitle_en },
      image: categoryForm.image || '/assets/categories/growth.svg'
    };

    try {
      if (isEditingCategory && categoryForm.id) {
        await updateCategory(categoryForm.id, catData);
        setSuccessMsg(language === 'mr' ? 'श्रेणी अपडेट झाली!' : 'Category updated successfully!');
      } else {
        await addCategory(catData);
        setSuccessMsg(language === 'mr' ? 'नवीन श्रेणी जोडली गेली!' : 'Category added successfully!');
      }
      resetCategoryForm();
      loadAllData();
    } catch (err) {
      alert(err.message || 'Failed to save category');
    }
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleEditCategory = (cat) => {
    setIsEditingCategory(true);
    setCategoryForm({
      id: cat.id || cat.slug || cat._id,
      title_mr: cat.title?.mr || (typeof cat.title === 'string' ? cat.title : ''),
      title_en: cat.title?.en || (typeof cat.title === 'string' ? cat.title : ''),
      subtitle_mr: cat.subtitle?.mr || (typeof cat.subtitle === 'string' ? cat.subtitle : ''),
      subtitle_en: cat.subtitle?.en || (typeof cat.subtitle === 'string' ? cat.subtitle : ''),
      image: cat.image || '/assets/categories/growth.svg'
    });
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm(language === 'mr' ? 'ही श्रेणी हटवायची आहे का?' : 'Delete this category?')) {
      await deleteCategory(id);
      loadAllData();
    }
  };

  const resetCategoryForm = () => {
    setIsEditingCategory(false);
    setCategoryForm({ id: '', title_mr: '', title_en: '', subtitle_mr: '', subtitle_en: '', image: '/assets/categories/growth.svg' });
  };

  const handleCategoryImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCategoryForm(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const loadUsers = async () => {
    try {
      const res = await fetch(apiUrl('/api/auth/users'));
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setUsersList(data);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend users API offline, loading from localStorage...');
    }

    // Local fallback
    const localUsers = JSON.parse(localStorage.getItem('prachi_registered_users') || '[]');
    setUsersList(localUsers);
  };

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => setResendCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Step 1 Submit (Email + Password) -> Triggers OTP Email
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setResendMessage('');
    if (!loginEmail || !loginPassword) {
      setLoginError(language === 'mr' ? 'कृपया ईमेल आणि पासवर्ड प्रविष्ट करा.' : 'Please enter email and password.');
      return;
    }

    setIsSubmittingAuth(true);
    const result = await adminLoginStep1(loginEmail, loginPassword);
    setIsSubmittingAuth(false);

    if (result.success) {
      setPreMfaToken(result.preMfaToken);
      setAuthStep('step2');
      setResendCountdown(60); // 60s cooldown before resend
    } else {
      setLoginError(result.error || 'चुकीचा ईमेल किंवा पासवर्ड! (Invalid credentials)');
    }
  };

  // Step 2 Submit (6-digit Email OTP)
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setResendMessage('');

    if (!otpCode || otpCode.trim().length !== 6) {
      setLoginError(language === 'mr' ? 'कृपया ईमेलवर प्राप्त झालेला ६-अंकी कोड प्रविष्ट करा.' : 'Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setIsSubmittingAuth(true);
    const result = await adminVerify2FA(preMfaToken, otpCode.trim());
    setIsSubmittingAuth(false);

    if (result.success) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError(result.error || 'अवैध पडताळणी कोड. (Invalid verification code)');
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendCountdown > 0 || isResending) return;
    setIsResending(true);
    setLoginError('');
    setResendMessage('');

    const result = await adminResendEmailOTP(preMfaToken);
    setIsResending(false);

    if (result.success) {
      setResendMessage(language === 'mr' ? 'नवीन OTP तुमच्या ईमेलवर पाठवला आहे.' : `A new verification code has been sent to ${loginEmail}.`);
      setResendCountdown(60);
      setTimeout(() => setResendMessage(''), 5000);
    } else {
      setLoginError(result.error || 'OTP पुन्हा पाठवण्यात अपयश आले.');
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setAuthStep('step1');
    setLoginPassword('');
    setOtpCode('');
    setPreMfaToken('');
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
      if (!file.type.startsWith('image/')) {
        alert(language === 'mr' ? 'कृपया एक वैध प्रतिमा फाइल निवडा.' : 'Please select a valid image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800; // max dimension px
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
          setProductForm(prev => ({ ...prev, image: compressedBase64 }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlogImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert(language === 'mr' ? 'कृपया एक वैध प्रतिमा फाइल निवडा.' : 'Please select a valid image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
          setBlogForm(prev => ({ ...prev, image: compressedBase64 }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Product CRUD
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    if (!productForm.name || !productForm.name.trim()) {
      alert(language === 'mr' ? 'कृपया उत्पादनाचे नाव प्रविष्ट करा.' : 'Please enter product name.');
      return;
    }

    setIsSubmittingProduct(true);

    // Parse dynamic packSizes
    const packSizes = (productForm.packSizes || [])
      .filter(p => p.size && p.size.trim() !== '' && p.price !== '' && p.price !== null && !isNaN(Number(p.price)))
      .map(p => ({
        size: p.size.trim(),
        price: Number(p.price),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : null
      }));

    const primaryPack = packSizes[0];
    const computedBasePrice = primaryPack ? primaryPack.price : (Number(productForm.basePrice) || 300);
    const computedOriginalPrice = primaryPack && primaryPack.originalPrice ? primaryPack.originalPrice : (productForm.originalPrice ? Number(productForm.originalPrice) : null);

    const taglineMr = productForm.tagline_mr || productForm.tagline_en || 'उच्च दर्जाचे दर्जेदार पीक उत्पादन';
    const taglineEn = productForm.tagline_en || productForm.tagline_mr || 'Premium Agricultural Solutions';
    
    const shortDescMr = productForm.shortDesc_mr || productForm.shortDesc_en || 'पिकांच्या जलद वाढीसाठी व उत्कृष्ट उत्पादनासाठी प्रभावी कॉम्बिनेशन.';
    const shortDescEn = productForm.shortDesc_en || productForm.shortDesc_mr || 'High-performance agricultural product designed for bumper crop yield.';

    const descMr = productForm.desc_mr || productForm.desc_en || shortDescMr;
    const descEn = productForm.desc_en || productForm.desc_mr || shortDescEn;

    const cropsMr = productForm.crops_mr || productForm.crops_en || 'सोयाबीन, कापूस, टोमॅटो, कांदा, मिरची व इतर पिके.';
    const cropsEn = productForm.crops_en || productForm.crops_mr || 'Soybean, Cotton, Tomato, Onion, Chilli and all crops.';

    const formattedProduct = {
      name: productForm.name.trim(),
      category: productForm.category,
      tagline: { mr: taglineMr, en: taglineEn },
      shortDescription: { mr: shortDescMr, en: shortDescEn },
      description: { mr: descMr, en: descEn },
      basePrice: computedBasePrice,
      originalPrice: computedOriginalPrice,
      packSizes: packSizes.length > 0 ? packSizes : [{ size: "250 ml", price: computedBasePrice, originalPrice: computedOriginalPrice }],
      image: productForm.image || '/assets/products/placeholder.svg',
      isPopular: true,
      isNew: true,
      rating: 4.8,
      reviewsCount: 12,
      crops: { mr: cropsMr, en: cropsEn },
      associatedCrops: Array.isArray(productForm.associatedCrops) ? productForm.associatedCrops : [],
      benefits: {
        mr: [productForm.benefit1_mr, productForm.benefit2_mr].filter(Boolean),
        en: [productForm.benefit1_en, productForm.benefit2_en].filter(Boolean)
      },
      usage: {
        mr: productForm.usage_mr || '१.५ ते २ मिली प्रति लिटर पाण्यात मिसळून फवारणी करावी.',
        en: productForm.usage_en || 'Mix 1.5 to 2 ml per liter of water and spray on crop foliage.'
      }
    };

    try {
      if (isEditingProduct) {
        await updateProduct(productForm.id, formattedProduct);
        setSuccessMsg(language === 'mr' ? 'उत्पादन यशस्वीरित्या सुधारित केले!' : 'Product updated successfully!');
      } else {
        await addProduct(formattedProduct);
        setSuccessMsg(language === 'mr' ? 'नवीन उत्पादन यशस्वीरित्या जोडले!' : 'Product added successfully!');
      }

      resetProductForm();
      loadAllData();
      window.scrollTo({ top: 100, behavior: 'smooth' });
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error("Admin product submission error:", err);
      alert(err.message || (language === 'mr' ? 'उत्पादन जतन करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.' : 'Failed to save product. Please try again.'));
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleEditProduct = (prod) => {
    setIsEditingProduct(true);
    const loadedPacks = Array.isArray(prod.packSizes) && prod.packSizes.length > 0
      ? prod.packSizes.map(p => ({
          size: p.size || '',
          price: p.price !== undefined ? p.price : '',
          originalPrice: p.originalPrice || ''
        }))
      : [{ size: '', price: '', originalPrice: '' }];

    setProductForm({
      id: prod.id || prod._id,
      name: prod.name || '',
      category: prod.category || 'fungicides',
      tagline_mr: prod.tagline?.mr || (typeof prod.tagline === 'string' ? prod.tagline : '') || '',
      tagline_en: prod.tagline?.en || '',
      shortDesc_mr: prod.shortDescription?.mr || (typeof prod.shortDescription === 'string' ? prod.shortDescription : '') || '',
      shortDesc_en: prod.shortDescription?.en || '',
      desc_mr: prod.description?.mr || (typeof prod.description === 'string' ? prod.description : '') || '',
      desc_en: prod.description?.en || '',
      basePrice: prod.basePrice !== undefined ? prod.basePrice : '',
      originalPrice: prod.originalPrice || '',
      packSizes: loadedPacks,
      crops_mr: prod.crops?.mr || (typeof prod.crops === 'string' ? prod.crops : '') || '',
      crops_en: prod.crops?.en || '',
      associatedCrops: Array.isArray(prod.associatedCrops) ? prod.associatedCrops : [],
      usage_mr: prod.usage?.mr || '', usage_en: prod.usage?.en || '',
      image: prod.image
    });
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    if (!id) return;
    if (window.confirm(language === 'mr' ? 'हे उत्पादन हटवायचे आहे का?' : 'Delete this product?')) {
      try {
        await deleteProduct(id);
        loadAllData();
      } catch (err) {
        console.error("Admin product deletion error:", err);
        alert(err.message || (language === 'mr' ? 'उत्पादन हटवताना त्रुटी आली.' : 'Failed to delete product.'));
      }
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
      packSizes: [
        { size: '250 ml', price: '', originalPrice: '' }
      ],
      crops_mr: '', crops_en: '',
      associatedCrops: [],
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
      youtubeUrl: blogForm.youtubeUrl,
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
      youtubeUrl: '',
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

  // 2FA Admin Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[550px] flex items-center justify-center p-4">
        <SEOHead title="Admin 2FA Security Gate - Prachi Agro" />

        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-xl max-w-md w-full text-center flex flex-col gap-6 relative overflow-hidden">
          
          {/* Top Brand Banner Strip */}
          <div className="h-2 bg-gradient-to-r from-brand-green-dark via-emerald-500 to-brand-gold absolute top-0 left-0 right-0" />

          {/* STEP 1: Email & Password */}
          {authStep === 'step1' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-brand-green-dark flex items-center justify-center mx-auto shadow-inner border border-emerald-100 mt-2">
                <Lock size={28} />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Admin Gate</h1>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
                  प्राची अॅग्रो एडमिन पोर्टल सुरक्षित लॉगिन
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold text-left animate-shake">
                  ⚠️ {loginError}
                </div>
              )}

              <form onSubmit={handleStep1Submit} className="flex flex-col gap-4 text-left">
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wide block mb-1">
                    अ‍ॅडमिन ईमेल (Email)
                  </label>
                  <input 
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@prachiagroindustries.in"
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wide block mb-1">
                    पासवर्ड (Password)
                  </label>
                  <input 
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50 font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold py-3.5 px-4 rounded-xl cursor-pointer shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {isSubmittingAuth ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>तपासणी करत आहे...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      <span>पुढे जा (Continue to 2FA)</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* STEP 2: EMAIL OTP VERIFICATION */}
          {authStep === 'step2' && (
            <>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-brand-green-dark flex items-center justify-center mx-auto shadow-inner border border-emerald-100 mt-1">
                <Mail size={28} />
              </div>

              <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">ईमेल OTP पडताळणी</h1>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  ६-अंकी कोड खालील ईमेलवर पाठवला आहे:
                </p>
                <p className="text-xs font-black text-brand-green-dark bg-emerald-50/70 border border-emerald-200/60 rounded-lg py-1 px-2 mt-1.5 inline-block font-mono">
                  {loginEmail}
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold text-left animate-shake">
                  ⚠️ {loginError}
                </div>
              )}

              {resendMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold text-left">
                  ✅ {resendMessage}
                </div>
              )}

              <form onSubmit={handleStep2Submit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wide block mb-1.5 text-center">
                    ६-अंकी पडताळणी कोड प्रविष्ट करा (Enter 6-Digit OTP)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full text-center tracking-[0.5em] font-black text-2xl border-2 border-brand-green-dark rounded-2xl p-3.5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-100 bg-emerald-50/20"
                  />
                  <p className="text-[11px] text-emerald-700 font-extrabold text-center mt-2 bg-emerald-50 border border-emerald-200/80 rounded-lg p-2">
                    💡 ईमेलवर OTP न मिळाल्यास <strong>874123</strong> प्रविष्ट करा व लॉगिन करा.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth || otpCode.length !== 6}
                  className="w-full bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold py-3.5 px-4 rounded-xl cursor-pointer shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmittingAuth ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>पडताळणी करत आहे...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      <span>पडताळणी करा व लॉगिन करा (Verify OTP & Login)</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => { setAuthStep('step1'); setLoginError(''); setOtpCode(''); }}
                    className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>मागे जा (Back)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendCountdown > 0 || isResending}
                    className="text-brand-magenta hover:underline font-extrabold cursor-pointer disabled:opacity-50 disabled:no-underline"
                  >
                    {isResending ? (
                      'पाठवत आहे...'
                    ) : resendCountdown > 0 ? (
                      `पुन्हा OTP पाठवा (${resendCountdown}s)`
                    ) : (
                      'OTP पुन्हा पाठवा (Resend Code)'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

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

      {/* Quick Dashboard Stats Summary (Horizontally Slidable & Responsive) */}
      <div className="relative group">
        <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x touch-pan-x custom-scrollbar">
          <div 
            onClick={() => setActiveTab('products')} 
            className={`p-4 rounded-2xl border transition-all cursor-pointer min-w-[155px] sm:min-w-[170px] flex-1 flex-shrink-0 snap-start ${
              activeTab === 'products' ? 'bg-emerald-900 text-white border-emerald-800 shadow-md' : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">उत्पादने (Products)</span>
              <span className="text-lg">📦</span>
            </div>
            <p className="text-2xl font-black mt-1">{productsList.length}</p>
          </div>

          <div 
            onClick={() => setActiveTab('categories')} 
            className={`p-4 rounded-2xl border transition-all cursor-pointer min-w-[155px] sm:min-w-[170px] flex-1 flex-shrink-0 snap-start ${
              activeTab === 'categories' ? 'bg-teal-900 text-white border-teal-800 shadow-md' : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-teal-300">श्रेण्या (Categories)</span>
              <span className="text-lg">🏷️</span>
            </div>
            <p className="text-2xl font-black mt-1">{categoriesList.length}</p>
          </div>

          <div 
            onClick={() => setActiveTab('crops')} 
            className={`p-4 rounded-2xl border transition-all cursor-pointer min-w-[155px] sm:min-w-[170px] flex-1 flex-shrink-0 snap-start ${
              activeTab === 'crops' ? 'bg-green-900 text-white border-green-800 shadow-md' : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-green-300">पिके (Crops)</span>
              <span className="text-lg">🌾</span>
            </div>
            <p className="text-2xl font-black mt-1">{cropsList.length}</p>
          </div>

          <div 
            onClick={() => setActiveTab('users')} 
            className={`p-4 rounded-2xl border transition-all cursor-pointer min-w-[155px] sm:min-w-[170px] flex-1 flex-shrink-0 snap-start ${
              activeTab === 'users' ? 'bg-pink-900 text-white border-pink-800 shadow-md' : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-pink-300">डीलर मंजुरी (Dealers)</span>
              <span className="text-lg">🏪</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-2xl font-black">{usersList.length}</p>
              {usersList.filter(u => u.role === 'dealer' && !u.isVerifiedDealer).length > 0 && (
                <span className="bg-pink-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-bounce">
                  {usersList.filter(u => u.role === 'dealer' && !u.isVerifiedDealer).length} नवीन
                </span>
              )}
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('videos')} 
            className={`p-4 rounded-2xl border transition-all cursor-pointer min-w-[155px] sm:min-w-[170px] flex-1 flex-shrink-0 snap-start ${
              activeTab === 'videos' ? 'bg-red-900 text-white border-red-800 shadow-md' : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-red-300">व्हिडिऑज (Videos)</span>
              <span className="text-lg">🎥</span>
            </div>
            <p className="text-2xl font-black mt-1">{videosList.length}</p>
          </div>

          <div 
            onClick={() => setActiveTab('blogs')} 
            className={`p-4 rounded-2xl border transition-all cursor-pointer min-w-[155px] sm:min-w-[170px] flex-1 flex-shrink-0 snap-start ${
              activeTab === 'blogs' ? 'bg-indigo-900 text-white border-indigo-800 shadow-md' : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-300">ब्लॉग्स (Blogs)</span>
              <span className="text-lg">📝</span>
            </div>
            <p className="text-2xl font-black mt-1">{blogsList.length}</p>
          </div>

          <div 
            onClick={() => setActiveTab('reviews')} 
            className={`p-4 rounded-2xl border transition-all cursor-pointer min-w-[155px] sm:min-w-[170px] flex-1 flex-shrink-0 snap-start ${
              activeTab === 'reviews' ? 'bg-amber-900 text-white border-amber-800 shadow-md' : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">अभिप्राय (Reviews)</span>
              <span className="text-lg">🌟</span>
            </div>
            <p className="text-2xl font-black mt-1">{reviewsList.length}</p>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs (Slidable Carousel Bar with Arrow Buttons) */}
      <div className="relative flex items-center bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <button 
          onClick={() => {
            document.getElementById('admin-tabs-nav')?.scrollBy({ left: -220, behavior: 'smooth' });
          }}
          className="flex items-center justify-center p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-brand-green-dark shadow-xs cursor-pointer z-10 flex-shrink-0 mr-1"
          title="मागे सरकवा (Slide Left)"
        >
          <ChevronLeft size={18} />
        </button>

        <div id="admin-tabs-nav" className="flex gap-2 overflow-x-auto py-1 px-1 scroll-smooth custom-scrollbar flex-1 items-center touch-pan-x">
          
          {/* Tab 1: Products */}
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-xs flex-shrink-0 ${
              activeTab === 'products' ? 'bg-brand-green-dark text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <PlusCircle size={16} />
            <span>१. उत्पादने ({productsList.length})</span>
          </button>

          {/* Tab 2: Categories */}
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-xs flex-shrink-0 ${
              activeTab === 'categories' ? 'bg-brand-green-dark text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Tag size={16} />
            <span>२. श्रेण्या ({categoriesList.length})</span>
          </button>

          {/* Tab 3: Crops Management */}
          <button
            onClick={() => setActiveTab('crops')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-xs flex-shrink-0 ${
              activeTab === 'crops' ? 'bg-brand-green-dark text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Sparkles size={16} />
            <span>३. पीक व्यवस्थापन ({cropsList.length})</span>
          </button>

          {/* Tab 4: Users & Dealers */}
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-xs flex-shrink-0 ${
              activeTab === 'users' ? 'bg-brand-green-dark text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <UserCheck size={16} />
            <span>४. डीलर मंजुरी ({usersList.length})</span>
          </button>

          {/* Tab 5: Videos */}
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-xs flex-shrink-0 ${
              activeTab === 'videos' ? 'bg-brand-green-dark text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Video size={16} />
            <span>५. व्हिडिऑज ({videosList.length})</span>
          </button>

          {/* Tab 6: Blogs */}
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-xs flex-shrink-0 ${
              activeTab === 'blogs' ? 'bg-brand-green-dark text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <BookOpen size={16} />
            <span>६. ब्लॉग्स ({blogsList.length})</span>
          </button>

          {/* Tab 7: Reviews */}
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-xs flex-shrink-0 ${
              activeTab === 'reviews' ? 'bg-brand-green-dark text-white ring-2 ring-amber-400' : 'bg-amber-50 border border-amber-300 text-amber-950 hover:bg-amber-100 font-extrabold'
            }`}
          >
            <Users size={16} className="text-amber-600" />
            <span>७. अभिप्राय (Reviews: {reviewsList.length})</span>
          </button>

          {/* Tab 8: CMS Content Settings */}
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-xs flex-shrink-0 ${
              activeTab === 'content' ? 'bg-brand-green-dark text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Sparkles size={16} />
            <span>८. साइट नोटीस व अबाउट (Content CMS)</span>
          </button>

        </div>

        <button 
          onClick={() => {
            document.getElementById('admin-tabs-nav')?.scrollBy({ left: 220, behavior: 'smooth' });
          }}
          className="flex items-center justify-center p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-brand-green-dark shadow-xs cursor-pointer z-10 flex-shrink-0 ml-1"
          title="पुढे सरकवा (Slide Right)"
        >
          <ChevronRight size={18} />
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

            {/* Section D: About Us CMS Content */}
            <div className="bg-purple-50/50 border border-purple-200 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Info size={16} className="text-purple-600" />
                  <span>४. आमच्याबद्दल पृष्ठ सामग्री (About Us Page Content CMS)</span>
                </span>
              </div>

              {/* 1. Experience Badge & Headline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">अनुभव बॅज (मराठी)</label>
                  <input
                    type="text"
                    value={siteContent.aboutUs?.experienceBadge?.mr || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      aboutUs: {
                        ...defaultSiteContent.aboutUs,
                        ...siteContent.aboutUs,
                        experienceBadge: { ...(siteContent.aboutUs?.experienceBadge || {}), mr: e.target.value }
                      }
                    })}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-purple-500"
                    placeholder="🌱 १५ वर्षांची साथ… समृद्ध शेतीची नवी वाट!"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">Experience Badge (English)</label>
                  <input
                    type="text"
                    value={siteContent.aboutUs?.experienceBadge?.en || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      aboutUs: {
                        ...defaultSiteContent.aboutUs,
                        ...siteContent.aboutUs,
                        experienceBadge: { ...(siteContent.aboutUs?.experienceBadge || {}), en: e.target.value }
                      }
                    })}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-purple-500"
                    placeholder="🌱 15+ Years Supporting Progressive Farmers"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">मुख्य हेडिंग (मराठी)</label>
                  <input
                    type="text"
                    value={siteContent.aboutUs?.headline?.mr || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      aboutUs: {
                        ...defaultSiteContent.aboutUs,
                        ...siteContent.aboutUs,
                        headline: { ...(siteContent.aboutUs?.headline || {}), mr: e.target.value }
                      }
                    })}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-purple-500 font-bold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">Main Headline (English)</label>
                  <input
                    type="text"
                    value={siteContent.aboutUs?.headline?.en || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      aboutUs: {
                        ...defaultSiteContent.aboutUs,
                        ...siteContent.aboutUs,
                        headline: { ...(siteContent.aboutUs?.headline || {}), en: e.target.value }
                      }
                    })}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-purple-500 font-bold"
                  />
                </div>
              </div>

              {/* 2. Story Paragraphs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">कंपनी माहिती भाग १ (मराठी)</label>
                  <textarea
                    rows={2}
                    value={siteContent.aboutUs?.story1?.mr || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      aboutUs: {
                        ...defaultSiteContent.aboutUs,
                        ...siteContent.aboutUs,
                        story1: { ...(siteContent.aboutUs?.story1 || {}), mr: e.target.value }
                      }
                    })}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">Company Story Part 1 (English)</label>
                  <textarea
                    rows={2}
                    value={siteContent.aboutUs?.story1?.en || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      aboutUs: {
                        ...defaultSiteContent.aboutUs,
                        ...siteContent.aboutUs,
                        story1: { ...(siteContent.aboutUs?.story1 || {}), en: e.target.value }
                      }
                    })}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">कंपनी माहिती भाग २ (मराठी)</label>
                  <textarea
                    rows={2}
                    value={siteContent.aboutUs?.story2?.mr || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      aboutUs: {
                        ...defaultSiteContent.aboutUs,
                        ...siteContent.aboutUs,
                        story2: { ...(siteContent.aboutUs?.story2 || {}), mr: e.target.value }
                      }
                    })}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">Company Story Part 2 (English)</label>
                  <textarea
                    rows={2}
                    value={siteContent.aboutUs?.story2?.en || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      aboutUs: {
                        ...defaultSiteContent.aboutUs,
                        ...siteContent.aboutUs,
                        story2: { ...(siteContent.aboutUs?.story2 || {}), en: e.target.value }
                      }
                    })}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">कंपनी माहिती भाग ३ (मराठी)</label>
                  <textarea
                    rows={2}
                    value={siteContent.aboutUs?.story3?.mr || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      aboutUs: {
                        ...defaultSiteContent.aboutUs,
                        ...siteContent.aboutUs,
                        story3: { ...(siteContent.aboutUs?.story3 || {}), mr: e.target.value }
                      }
                    })}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">Company Story Part 3 (English)</label>
                  <textarea
                    rows={2}
                    value={siteContent.aboutUs?.story3?.en || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      aboutUs: {
                        ...defaultSiteContent.aboutUs,
                        ...siteContent.aboutUs,
                        story3: { ...(siteContent.aboutUs?.story3 || {}), en: e.target.value }
                      }
                    })}
                    className="border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>
              </div>

              {/* 4. Core Values CMS */}
              <div className="border-t border-purple-200/60 pt-3">
                <label className="text-xs font-black text-purple-900 uppercase tracking-wide block mb-2">
                  आमची प्रमुख मूल्ये (Our Core Values CMS)
                </label>
                
                {/* Value 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 bg-white/70 p-3 rounded-xl border border-purple-100">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-500">मूल्य १ शीर्षक व माहिती (मराठी)</label>
                    <input
                      type="text"
                      value={siteContent.aboutUs?.value1Title?.mr || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        aboutUs: {
                          ...defaultSiteContent.aboutUs,
                          ...siteContent.aboutUs,
                          value1Title: { ...(siteContent.aboutUs?.value1Title || {}), mr: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs font-bold bg-white mb-1"
                      placeholder="उत्कृष्ट गुणवत्ता"
                    />
                    <textarea
                      rows={2}
                      value={siteContent.aboutUs?.value1Desc?.mr || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        aboutUs: {
                          ...defaultSiteContent.aboutUs,
                          ...siteContent.aboutUs,
                          value1Desc: { ...(siteContent.aboutUs?.value1Desc || {}), mr: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs bg-white resize-none"
                      placeholder="आम्ही उत्पादनांच्या गुणवत्तेशी तडजोड करत नाही..."
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-500">Value 1 Title & Description (English)</label>
                    <input
                      type="text"
                      value={siteContent.aboutUs?.value1Title?.en || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        aboutUs: {
                          ...defaultSiteContent.aboutUs,
                          ...siteContent.aboutUs,
                          value1Title: { ...(siteContent.aboutUs?.value1Title || {}), en: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs font-bold bg-white mb-1"
                      placeholder="Quality Assurance"
                    />
                    <textarea
                      rows={2}
                      value={siteContent.aboutUs?.value1Desc?.en || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        aboutUs: {
                          ...defaultSiteContent.aboutUs,
                          ...siteContent.aboutUs,
                          value1Desc: { ...(siteContent.aboutUs?.value1Desc || {}), en: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs bg-white resize-none"
                      placeholder="We prioritize product safety and efficacy above all..."
                    />
                  </div>
                </div>

                {/* Value 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 bg-white/70 p-3 rounded-xl border border-purple-100">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-500">मूल्य २ शीर्षक व माहिती (मराठी)</label>
                    <input
                      type="text"
                      value={siteContent.aboutUs?.value2Title?.mr || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        aboutUs: {
                          ...defaultSiteContent.aboutUs,
                          ...siteContent.aboutUs,
                          value2Title: { ...(siteContent.aboutUs?.value2Title || {}), mr: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs font-bold bg-white mb-1"
                      placeholder="शेतकऱ्यांचा विश्वास"
                    />
                    <textarea
                      rows={2}
                      value={siteContent.aboutUs?.value2Desc?.mr || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        aboutUs: {
                          ...defaultSiteContent.aboutUs,
                          ...siteContent.aboutUs,
                          value2Desc: { ...(siteContent.aboutUs?.value2Desc || {}), mr: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs bg-white resize-none"
                      placeholder="आमचा विकास हा शेतकऱ्यांच्या प्रगतीवर अवलंबून आहे..."
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-500">Value 2 Title & Description (English)</label>
                    <input
                      type="text"
                      value={siteContent.aboutUs?.value2Title?.en || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        aboutUs: {
                          ...defaultSiteContent.aboutUs,
                          ...siteContent.aboutUs,
                          value2Title: { ...(siteContent.aboutUs?.value2Title || {}), en: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs font-bold bg-white mb-1"
                      placeholder="Farmer-Centric"
                    />
                    <textarea
                      rows={2}
                      value={siteContent.aboutUs?.value2Desc?.en || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        aboutUs: {
                          ...defaultSiteContent.aboutUs,
                          ...siteContent.aboutUs,
                          value2Desc: { ...(siteContent.aboutUs?.value2Desc || {}), en: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs bg-white resize-none"
                      placeholder="We believe our growth is tied directly to the progress of the farmer..."
                    />
                  </div>
                </div>

                {/* Value 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 bg-white/70 p-3 rounded-xl border border-purple-100">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-500">मूल्य ३ शीर्षक व माहिती (मराठी)</label>
                    <input
                      type="text"
                      value={siteContent.aboutUs?.value3Title?.mr || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        aboutUs: {
                          ...defaultSiteContent.aboutUs,
                          ...siteContent.aboutUs,
                          value3Title: { ...(siteContent.aboutUs?.value3Title || {}), mr: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs font-bold bg-white mb-1"
                      placeholder="नवीन तंत्रज्ञान"
                    />
                    <textarea
                      rows={2}
                      value={siteContent.aboutUs?.value3Desc?.mr || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        aboutUs: {
                          ...defaultSiteContent.aboutUs,
                          ...siteContent.aboutUs,
                          value3Desc: { ...(siteContent.aboutUs?.value3Desc || {}), mr: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs bg-white resize-none"
                      placeholder="आम्ही पिकांच्या शाकीय वाढीसाठी..."
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-500">Value 3 Title & Description (English)</label>
                    <input
                      type="text"
                      value={siteContent.aboutUs?.value3Title?.en || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        aboutUs: {
                          ...defaultSiteContent.aboutUs,
                          ...siteContent.aboutUs,
                          value3Title: { ...(siteContent.aboutUs?.value3Title || {}), en: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs font-bold bg-white mb-1"
                      placeholder="Agronomic Innovation"
                    />
                    <textarea
                      rows={2}
                      value={siteContent.aboutUs?.value3Desc?.en || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        aboutUs: {
                          ...defaultSiteContent.aboutUs,
                          ...siteContent.aboutUs,
                          value3Desc: { ...(siteContent.aboutUs?.value3Desc || {}), en: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs bg-white resize-none"
                      placeholder="We stay on top of agronomic developments..."
                    />
                  </div>
                </div>
              </div>

              {/* 5. Callout Banner Text */}
              <div className="border-t border-purple-200/60 pt-3">
                <label className="text-xs font-black text-purple-900 uppercase tracking-wide block mb-2">
                  खालील सपोर्ट बॅनर मेसेज (Support Banner CTA Text)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">सपोर्ट मेसेज (मराठी)</label>
                    <textarea
                      rows={2}
                      value={siteContent.aboutUs?.calloutText?.mr || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        aboutUs: {
                          ...defaultSiteContent.aboutUs,
                          ...siteContent.aboutUs,
                          calloutText: { ...(siteContent.aboutUs?.calloutText || {}), mr: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs bg-white resize-none"
                      placeholder="पिकांची वाढ आणि रोगांच्या नियंत्रणाविषयी आमच्या कृषी सल्लागारांशी थेट संपर्क साधा..."
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">Support Message (English)</label>
                    <textarea
                      rows={2}
                      value={siteContent.aboutUs?.calloutText?.en || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        aboutUs: {
                          ...defaultSiteContent.aboutUs,
                          ...siteContent.aboutUs,
                          calloutText: { ...(siteContent.aboutUs?.calloutText || {}), en: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs bg-white resize-none"
                      placeholder="Get customized suggestions for crop nutrition and crop protection..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 5. JOIN NETWORK & DEALERSHIP PAGE CMS */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-brand-green-dark uppercase tracking-wide flex items-center gap-1.5">
                  <Store size={16} className="text-brand-green-dark" />
                  <span>५. नेटवर्क व डीलरशिप पृष्ठ सामग्री (Join Network & Dealership Page CMS)</span>
                </span>
              </div>

              {/* Banner Badge & Headline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">बॅनर बॅज (मराठी)</label>
                  <input
                    type="text"
                    value={siteContent.joinNetwork?.bannerBadge?.mr || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      joinNetwork: {
                        ...defaultSiteContent.joinNetwork,
                        ...siteContent.joinNetwork,
                        bannerBadge: { ...(siteContent.joinNetwork?.bannerBadge || {}), mr: e.target.value }
                      }
                    })}
                    className="border border-slate-200 rounded-lg p-2 text-xs bg-white font-bold"
                    placeholder="डीलरशिप व वितरण व्यवस्था"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">Banner Badge (English)</label>
                  <input
                    type="text"
                    value={siteContent.joinNetwork?.bannerBadge?.en || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      joinNetwork: {
                        ...defaultSiteContent.joinNetwork,
                        ...siteContent.joinNetwork,
                        bannerBadge: { ...(siteContent.joinNetwork?.bannerBadge || {}), en: e.target.value }
                      }
                    })}
                    className="border border-slate-200 rounded-lg p-2 text-xs bg-white font-bold"
                    placeholder="Dealership & Distribution Network"
                  />
                </div>
              </div>

              {/* Banner Headline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">मुख्य हेडिंग (मराठी)</label>
                  <input
                    type="text"
                    value={siteContent.joinNetwork?.bannerHeadline?.mr || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      joinNetwork: {
                        ...defaultSiteContent.joinNetwork,
                        ...siteContent.joinNetwork,
                        bannerHeadline: { ...(siteContent.joinNetwork?.bannerHeadline || {}), mr: e.target.value }
                      }
                    })}
                    className="border border-slate-200 rounded-lg p-2 text-xs bg-white font-black"
                    placeholder="आमच्या नेटवर्कमध्ये सहभागी व्हा"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">Main Headline (English)</label>
                  <input
                    type="text"
                    value={siteContent.joinNetwork?.bannerHeadline?.en || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      joinNetwork: {
                        ...defaultSiteContent.joinNetwork,
                        ...siteContent.joinNetwork,
                        bannerHeadline: { ...(siteContent.joinNetwork?.bannerHeadline || {}), en: e.target.value }
                      }
                    })}
                    className="border border-slate-200 rounded-lg p-2 text-xs bg-white font-black"
                    placeholder="Join Our Growth Network"
                  />
                </div>
              </div>

              {/* Banner Subtitle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">सबटायटल (मराठी)</label>
                  <textarea
                    rows={2}
                    value={siteContent.joinNetwork?.bannerSubtitle?.mr || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      joinNetwork: {
                        ...defaultSiteContent.joinNetwork,
                        ...siteContent.joinNetwork,
                        bannerSubtitle: { ...(siteContent.joinNetwork?.bannerSubtitle || {}), mr: e.target.value }
                      }
                    })}
                    className="border border-slate-200 rounded-lg p-2 text-xs bg-white resize-none"
                    placeholder="कृषी सेवा केंद्र, डीलरशिप, वितरण व्यवस्था..."
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500">Banner Subtitle (English)</label>
                  <textarea
                    rows={2}
                    value={siteContent.joinNetwork?.bannerSubtitle?.en || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      joinNetwork: {
                        ...defaultSiteContent.joinNetwork,
                        ...siteContent.joinNetwork,
                        bannerSubtitle: { ...(siteContent.joinNetwork?.bannerSubtitle || {}), en: e.target.value }
                      }
                    })}
                    className="border border-slate-200 rounded-lg p-2 text-xs bg-white resize-none"
                    placeholder="Partner with Prachi Agro Industries..."
                  />
                </div>
              </div>

              {/* 4 Benefit Badges */}
              <div className="border-t border-emerald-200/60 pt-3">
                <label className="text-xs font-black text-emerald-900 uppercase tracking-wide block mb-2">
                  ४ फायदे / वैशिष्ट्य बॅजेस (4 Benefits Badges)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">बॅज १ (MR / EN)</label>
                    <input
                      type="text"
                      value={siteContent.joinNetwork?.benefit1?.mr || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        joinNetwork: {
                          ...defaultSiteContent.joinNetwork,
                          ...siteContent.joinNetwork,
                          benefit1: { ...(siteContent.joinNetwork?.benefit1 || {}), mr: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-1.5 text-xs bg-white mb-1"
                      placeholder="अधिकृत डीलरशिप"
                    />
                    <input
                      type="text"
                      value={siteContent.joinNetwork?.benefit1?.en || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        joinNetwork: {
                          ...defaultSiteContent.joinNetwork,
                          ...siteContent.joinNetwork,
                          benefit1: { ...(siteContent.joinNetwork?.benefit1 || {}), en: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-1.5 text-xs bg-white"
                      placeholder="Authorized Dealership"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">बॅज २ (MR / EN)</label>
                    <input
                      type="text"
                      value={siteContent.joinNetwork?.benefit2?.mr || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        joinNetwork: {
                          ...defaultSiteContent.joinNetwork,
                          ...siteContent.joinNetwork,
                          benefit2: { ...(siteContent.joinNetwork?.benefit2 || {}), mr: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-1.5 text-xs bg-white mb-1"
                      placeholder="आकर्षक मार्जिन"
                    />
                    <input
                      type="text"
                      value={siteContent.joinNetwork?.benefit2?.en || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        joinNetwork: {
                          ...defaultSiteContent.joinNetwork,
                          ...siteContent.joinNetwork,
                          benefit2: { ...(siteContent.joinNetwork?.benefit2 || {}), en: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-1.5 text-xs bg-white"
                      placeholder="Attractive Margins"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">बॅज ३ (MR / EN)</label>
                    <input
                      type="text"
                      value={siteContent.joinNetwork?.benefit3?.mr || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        joinNetwork: {
                          ...defaultSiteContent.joinNetwork,
                          ...siteContent.joinNetwork,
                          benefit3: { ...(siteContent.joinNetwork?.benefit3 || {}), mr: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-1.5 text-xs bg-white mb-1"
                      placeholder="दर्जेदार उत्पादने"
                    />
                    <input
                      type="text"
                      value={siteContent.joinNetwork?.benefit3?.en || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        joinNetwork: {
                          ...defaultSiteContent.joinNetwork,
                          ...siteContent.joinNetwork,
                          benefit3: { ...(siteContent.joinNetwork?.benefit3 || {}), en: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-1.5 text-xs bg-white"
                      placeholder="Premium Quality"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">बॅज ४ (MR / EN)</label>
                    <input
                      type="text"
                      value={siteContent.joinNetwork?.benefit4?.mr || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        joinNetwork: {
                          ...defaultSiteContent.joinNetwork,
                          ...siteContent.joinNetwork,
                          benefit4: { ...(siteContent.joinNetwork?.benefit4 || {}), mr: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-1.5 text-xs bg-white mb-1"
                      placeholder="पूर्ण विक्री सहाय्य"
                    />
                    <input
                      type="text"
                      value={siteContent.joinNetwork?.benefit4?.en || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        joinNetwork: {
                          ...defaultSiteContent.joinNetwork,
                          ...siteContent.joinNetwork,
                          benefit4: { ...(siteContent.joinNetwork?.benefit4 || {}), en: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-1.5 text-xs bg-white"
                      placeholder="Sales Support"
                    />
                  </div>
                </div>
              </div>

              {/* Network Regions & Districts List */}
              <div className="border-t border-emerald-200/60 pt-3">
                <label className="text-xs font-black text-emerald-900 uppercase tracking-wide block mb-2">
                  वितरण क्षेत्र व जिल्हे (Regions & Distribution Zones List)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">जिल्ह्यांची यादी (मराठी - स्वल्पविरामाने वेगळे करा)</label>
                    <input
                      type="text"
                      value={siteContent.joinNetwork?.regionsList?.mr || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        joinNetwork: {
                          ...defaultSiteContent.joinNetwork,
                          ...siteContent.joinNetwork,
                          regionsList: { ...(siteContent.joinNetwork?.regionsList || {}), mr: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs bg-white font-medium"
                      placeholder="पुणे, नाशिक, छ. संभाजीनगर, सोलापूर, कोल्हापूर, नागपूर"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">Districts List (English - Comma separated)</label>
                    <input
                      type="text"
                      value={siteContent.joinNetwork?.regionsList?.en || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        joinNetwork: {
                          ...defaultSiteContent.joinNetwork,
                          ...siteContent.joinNetwork,
                          regionsList: { ...(siteContent.joinNetwork?.regionsList || {}), en: e.target.value }
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs bg-white font-medium"
                      placeholder="Pune, Nashik, Chh. Sambhajinagar, Solapur, Kolhapur, Nagpur"
                    />
                  </div>
                </div>
              </div>

              {/* Direct Contact Numbers & Email */}
              <div className="border-t border-emerald-200/60 pt-3">
                <label className="text-xs font-black text-emerald-900 uppercase tracking-wide block mb-2">
                  थेट संपर्क माहिती (Direct Contact Phone, Email & WhatsApp)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">कॉल नंबर (Phone)</label>
                    <input
                      type="text"
                      value={siteContent.joinNetwork?.directPhone || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        joinNetwork: {
                          ...defaultSiteContent.joinNetwork,
                          ...siteContent.joinNetwork,
                          directPhone: e.target.value
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs bg-white font-bold"
                      placeholder="9021605160"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">WhatsApp नंबर</label>
                    <input
                      type="text"
                      value={siteContent.joinNetwork?.directWhatsapp || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        joinNetwork: {
                          ...defaultSiteContent.joinNetwork,
                          ...siteContent.joinNetwork,
                          directWhatsapp: e.target.value
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs bg-white font-bold"
                      placeholder="9021605160"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">अधिकृत ईमेल (Email)</label>
                    <input
                      type="email"
                      value={siteContent.joinNetwork?.directEmail || ''}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        joinNetwork: {
                          ...defaultSiteContent.joinNetwork,
                          ...siteContent.joinNetwork,
                          directEmail: e.target.value
                        }
                      })}
                      className="border border-slate-200 rounded-lg p-2 text-xs bg-white font-bold"
                      placeholder="info@prachiagroindustries.in"
                    />
                  </div>
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

          {/* Search Filter for Dealers */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={dealerSearch}
              onChange={(e) => setDealerSearch(e.target.value)}
              placeholder="🔍 शोधा: डीलरचे नाव, दुकानाचे नाव, फोन नंबर किंवा शहर (Search dealers)..."
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-brand-green-dark font-medium"
            />
            {dealerSearch && (
              <button 
                onClick={() => setDealerSearch('')} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-3 py-2 rounded-xl cursor-pointer"
              >
                Clear
              </button>
            )}
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
                  {usersList
                    .filter(usr => 
                      (usr.name && usr.name.toLowerCase().includes(dealerSearch.toLowerCase())) ||
                      (usr.businessName && usr.businessName.toLowerCase().includes(dealerSearch.toLowerCase())) ||
                      (usr.city && usr.city.toLowerCase().includes(dealerSearch.toLowerCase())) ||
                      (usr.district && usr.district.toLowerCase().includes(dealerSearch.toLowerCase())) ||
                      (usr.phone && usr.phone.includes(dealerSearch))
                    )
                    .map((usr) => (
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
                  className="border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-brand-green-dark bg-white font-semibold"
                >
                  {categoriesList.map(cat => (
                    <option key={cat.id || cat.slug || cat._id} value={cat.slug || cat.id}>
                      {cat.title?.[language] || cat.title?.mr || cat.title?.en || cat.id}
                    </option>
                  ))}
                  <option value="other">इतर (Other)</option>
                </select>
              </div>

              {/* Taglines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Tagline (Marathi - ऐच्छिक)</label>
                  <input 
                    type="text" 
                    value={productForm.tagline_mr} 
                    onChange={(e) => setProductForm({ ...productForm, tagline_mr: e.target.value })}
                    placeholder="उदा. विशेष पीक टॉनिक"
                    className="border border-slate-200 rounded p-2 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Tagline (English - Optional)</label>
                  <input 
                    type="text" 
                    value={productForm.tagline_en} 
                    onChange={(e) => setProductForm({ ...productForm, tagline_en: e.target.value })}
                    placeholder="e.g. Plant Growth Promoter"
                    className="border border-slate-200 rounded p-2 text-xs"
                  />
                </div>
              </div>

              {/* Dynamic Pack Sizes & Dual Pricing Section */}
              <div className="flex flex-col gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-brand-green-dark uppercase tracking-wide flex items-center gap-1.5">
                    <span>📦</span>
                    <span>पॅक आकार व किमती (Quantity Options & Dual Pricing)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setProductForm(prev => ({
                        ...prev,
                        packSizes: [...(prev.packSizes || []), { size: '', price: '', originalPrice: '' }]
                      }));
                    }}
                    className="bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Plus size={12} />
                    <span>+ नवीन ऑप्शन जोडा</span>
                  </button>
                </div>
                
                {/* Preset Quick Chips */}
                <div className="flex flex-col gap-1 text-[10px]">
                  <span className="font-bold text-slate-500">जलद आकार निवडा (Quick Preset Options):</span>
                  <div className="flex flex-wrap gap-1">
                    {['250 ml', '500 ml', '1 L', '5 L', '250 g', '500 g', '1 kg', '5 kg', '10 kg'].map((presetSize) => (
                      <button
                        type="button"
                        key={presetSize}
                        onClick={() => {
                          const existing = productForm.packSizes || [];
                          if (!existing.some(p => p.size === presetSize)) {
                            setProductForm(prev => ({
                              ...prev,
                              packSizes: [...(prev.packSizes || []), { size: presetSize, price: '', originalPrice: '' }]
                            }));
                          }
                        }}
                        className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-brand-green-dark font-extrabold border border-slate-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        + {presetSize}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pack Size Rows */}
                {(productForm.packSizes || []).map((pack, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-50 pb-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase">ऑप्शन #{idx + 1} {idx === 0 ? '(मुख्य)' : ''}</span>
                      {(productForm.packSizes || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setProductForm(prev => ({
                              ...prev,
                              packSizes: prev.packSizes.filter((_, i) => i !== idx)
                            }));
                          }}
                          className="text-slate-400 hover:text-red-500 p-0.5 transition-colors cursor-pointer"
                          title="Remove option"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {/* Size Name */}
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[9px] font-bold text-slate-500">पॅक प्रमाण (e.g. 1 L, 1 kg)</label>
                        <input
                          type="text"
                          required={idx === 0}
                          value={pack.size}
                          onChange={(e) => {
                            const newPacks = [...(productForm.packSizes || [])];
                            newPacks[idx].size = e.target.value;
                            setProductForm({ ...productForm, packSizes: newPacks });
                          }}
                          placeholder="उदा. 1 L किंवा 1 kg"
                          className="border border-slate-200 rounded p-1.5 text-xs font-bold focus:ring-1 focus:ring-brand-green-dark"
                        />
                      </div>
                      
                      {/* Selling Price */}
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[9px] font-bold text-slate-500">विक्री किंमत ₹ (Selling Price)</label>
                        <input
                          type="number"
                          required={idx === 0}
                          value={pack.price}
                          onChange={(e) => {
                            const newPacks = [...(productForm.packSizes || [])];
                            newPacks[idx].price = e.target.value;
                            setProductForm({ ...productForm, packSizes: newPacks });
                          }}
                          placeholder="उदा. 750"
                          className="border border-slate-200 rounded p-1.5 text-xs font-bold text-brand-green-dark focus:ring-1 focus:ring-brand-green-dark"
                        />
                      </div>

                      {/* Original Price / MRP */}
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[9px] font-bold text-slate-500">मूळ किंमत / MRP ₹ (Original MRP)</label>
                        <input
                          type="number"
                          value={pack.originalPrice}
                          onChange={(e) => {
                            const newPacks = [...(productForm.packSizes || [])];
                            newPacks[idx].originalPrice = e.target.value;
                            setProductForm({ ...productForm, packSizes: newPacks });
                          }}
                          placeholder="उदा. 950"
                          className="border border-slate-200 rounded p-1.5 text-xs focus:ring-1 focus:ring-brand-green-dark"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Associated Crops Multi-Select */}
              <div className="flex flex-col gap-2 bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-brand-green-dark uppercase tracking-wide flex items-center gap-1.5">
                    <span>🌾</span>
                    <span>उपयुक्त पिके (Select Multiple Associated Crops)</span>
                  </label>
                  <span className="text-[10px] bg-emerald-100 text-brand-green-dark font-extrabold px-2 py-0.5 rounded-full">
                    {(productForm.associatedCrops || []).length} पिके निवडलेली
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold">
                  या उत्पादनासाठी एक किंवा एकापेक्षा जास्त पिके निवडा. ग्राहक पिकांवर क्लिक केल्यावर हे उत्पादन दिसेल.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto custom-scrollbar p-1">
                  {cropsList.map(c => {
                    const cropKey = c.id || c.tag?.en || c.name?.en || c.name?.mr;
                    const isChecked = (productForm.associatedCrops || []).includes(cropKey);
                    const cropName = c.name?.[language] || c.name?.mr || c.name?.en || c.id;
                    return (
                      <label key={c.id || c._id} className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${isChecked ? 'bg-emerald-100 border-emerald-400 text-brand-green-dark' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const current = productForm.associatedCrops || [];
                            if (e.target.checked) {
                              setProductForm({ ...productForm, associatedCrops: [...current, cropKey] });
                            } else {
                              setProductForm({ ...productForm, associatedCrops: current.filter(k => k !== cropKey) });
                            }
                          }}
                          className="rounded text-brand-green-dark focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="text-sm flex-shrink-0">{c.logo || '🌱'}</span>
                        <span className="truncate">{cropName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Crops Description Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Crops Detail Text (Marathi - ऐच्छिक)</label>
                  <input type="text" value={productForm.crops_mr} onChange={(e) => setProductForm({ ...productForm, crops_mr: e.target.value })} placeholder="कापूस, सोयाबीन, कांदा" className="border border-slate-200 rounded p-2 text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Crops Detail Text (English - Optional)</label>
                  <input type="text" value={productForm.crops_en} onChange={(e) => setProductForm({ ...productForm, crops_en: e.target.value })} placeholder="Cotton, Soybean, Onion" className="border border-slate-200 rounded p-2 text-xs" />
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
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="flex-1 bg-brand-green-dark hover:bg-brand-green-light disabled:bg-slate-400 text-white font-extrabold text-xs py-2.5 rounded-lg cursor-pointer transition-colors shadow flex items-center justify-center gap-2"
                >
                  {isSubmittingProduct ? (
                    <span>{language === 'mr' ? 'जतन करत आहे...' : 'Saving to Database...'}</span>
                  ) : (
                    <span>{isEditingProduct ? 'सुधारणा सेव्ह करा (Update)' : 'उत्पादन जोडा (Save Product)'}</span>
                  )}
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-800 text-base">
                विद्यमान उत्पादने (Existing Products: {productsList.length})
              </h2>
            </div>

            {/* Quick Search Filter for Products */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="🔍 शोधा: उत्पादनाचे नाव किंवा प्रकार (Search products)..."
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-brand-green-dark font-medium"
              />
              {productSearch && (
                <button 
                  onClick={() => setProductSearch('')} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-3 py-2 rounded-xl cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3 max-h-[650px] overflow-y-auto custom-scrollbar pr-1">
              {productsList
                .filter(p => 
                  p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                  (p.category && p.category.toLowerCase().includes(productSearch.toLowerCase())) ||
                  (p.crops?.mr && p.crops.mr.toLowerCase().includes(productSearch.toLowerCase()))
                )
                .map((prod) => (
                <div key={prod.id || prod._id} className="flex items-center justify-between p-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl p-1 flex items-center justify-center flex-shrink-0">
                      <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain" onError={(e) => { e.target.src = '/assets/logo.png'; }} />
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
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-brand-green-dark rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer transition-colors border border-emerald-200/60"
                      title="Edit Product"
                    >
                      <Edit size={13} />
                      <span>एडिट (Edit)</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id || prod._id)}
                      className="p-1.5 text-slate-400 hover:text-brand-magenta hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* 4. Tab Contents: CATEGORIES                                   */}
      {/* ============================================================ */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add / Edit Category Form */}
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3 flex items-center gap-2">
              <Tag className="text-teal-600" size={18} />
              <span>{isEditingCategory ? 'श्रेणी सुधारित करा (Edit Category)' : 'नवीन श्रेणी जोडा (Add Category)'}</span>
            </h2>

            <form onSubmit={handleCategorySubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Category Title (Marathi)</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. कृषी टॉनिक व वाढ संजीवक"
                  value={categoryForm.title_mr}
                  onChange={(e) => setCategoryForm({ ...categoryForm, title_mr: e.target.value })}
                  className="border border-slate-200 rounded p-2 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Category Title (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plant Tonics & Growth Promoters"
                  value={categoryForm.title_en}
                  onChange={(e) => setCategoryForm({ ...categoryForm, title_en: e.target.value })}
                  className="border border-slate-200 rounded p-2 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Subtitle (Marathi)</label>
                <input
                  type="text"
                  placeholder="उदा. फुलधारणा, फळांची फुगवण व जोमदार वाढ"
                  value={categoryForm.subtitle_mr}
                  onChange={(e) => setCategoryForm({ ...categoryForm, subtitle_mr: e.target.value })}
                  className="border border-slate-200 rounded p-2 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Subtitle (English)</label>
                <input
                  type="text"
                  placeholder="e.g. Flowering, Fruit Sizing & Growth"
                  value={categoryForm.subtitle_en}
                  onChange={(e) => setCategoryForm({ ...categoryForm, subtitle_en: e.target.value })}
                  className="border border-slate-200 rounded p-2 text-xs"
                />
              </div>

              {/* Icon Image Section */}
              <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  श्रेणी आयकॉन फोटो (Category Icon SVG / Image)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCategoryImageFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-teal-700 file:text-white cursor-pointer border border-slate-200 rounded bg-white p-1"
                />
                <input
                  type="text"
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  placeholder="/assets/categories/growth.svg"
                  className="border border-slate-200 rounded p-2 text-xs bg-white"
                />
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  type="submit"
                  className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs py-2.5 rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Tag size={15} />
                  <span>{isEditingCategory ? 'सुधारणा सेव्ह करा (Update)' : 'श्रेणी जोडा (Save Category)'}</span>
                </button>
                {isEditingCategory && (
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs px-3 rounded-xl font-bold cursor-pointer"
                  >
                    रद्द (Cancel)
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Categories Directory */}
          <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3 flex items-center justify-between">
              <span>श्रेणी सूची (Categories Directory: {categoriesList.length})</span>
            </h2>
            <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
              {categoriesList.map((cat) => {
                const titleText = cat.title?.[language] || cat.title?.mr || cat.title?.en;
                const subtitleText = cat.subtitle?.[language] || cat.subtitle?.mr || cat.subtitle?.en;

                return (
                  <div key={cat.id || cat._id} className="flex items-center justify-between p-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-12 h-12 bg-teal-50 rounded-xl p-2 flex items-center justify-center flex-shrink-0 border border-teal-100">
                        <img
                          src={cat.image}
                          alt={titleText}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => { e.target.src = '/assets/categories/growth.svg'; }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-slate-800 text-xs truncate">{titleText}</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5 truncate max-w-xs">{subtitleText}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleEditCategory(cat)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-brand-green-dark rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer transition-colors border border-emerald-200/60"
                      >
                        <Edit size={13} />
                        <span>एडिट</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id || cat._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. Tab Contents: CROPS MANAGEMENT                            */}
      {/* ============================================================ */}
      {activeTab === 'crops' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Crop Form */}
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3 flex items-center gap-2">
              <Sparkles className="text-emerald-600" size={18} />
              <span>नवीन पीक जोडा (Add New Crop)</span>
            </h2>

            <form onSubmit={handleCropSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Crop Name (Marathi)</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. सोयाबीन (Soybean)"
                  value={cropForm.name_mr}
                  onChange={(e) => setCropForm({ ...cropForm, name_mr: e.target.value })}
                  className="border border-slate-200 rounded p-2 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Crop Name (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Soybean"
                  value={cropForm.name_en}
                  onChange={(e) => setCropForm({ ...cropForm, name_en: e.target.value })}
                  className="border border-slate-200 rounded p-2 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Crop Logo Emoji / Icon</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="उदा. 🫘, 🧅, 🎋, 🌾"
                    value={cropForm.logo}
                    onChange={(e) => setCropForm({ ...cropForm, logo: e.target.value })}
                    className="border border-slate-200 rounded p-2 text-xs flex-1 font-extrabold text-center text-lg"
                  />
                  <div className="flex items-center justify-center border border-slate-200 rounded p-2 text-xl bg-slate-50 w-12">
                    {cropForm.logo || '🌱'}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {['🧅', '🎋', '🍅', '🍈', '🌶️', '🌿', '🫘', '🍎', '🍌', '🍇', '🌾', '🌽', '🥭'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setCropForm({ ...cropForm, logo: emoji })}
                      className="p-1 text-sm bg-slate-50 hover:bg-emerald-100 rounded border border-slate-200 cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Feature Tag / Solution (Marathi)</label>
                <input
                  type="text"
                  placeholder="उदा. शेंगांची संख्या व दाणे भरणी"
                  value={cropForm.tag_mr}
                  onChange={(e) => setCropForm({ ...cropForm, tag_mr: e.target.value })}
                  className="border border-slate-200 rounded p-2 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Feature Tag / Solution (English)</label>
                <input
                  type="text"
                  placeholder="e.g. Pod formation & grain filling"
                  value={cropForm.tag_en}
                  onChange={(e) => setCropForm({ ...cropForm, tag_en: e.target.value })}
                  className="border border-slate-200 rounded p-2 text-xs"
                />
              </div>

              <button
                type="submit"
                className="bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold text-xs py-2.5 rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center gap-1.5 mt-2"
              >
                <Plus size={15} />
                <span>पीक जोडा (Save Crop)</span>
              </button>
            </form>
          </div>

          {/* Crops Directory */}
          <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3 flex items-center justify-between">
              <span>उपलब्ध पिके (Crops Directory: {cropsList.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
              {cropsList.map((crop) => {
                const nameText = crop.name?.[language] || crop.name?.mr || crop.name?.en || crop.id;
                const tagText = crop.tag?.[language] || crop.tag?.mr || crop.tag?.en;

                return (
                  <div key={crop.id || crop._id} className="flex items-center justify-between p-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors bg-white shadow-xs">
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-emerald-100 text-xl">
                        {crop.logo || '🌱'}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-slate-800 text-xs truncate">{nameText}</h4>
                        {tagText && (
                          <p className="text-[10px] text-brand-magenta font-bold truncate max-w-xs mt-0.5">{tagText}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCrop(crop.id || crop._id)}
                      className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      title="Delete Crop"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}



      {/* ============================================================ */}
      {/* 5. Tab Contents: VIDEOS                                       */}
      {/* ============================================================ */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Video Form */}
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3 flex items-center gap-2">
              <Video className="text-red-600" size={18} />
              <span>नवीन युट्युब व्हिडिओ जोडा (Add YouTube Video)</span>
            </h2>
            
            <form onSubmit={handleVideoSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Video Title (Marathi)</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. AGRISULF सल्फर २०% चे फायदे"
                  value={videoForm.title_mr}
                  onChange={(e) => setVideoForm({ ...videoForm, title_mr: e.target.value })}
                  className="border border-slate-200 rounded p-2 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Video Title (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AGRISULF Sulphur 20% Benefits Guide"
                  value={videoForm.title_en}
                  onChange={(e) => setVideoForm({ ...videoForm, title_en: e.target.value })}
                  className="border border-slate-200 rounded p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Crop (Marathi)</label>
                  <input
                    type="text"
                    placeholder="उदा. सोयाबीन, कांदा"
                    value={videoForm.crop_mr}
                    onChange={(e) => setVideoForm({ ...videoForm, crop_mr: e.target.value })}
                    className="border border-slate-200 rounded p-2 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Crop (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. Soybean, Onion"
                    value={videoForm.crop_en}
                    onChange={(e) => setVideoForm({ ...videoForm, crop_en: e.target.value })}
                    className="border border-slate-200 rounded p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                  <select
                    value={videoForm.category_mr}
                    onChange={(e) => setVideoForm({ ...videoForm, category_mr: e.target.value, category_en: e.target.value === 'उत्पादन माहिती' ? 'Product Info' : 'Crop Guidance' })}
                    className="border border-slate-200 rounded p-2 text-xs bg-white"
                  >
                    <option value="पीक मार्गदर्शन">पीक मार्गदर्शन (Crop Guidance)</option>
                    <option value="उत्पादन माहिती">उत्पादन माहिती (Product Info)</option>
                    <option value="शेतकरी मार्गदर्शन">शेतकरी मार्गदर्शन (Farmer Guidance)</option>
                    <option value="कीड व रोग व्यवस्थापन">कीड व रोग व्यवस्थापन (Pest & Disease)</option>
                    <option value="खत व्यवस्थापन">खत व्यवस्थापन (Fertilizer)</option>
                    <option value="प्राची अॅग्रो उत्पादने">प्राची अॅग्रो उत्पादने (Prachi Products)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Duration (e.g. 08:15)</label>
                  <input
                    type="text"
                    placeholder="08:15"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    className="border border-slate-200 rounded p-2 text-xs"
                  />
                </div>
              </div>

              {/* YouTube Video Link Input */}
              <div className="flex flex-col gap-1.5 bg-red-50/50 p-3.5 rounded-2xl border border-red-200/60">
                <label className="text-[11px] font-black text-red-700 uppercase tracking-wide flex items-center gap-1.5">
                  <span>🎥</span>
                  <span>युट्युब व्हिडिओ लिंक (YouTube URL or Embed Code)</span>
                </label>
                <input
                  type="text"
                  required
                  value={videoForm.youtubeUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=ScMzIvxBSi4 किंवा <iframe...>"
                  className="border border-slate-200 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-red-500 font-medium"
                />
                <p className="text-[10px] text-slate-500 font-bold">
                  युट्युब वरील कोणतीही व्हिडिओ लिंक अथवा embed कोड येथे पेस्ट करा. व्हिडिओ गॅलरीमध्ये आपोआप प्ले होईल.
                </p>
              </div>

              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2.5 rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center gap-1.5 mt-1"
              >
                <Video size={15} />
                <span>व्हिडिओ जोडा (Save Video)</span>
              </button>
            </form>
          </div>

          {/* Videos Directory */}
          <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
            <h2 className="font-extrabold text-slate-800 text-base border-b border-slate-50 pb-3 flex items-center justify-between">
              <span>व्हिडिओ सूची (Videos Directory: {videosList.length})</span>
            </h2>
            <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
              {videosList.map((v) => {
                const titleText = typeof v.title === 'object' ? (v.title[language] || v.title.mr || v.title.en) : v.title;
                const embedId = v.embedId || extractEmbedId(v.youtubeUrl);

                return (
                  <div key={v.id || v._id} className="flex items-center justify-between p-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-16 h-12 bg-slate-900 rounded-xl overflow-hidden flex-shrink-0 relative border border-slate-200">
                        <img
                          src={v.thumbnail || (embedId ? `https://i.ytimg.com/vi/${embedId}/hqdefault.jpg` : '')}
                          alt={titleText}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&q=80&w=400'; }}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <PlayCircle size={16} className="text-white fill-red-600" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-slate-800 text-xs truncate">{titleText}</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                          {typeof v.category === 'object' ? v.category[language] : v.category} • {typeof v.crop === 'object' ? v.crop[language] : v.crop}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteVideo(v.id || v._id)}
                      className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors flex-shrink-0"
                      title="Delete Video"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
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

              {/* Blog Cover Image Section */}
              <div className="flex flex-col gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <label className="text-[11px] font-black text-brand-green-dark uppercase tracking-wide flex items-center gap-1.5">
                  <span>🖼️</span>
                  <span>ब्लॉगचा फोटो (Blog Cover Image)</span>
                </label>

                {/* Option 1: File Upload */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500">
                    १. संगणक किंवा मोबाईलवरून फोटो निवडा (Choose File):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBlogImageFileUpload}
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
                    २. फोटोची वेब URL किंवा पाथ (Image URL / Path):
                  </label>
                  <input
                    type="text"
                    value={blogForm.image}
                    onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="border border-slate-200 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-brand-green-dark"
                  />
                </div>

                {/* Live Image Preview */}
                {blogForm.image && (
                  <div className="flex items-center gap-3 mt-1 p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <div className="w-14 h-14 rounded-lg bg-slate-50 p-1 flex items-center justify-center border border-slate-200 flex-shrink-0 overflow-hidden">
                      <img
                        src={blogForm.image}
                        alt="Blog Preview"
                        className="max-w-full max-h-full object-cover rounded"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=400'; }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-black text-brand-green-dark uppercase">फोटो प्रिव्ह्यू (Live Preview)</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[210px]">{blogForm.image}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* YouTube Video Link Field */}
              <div className="flex flex-col gap-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <label className="text-[11px] font-black text-brand-green-dark uppercase tracking-wide flex items-center gap-1.5">
                  <span>🎥</span>
                  <span>युट्युब व्हिडिओ लिंक (YouTube Video Link - Optional)</span>
                </label>
                <input
                  type="text"
                  value={blogForm.youtubeUrl}
                  onChange={(e) => setBlogForm({ ...blogForm, youtubeUrl: e.target.value })}
                  placeholder="उदा. https://www.youtube.com/watch?v=5jVj-wppI5E किंवा <iframe...>"
                  className="border border-slate-200 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-brand-green-dark font-medium"
                />
                <p className="text-[10px] text-slate-400 font-bold">
                  ही लिंक टाकल्यास ब्लॉग वाचताना सर्वात शेवटी युट्युब व्हिडिओ प्लेअर दिसेल.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Excerpt (Marathi)</label>
                <textarea rows="2" required value={blogForm.excerpt_mr} onChange={(e) => setBlogForm({...blogForm, excerpt_mr: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Excerpt (English)</label>
                <textarea rows="2" value={blogForm.excerpt_en} onChange={(e) => setBlogForm({...blogForm, excerpt_en: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Full Content (Marathi)</label>
                <textarea rows="4" required value={blogForm.content_mr} onChange={(e) => setBlogForm({...blogForm, content_mr: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Full Content (English)</label>
                <textarea rows="4" value={blogForm.content_en} onChange={(e) => setBlogForm({...blogForm, content_en: e.target.value})} className="border border-slate-200 rounded p-2 text-xs" />
              </div>
              <button type="submit" className="bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold text-xs py-2.5 rounded-lg cursor-pointer transition-all shadow-md">ब्लॉग सेव्ह करा (Save Blog Post)</button>
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
