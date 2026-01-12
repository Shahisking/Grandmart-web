
import React from 'react';
import { CartItem } from '../types';

interface CartViewProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  total: number;
  onCheckout: () => void;
  onBackToStore: () => void;
}

const CartView: React.FC<CartViewProps> = ({ 
  items, 
  onUpdateQuantity, 
  onRemove, 
  total, 
  onCheckout, 
  onBackToStore 
}) => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl animate-fade-in">
      <div className="flex items-center gap-6 mb-12">
        <button onClick={onBackToStore} className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-[#130f40] hover:bg-[#ff7800] hover:text-white transition-all shadow-sm">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-4xl font-black text-[#130f40] tracking-tighter uppercase">Shopping Basket</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] text-center border border-gray-50 shadow-sm flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                <svg className="w-16 h-16 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-[#130f40] mb-4">Your basket is feeling light.</h2>
              <p className="text-gray-400 font-bold mb-10">Add some premium pantry staples to get started.</p>
              <button 
                onClick={onBackToStore}
                className="bg-[#130f40] text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-[#ff7800] transition-all"
              >
                Go To Catalog
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col sm:flex-row items-center gap-6 group hover:shadow-xl transition-all">
                <div className="w-32 h-32 bg-gray-50 rounded-[2rem] p-4 flex items-center justify-center shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-xl font-black text-[#130f40] mb-1">{item.name}</h3>
                  <p className="text-xs font-black text-[#ff7800] uppercase tracking-widest mb-4">{item.category}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#130f40] font-black shadow-sm active:scale-90"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-black text-[#130f40]">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#130f40] font-black shadow-sm active:scale-90"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-gray-400 font-bold text-sm">x ${item.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-center sm:items-end gap-2">
                  <span className="text-2xl font-black text-[#130f40]">${(item.price * item.quantity).toFixed(2)}</span>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                  >
                    Remove Item
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#130f40] p-10 rounded-[3rem] text-white shadow-2xl sticky top-24">
            <h2 className="text-xl font-black mb-8 border-b border-white/10 pb-6 uppercase tracking-[0.2em]">Summary</h2>
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center opacity-70">
                <span className="text-xs font-bold uppercase tracking-widest">Subtotal</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center opacity-70">
                <span className="text-xs font-bold uppercase tracking-widest">Delivery</span>
                <span className="font-bold">FREE</span>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-white/10">
                <span className="text-sm font-black uppercase tracking-widest">Total Amount</span>
                <span className="text-3xl font-black text-[#ff7800]">${total.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={onCheckout}
              disabled={items.length === 0}
              className="w-full bg-[#ff7800] text-white py-6 rounded-2xl font-black text-xl hover:bg-white hover:text-[#130f40] transition-all transform active:scale-95 disabled:opacity-20 shadow-xl shadow-orange-900/20"
            >
              Secure Checkout
            </button>
            <p className="mt-8 text-center text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
              Encrypted • twilio automation • grandmart pro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;
