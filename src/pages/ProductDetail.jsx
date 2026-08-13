import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, MessageCircle, Star, Shield, HelpCircle, Truck, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { getProducts } from '../data/products';

const ProductDetail = () => {
  const { id } = useParams();
  const [productsList, setProductsList] = useState([]);
  useEffect(() => {
    setProductsList(getProducts());
  }, []);
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Find product
  const product = productsList.find(p => p.id === id);

  // States
  const [selectedPack, setSelectedPack] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  // Initialize selected pack size once product is loaded
  useEffect(() => {
    if (product) {
      setSelectedPack(product.packSizes[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto">
        <h3 className="font-extrabold text-slate-800 text-lg mb-2">
          उत्पादन सापडले नाही!
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          The requested product could not be found. Check if the URL is correct or browse our catalog.
        </p>
        <Link
          to="/products"
          className="bg-brand-green-dark hover:bg-brand-green-light text-white font-bold text-sm px-6 py-2.5 rounded-full cursor-pointer transition-all inline-block shadow-md"
        >
          {t('backToProducts')}
        </Link>
      </div>
    );
  }

  const handlePackSelect = (pack) => {
    setSelectedPack(pack);
  };

  const handleAddToCart = () => {
    if (selectedPack) {
      addToCart(product, selectedPack, quantity);
    }
  };

  const handleWhatsAppOrder = () => {
    if (!selectedPack) return;
    const message = `नमस्कार Prachi Agro Industries,
मला खालील उत्पादन ऑर्डर करायचे आहे:
उत्पादन: ${product.name}
पॅक आकार: ${selectedPack.size}
प्रमाण: ${quantity}
कृपया किंमत आणि उपलब्धता कळवा.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/9284845035?text=${encodedMessage}`, '_blank');
  };

  // Compute related products
  const relatedProducts = productsList
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-10 text-left">
      {/* Back Link */}
      <div>
        <Link 
          to="/products" 
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-brand-green-dark text-xs sm:text-sm font-bold transition-colors"
        >
          <ArrowLeft size={16} />
          <span>{t('backToProducts')}</span>
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
        
        {/* Left Column: Product Image Gallery */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-8 overflow-hidden group">
            <img 
              src={product.image} 
              alt={product.name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=Agri+Product' }}
            />
          </div>
          
          {/* Thumbnails (Mock application slides) */}
          <div className="flex gap-3">
            <div className="w-16 h-16 rounded-lg border-2 border-brand-green-dark p-1 flex items-center justify-center bg-slate-50 cursor-pointer">
              <img src={product.image} alt="thumbnail 1" className="max-h-full max-w-full object-contain" onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Agri' }} />
            </div>
            <div className="w-16 h-16 rounded-lg border border-slate-200 p-1 flex items-center justify-center bg-slate-50 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
              <img src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&q=80&w=100" alt="application crop" className="w-full h-full object-cover rounded" />
            </div>
            <div className="w-16 h-16 rounded-lg border border-slate-200 p-1 flex items-center justify-center bg-slate-50 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
              <img src="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=100" alt="field" className="w-full h-full object-cover rounded" />
            </div>
          </div>
        </div>

        {/* Right Column: Order Panel */}
        <div className="md:col-span-7 flex flex-col gap-5">
          
          {/* Title and Badges */}
          <div>
            <span className="bg-emerald-50 text-brand-green-dark text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full">
              {t(product.tagline)}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mt-3 mb-1">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'} 
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-500">
                {product.rating} ({product.reviewsCount} {t('reviewsLabel')})
              </span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-slate-500 text-sm leading-relaxed border-b border-slate-100 pb-5">
            {t(product.shortDescription)}
          </p>

          {/* Pack Size Selection */}
          {selectedPack && (
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                पॅक निवडा ({t('packSize')}):
              </span>
              <div className="flex flex-wrap gap-2.5">
                {product.packSizes.map((pack) => (
                  <button
                    key={pack.size}
                    onClick={() => handlePackSelect(pack)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                      selectedPack.size === pack.size
                        ? 'border-brand-green-dark bg-emerald-50/50 text-brand-green-dark shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pack.size} - <span className="font-extrabold">₹{pack.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price details */}
          {selectedPack && (
            <div className="mt-2 bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">किंमत (Price)</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-brand-green-dark">
                    ₹{selectedPack.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{Math.round(selectedPack.price * (product.originalPrice / product.basePrice))}
                    </span>
                  )}
                </div>
              </div>
              
              {product.originalPrice && (
                <span className="bg-brand-magenta text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-sm">
                  {Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="flex flex-wrap items-center gap-4 mt-2">
            {/* Quantity adjustment */}
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden h-11 bg-white shadow-sm">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3.5 h-full bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold active:bg-slate-200 transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="px-5 font-bold text-slate-700 text-sm">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-3.5 h-full bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold active:bg-slate-200 transition-colors cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Add To Cart */}
            <button
              onClick={handleAddToCart}
              className="flex-1 min-w-[150px] bg-brand-green-dark hover:bg-brand-green-light active:scale-95 text-white font-bold h-11 px-6 rounded-lg flex items-center justify-center gap-2 cursor-pointer border border-brand-green-dark shadow-md shadow-emerald-800/5 transition-all"
            >
              <ShoppingCart size={16} />
              <span>{t('addToCart')}</span>
            </button>
          </div>

          {/* Main WhatsApp Button */}
          <button
            onClick={handleWhatsAppOrder}
            className="w-full bg-brand-magenta hover:bg-brand-magenta-dark active:scale-[0.98] text-white font-extrabold h-11 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
          >
            <MessageCircle size={18} className="fill-current" />
            <span>{t('whatsAppOrder')}</span>
          </button>

          {/* Quick Badges Strip */}
          <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-5 text-[10px] sm:text-xs text-slate-400 font-bold text-center">
            <div className="flex flex-col items-center gap-1.5">
              <Shield size={16} className="text-brand-green-dark" />
              <span>१००% मूळ उत्पादन</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Truck size={16} className="text-brand-green-dark" />
              <span>जलद होम डिलिव्हरी</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <HeartHandshake size={16} className="text-brand-green-dark" />
              <span>विश्वसनीय गुणवत्ता</span>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs Section: Details, Benefits, Usage */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 md:flex-none px-6 py-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'border-brand-green-dark text-brand-green-dark bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {language === 'mr' ? 'माहिती व फायदे' : 'Description & Benefits'}
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`flex-1 md:flex-none px-6 py-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'usage'
                ? 'border-brand-green-dark text-brand-green-dark bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('usageInstructions')}
          </button>
          <button
            onClick={() => setActiveTab('crops')}
            className={`flex-1 md:flex-none px-6 py-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'crops'
                ? 'border-brand-green-dark text-brand-green-dark bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('suitableCrops')}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          {activeTab === 'details' && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-2.5 border-l-3 border-brand-green-dark pl-2">
                  उत्पादन माहिती (Product Description)
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {t(product.description)}
                </p>
              </div>

              {product.benefits && (
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-3.5 border-l-3 border-brand-green-dark pl-2">
                    मुख्य फायदे (Key Benefits)
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {t(product.benefits).map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-slate-600 text-sm leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green-bright mt-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="flex flex-col gap-4">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-1 border-l-3 border-brand-green-dark pl-2">
                वापरण्याची पद्धत आणि डोस (Usage Directions)
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
                <HelpCircle className="text-amber-500 mt-0.5 flex-shrink-0" size={18} />
                <span>{t(product.usage)}</span>
              </p>
              <p className="text-xs text-slate-400 font-bold mt-2">
                *टीप: उत्पादनाचा अचूक डोस ठरवण्यासाठी किंवा संशयास्पद परिस्थितीत जवळच्या कृषी सहाय्यकाचा किंवा आमच्या तज्ज्ञांचा सल्ला घ्यावा.
              </p>
            </div>
          )}

          {activeTab === 'crops' && (
            <div className="flex flex-col gap-4">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-1 border-l-3 border-brand-green-dark pl-2">
                शिफारस केलेली पिके (Suitable Crops)
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t(product.crops)}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="flex flex-col mb-6">
            <h2 className="text-xl md:text-2xl font-black text-brand-green-dark tracking-tight">
              {t('relatedProducts')}
            </h2>
            <div className="h-0.5 w-12 bg-brand-magenta mt-2 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <div 
                key={p.id}
                onClick={() => {
                  navigate(`/products/${p.id}`);
                  window.scrollTo(0,0);
                }}
                className="bg-white border border-slate-100 rounded-xl overflow-hidden p-4 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between"
              >
                <div className="aspect-square bg-slate-50 rounded-lg flex items-center justify-center p-4 mb-3">
                  <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Agri' }} />
                </div>
                <div className="text-center">
                  <h4 className="font-extrabold text-slate-800 text-sm truncate">{p.name}</h4>
                  <p className="text-xs text-brand-green-dark font-black mt-1">₹{p.basePrice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;
