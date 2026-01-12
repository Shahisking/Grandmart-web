
import React, { useState } from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  total: number;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove, 
  total,
  onCheckout 
}) => {
  // Track IDs of items currently being animated out
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  const handleRemoveWithAnimation = (id: string) => {
    if (removingIds.includes(id)) return;
    
    setRemovingIds(prev => [...prev, id]);
    
    // Wait for the animation (300ms) to complete before calling the parent removal logic
    setTimeout(() => {
      onRemove(id);
      setRemovingIds(prev => prev.filter(removingId => removingId !== id));
    }, 300);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-[#130f40]/80 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#130f40]">Your Shop Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-[#130f40]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <svg className="w-20 h-20 mb-4 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              <p className="text-xl font-bold">Your cart is empty</p>
            </div>
          ) : (
            items.map(item => (
              <div 
                key={item.id} 
                className={`flex items-center gap-4 group transition-all duration-300 transform ${
                  removingIds.includes(item.id) ? 'opacity-0 translate-x-10 scale-95 pointer-events-none' : 'opacity-100 translate-x-0 scale-100'
                }`}
              >
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-gray-100 shadow-sm" />
                <div className="flex-grow">
                  <h4 className="font-bold text-[#130f40] text-lg">{item.name}</h4>
                  <p className="text-[#ff7800] font-bold">${item.price.toFixed(2)} / {item.unit}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-500 font-medium">Qty:</span>
                    <div className="flex items-center bg-gray-50 rounded px-2">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-[#130f40]"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-[#130f40]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveWithAnimation(item.id)}
                  className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 border-t border-gray-100 bg-gray-50/50">
            <div className="text-center mb-6">
              <span className="text-gray-500 font-medium text-lg">Total : </span>
              <span className="text-2xl font-bold text-[#ff7800] ml-2">${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="outline-btn w-full py-4 rounded font-bold text-xl uppercase tracking-wider"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
