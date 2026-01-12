
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: () => void;
  onViewDetails: (p: Product) => void;
  quantityInCart: number;
  isRecommended?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd, onViewDetails, quantityInCart, isRecommended }) => {
  const isOutOfStock = product.stock <= 0;
  
  return (
    <div className={`bg-white rounded-[2.5rem] product-card-shadow border p-6 flex flex-col items-center text-center transition-all duration-500 hover:translate-y-[-12px] hover:shadow-2xl group relative overflow-hidden ${
      isRecommended ? 'border-[#ff7800] ring-8 ring-orange-50 shadow-orange-100 scale-105 z-10' : 'border-gray-50'
    }`}>
      {/* Search Result Recommendation Badge */}
      {isRecommended && (
        <div className="absolute top-0 left-0 bg-gradient-to-r from-[#ff7800] to-[#ff9d47] text-white text-[9px] font-black px-6 py-2 rounded-br-[1.5rem] shadow-xl z-20 flex items-center gap-2 uppercase tracking-[0.25em] animate-pulse">
           <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3-.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
           </svg>
           Best Match
        </div>
      )}

      {quantityInCart > 0 && (
        <div className="absolute top-4 right-4 bg-[#130f40] text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg z-10">
          IN BASKET: {quantityInCart}
        </div>
      )}
      
      <div 
        onClick={() => onViewDetails(product)}
        className="relative mb-8 w-full aspect-square flex items-center justify-center overflow-hidden rounded-[2rem] bg-gray-50/50 cursor-zoom-in group-hover:bg-white transition-colors"
      >
        <img 
          src={product.image} 
          alt={product.name}
          className="w-[85%] h-[85%] object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
        />
        <div className="absolute inset-0 bg-[#130f40]/5 group-hover:bg-[#130f40]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
          <span className="bg-white text-[#130f40] px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">Quick Peek</span>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow w-full">
        <h3 
          className="text-[#130f40] text-2xl font-black mb-1 tracking-tight line-clamp-1 cursor-pointer hover:text-[#ff7800] transition-colors"
          onClick={() => onViewDetails(product)}
        >
          {product.name}
        </h3>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{product.category}</p>
        
        <div className="text-[#ff7800] text-3xl font-black mb-6">
          ${product.price.toFixed(2)} <span className="text-gray-400 text-sm font-medium">/ {product.unit}</span>
        </div>
        
        <div className="flex gap-1 text-[#ff7800] justify-center mb-8">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        
        <button
          onClick={onAdd}
          disabled={isOutOfStock}
          className={`w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all transform active:scale-95 ${
            isOutOfStock 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-[#130f40] text-white hover:bg-[#ff7800] shadow-xl shadow-indigo-100/50'
          }`}
        >
          {isOutOfStock ? 'Sold Out' : 'Add To Basket'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
