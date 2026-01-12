
import React from 'react';
import ProductCard from './ProductCard';
import { Product, CartItem } from '../types';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
  cartItems: CartItem[];
  searchQuery?: string;
  topRecommendedId?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onAddToCart, 
  onViewDetails, 
  cartItems, 
  searchQuery,
  topRecommendedId 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
      {products.map((product, index) => {
        // Highlighting logic: AI suggested or top of search results
        const isAIRecommended = topRecommendedId === product.id;
        const isSearchTopMatch = searchQuery && searchQuery.length > 1 && index === 0;
        
        return (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAdd={() => onAddToCart(product)}
            onViewDetails={onViewDetails}
            quantityInCart={cartItems.find(i => i.id === product.id)?.quantity || 0}
            isRecommended={isAIRecommended || isSearchTopMatch}
          />
        );
      })}
    </div>
  );
};

export default ProductGrid;
