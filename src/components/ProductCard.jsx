import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  
  // State for selected pack size, defaulting to the first option
  const [selectedPack, setSelectedPack] = useState(product.packSizes[0]);
  const [quantity, setQuantity] = useState(1);

  // Compute discount percentage if original price exists
  const discountPercent = Math.round(
    ((product.originalPrice - product.basePrice) / product.originalPrice) * 100
  );

  const handlePackChange = (e) => {
    const packSizeStr = e.target.value;
    const pack = product.packSizes.find(p => p.size === packSizeStr);
    setSelectedPack(pack);
  };

  const handleWhatsAppOrder = () => {
    const message = `नमस्कार Prachi Agro Industries,
मला खालील उत्पादन ऑर्डर करायचे आहे:
उत्पादन: ${product.name}
पॅक आकार: ${selectedPack.size}
प्रमाण: ${quantity}
कृपया किंमत आणि उपलब्धता कळवा.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/9284845035?text=${encodedMessage}`, '_blank');
  };

  const handleAddToCart = () => {
    addToCart(product, selectedPack, quantity);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      
      {/* Product Image & Badges */}
      <div className="relative aspect-square bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-brand-magenta text-white font-bold text-[11px] px-2 py-0.5 rounded shadow-sm z-10">
            {discountPercent}% OFF
          </span>
        )}
        
        <Link to={`/products/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = 'https://placehold.co/300x300?text=Agri+Product' }}
          />
        </Link>
        
        {/* Quick View Overlay Button */}
        <Link 
          to={`/products/${product.id}`} 
          className="absolute right-3 bottom-3 bg-white/90 hover:bg-white text-slate-700 hover:text-brand-green-dark p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="View details"
        >
          <Eye size={16} />
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* Tagline/Category */}
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-green-dark/70 mb-1">
          {t(product.tagline)}
        </span>
        
        {/* Product Name */}
        <Link to={`/products/${product.id}`} className="hover:text-brand-green-dark transition-colors">
          <h3 className="font-extrabold text-slate-800 text-base md:text-lg tracking-tight leading-snug">
            {product.name}
          </h3>
        </Link>
        
        {/* Short Description */}
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed flex-grow">
          {t(product.shortDescription)}
        </p>

        {/* Pack Size Selector */}
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-50 pt-3">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t('packSize')}:
          </label>
          <select 
            value={selectedPack.size}
            onChange={handlePackChange}
            className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-green-dark cursor-pointer"
          >
            {product.packSizes.map((pack) => (
              <option key={pack.size} value={pack.size}>
                {pack.size}
              </option>
            ))}
          </select>
        </div>

        {/* Pricing */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-black text-brand-green-dark">
            ₹{selectedPack.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              ₹{Math.round(selectedPack.price * (product.originalPrice / product.basePrice))}
            </span>
          )}
        </div>

        {/* Actions Grid */}
        <div className="mt-4 flex flex-col gap-2">
          {/* Main WhatsApp Button - Primary Accent */}
          <button
            onClick={handleWhatsAppOrder}
            className="w-full bg-brand-magenta hover:bg-brand-magenta-dark active:scale-[0.98] text-white text-xs font-extrabold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow transition-all duration-200"
          >
            {/* SVG WhatsApp icon */}
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.09-3.923l.34.202c1.62.963 3.485 1.472 5.519 1.473 5.485 0 9.948-4.414 9.952-9.84.002-2.628-1.02-5.1-2.877-6.958C17.228 3.096 14.77 2.072 12.01 2.072c-5.49 0-9.953 4.415-9.957 9.842-.002 2.07.545 4.097 1.588 5.892l.216.376-1.001 3.655 3.738-.97L6.147 20.07zM18.01 14.86c-.33-.165-1.953-.964-2.253-1.074-.3-.109-.519-.165-.738.165-.219.33-.848 1.074-1.038 1.293-.19.219-.38.246-.71.082-.33-.165-1.393-.513-2.653-1.637-.984-.877-1.648-1.96-1.841-2.29-.193-.329-.02-.507.145-.671.148-.147.33-.384.495-.576.165-.192.219-.33.329-.548.11-.219.055-.411-.027-.575-.082-.164-.738-1.782-1.011-2.44-.266-.638-.537-.552-.738-.562l-.63-.01c-.22 0-.575.082-.876.411-.3.33-1.15 1.123-1.15 2.74 0 1.617 1.177 3.18 1.34 3.4 1.62 2.13 3.32 3.12 4.9 3.64.44.15.86.19 1.18.14.36-.05 1.15-.47 1.31-.93.16-.46.16-.85.11-.93-.05-.08-.19-.13-.52-.3z"/>
            </svg>
            <span>{t('whatsAppOrder')}</span>
          </button>
          
          <div className="flex gap-2">
            {/* Quick Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-brand-green-dark hover:bg-brand-green-light active:scale-[0.97] text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer border border-brand-green-dark transition-all duration-200"
            >
              <ShoppingCart size={14} />
              <span>{t('addToCart')}</span>
            </button>
            
            {/* Details */}
            <Link
              to={`/products/${product.id}`}
              className="px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center border border-slate-200 transition-all duration-200"
              title={t('viewDetails')}
            >
              <Eye size={14} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
