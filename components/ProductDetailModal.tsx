
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../constants';
import { generateProductImage } from '../services/imageService';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, quantity: number) => void;
  onUpdateImage?: (productId: string, newImageUrl: string) => void;
  onSelectProduct?: (p: Product) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  onClose, 
  onAddToCart, 
  onUpdateImage,
  onSelectProduct
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [localQty, setLocalQty] = useState(1);

  React.useEffect(() => {
    setCurrentImage(null);
    setLocalQty(1);
    if (product) {
       document.body.style.overflow = 'hidden';
    } else {
       document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [product?.id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return PRODUCTS
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (!product) return null;

  const displayImage = currentImage || product.image;

  const handleAiRegenerate = async () => {
    setIsGenerating(true);
    try {
      const newImageUrl = await generateProductImage(product.name, product.category);
      setCurrentImage(newImageUrl);
      if (onUpdateImage) {
        onUpdateImage(product.id, newImageUrl);
      }
    } catch (err) {
      alert("Failed to generate AI image.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQtyChange = (delta: number) => {
    setLocalQty(prev => Math.max(1, Math.min(product.stock, prev + delta)));
  };

  return (
    <div className="fixed inset-0 z-[400] bg-white flex flex-col md:inset-4 md:bg-transparent md:items-center md:justify-center animate-slide-up">
      <div className="md:absolute md:inset-0 md:bg-[#130f40]/80 md:backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full h-full md:max-w-6xl md:h-[90vh] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-up">
        {/* Mobile Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md p-4 flex items-center justify-between z-20 md:hidden border-b border-gray-100">
           <button onClick={onClose} className="p-2 text-[#130f40]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
           </button>
           <span className="font-black text-xs uppercase tracking-widest text-[#130f40]">Product Details</span>
           <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* Desktop Close Button */}
        <button 
          onClick={onClose}
          className="hidden md:block absolute top-8 right-8 z-30 p-3 bg-white/80 backdrop-blur rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Image Display */}
        <div className="w-full md:w-1/2 bg-[#f9fafb] p-8 md:p-20 flex items-center justify-center relative shrink-0">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-4 py-32">
              <div className="w-16 h-16 border-4 border-[#ff7800] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Painting...</p>
            </div>
          ) : (
            <img src={displayImage} alt={product.name} className="w-full h-auto max-h-[40vh] md:max-h-full object-contain drop-shadow-2xl animate-fade-in" />
          )}
          <button 
            onClick={handleAiRegenerate}
            disabled={isGenerating}
            className="absolute bottom-8 right-8 p-4 bg-white border border-gray-100 rounded-2xl shadow-xl hover:bg-[#ff7800] hover:text-white transition-all group"
          >
            <svg className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-grow overflow-y-auto p-6 md:p-14 space-y-8 custom-scrollbar pb-32 md:pb-14">
          <div>
            <span className="text-[10px] font-black text-[#ff7800] uppercase tracking-[0.3em] mb-3 block">{product.category}</span>
            <h1 className="text-3xl md:text-5xl font-black text-[#130f40] leading-tight mb-4">{product.name}</h1>
            <div className="flex items-end gap-3">
              <span className="text-4xl md:text-5xl font-black text-[#130f40]">${product.price.toFixed(2)}</span>
              <span className="text-gray-400 text-lg font-bold mb-1 tracking-tight">/ {product.unit}</span>
            </div>
          </div>

          <p className="text-gray-500 text-base md:text-lg leading-relaxed font-medium">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock Status</span>
              <span className={`text-lg font-black ${product.stock > 0 ? 'text-[#2db34b]' : 'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} available` : 'Sold Out'}
              </span>
            </div>
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Standard Unit</span>
              <span className="text-lg font-black text-[#130f40]">{product.unit}</span>
            </div>
            {product.details?.origin && (
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Origin</span>
                <span className="text-lg font-black text-[#130f40]">{product.details.origin}</span>
              </div>
            )}
            {product.details?.shelfLife && (
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Shelf Life</span>
                <span className="text-lg font-black text-[#130f40]">{product.details.shelfLife}</span>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-6 py-4 border-t border-b border-gray-100">
            <span className="text-sm font-black text-[#130f40] uppercase tracking-widest">Select Quantity</span>
            <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-2xl">
              <button 
                onClick={() => handleQtyChange(-1)}
                className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#130f40] font-black hover:bg-[#ff7800] hover:text-white transition-all active:scale-90"
              >
                -
              </button>
              <span className="w-12 text-center text-xl font-black text-[#130f40]">{localQty}</span>
              <button 
                onClick={() => handleQtyChange(1)}
                className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#130f40] font-black hover:bg-[#ff7800] hover:text-white transition-all active:scale-90"
              >
                +
              </button>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Frequently Viewed with this</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.map(rp => (
                  <div key={rp.id} onClick={() => onSelectProduct?.(rp)} className="group cursor-pointer">
                    <div className="aspect-square bg-gray-50 rounded-2xl p-3 mb-2 flex items-center justify-center border border-transparent group-hover:border-[#ff7800] transition-colors">
                      <img src={rp.image} alt={rp.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-[11px] font-black text-[#130f40] truncate uppercase tracking-tight">{rp.name}</p>
                    <p className="text-sm font-black text-[#ff7800]">${rp.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Mobile Add To Cart */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-100 md:relative md:p-14 md:border-none md:bg-transparent">
           <div className="flex gap-4">
              <button 
                onClick={() => { onAddToCart(product, localQty); onClose(); }}
                className="flex-grow bg-[#130f40] text-white py-5 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-xl shadow-2xl hover:bg-[#ff7800] transition-all transform active:scale-95 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Add To Basket
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
