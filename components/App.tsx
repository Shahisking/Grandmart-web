
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import CheckoutForm from './components/CheckoutForm';
import OrderSuccess from './components/OrderSuccess';
import AIAssistant from './components/AIAssistant';
import AuthModal from './components/AuthModal';
import ProductDetailModal from './components/ProductDetailModal';
import { Product, CartItem, OrderDetails, Category } from '../types';
import { PRODUCTS, REVIEWS, FEATURES } from '../constants';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; id?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'home' | 'checkout' | 'success'>('home');
  const [lastOrder, setLastOrder] = useState<OrderDetails | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [localProducts, setLocalProducts] = useState<Product[]>(PRODUCTS);

  const filteredProducts = useMemo(() => {
    let result = localProducts;
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return result;
  }, [selectedCategory, searchQuery, localProducts]);

  const updateProductImage = (productId: string, newImageUrl: string) => {
    setLocalProducts(prev => prev.map(p => p.id === productId ? { ...p, image: newImageUrl } : p));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty < 1) return item;
        if (newQty > item.stock) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = (orderDetails: Partial<OrderDetails>) => {
    // Fixed handleCheckout to include missing mandatory fields for OrderDetails
    const fullOrder: OrderDetails = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      customer_id: user?.id || 'guest',
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      date: new Date().toLocaleString(),
      customerName: orderDetails.customerName || user?.name || 'Customer',
      address: orderDetails.address || '',
      paymentMethod: orderDetails.paymentMethod!,
      whatsapp: orderDetails.whatsapp,
      status: 'pending',
      twilioStatus: 'pending'
    };
    setLastOrder(fullOrder);
    setCart([]);
    setView('success');
  };

  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      <Header 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => setView('home')}
        onSearch={setSearchQuery}
        onLoginClick={() => setIsAuthOpen(true)}
        user={user}
      />

      <main className="flex-grow">
        {view === 'home' ? (
          <>
            {/* Hero Section */}
            <section id="home" className="relative h-[750px] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop')" }}>
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[4px]" />
              <div className="relative z-10 px-4 max-w-4xl">
                <div className="inline-block bg-[#ff7800] text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full mb-8 shadow-xl animate-bounce">
                  Premium Supermarket Experience
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-[#130f40] mb-8 leading-none tracking-tight">
                  QUALITY & <span className="text-[#ff7800]">ESSENTIAL</span> <br/> PANTRY STAPLES
                </h1>
                <p className="text-[#130f40] text-xl font-bold mb-12 leading-relaxed max-w-2xl mx-auto opacity-80">
                  Experience the next generation of grocery shopping with AI assistance and automated WhatsApp billing.
                </p>
                <button 
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-[#130f40] text-white px-16 py-6 rounded-2xl text-2xl font-black hover:bg-[#ff7800] transition-all transform hover:scale-105 shadow-2xl shadow-indigo-200"
                >
                  Explore Catalog
                </button>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
              <div className="container mx-auto px-4 text-center">
                <h2 className="section-heading">Why Choose <span className="orange-ribbon">Grandmart</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
                  {FEATURES.map(feat => (
                    <div key={feat.id} className="p-12 border border-gray-50 rounded-[3rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white group">
                      <div className="w-40 h-40 mx-auto mb-8 bg-orange-50 rounded-full flex items-center justify-center group-hover:bg-[#ff7800] transition-colors duration-500">
                        <img src={feat.image} alt={feat.title} className="w-24 h-24 object-contain group-hover:brightness-0 group-hover:invert transition-all" />
                      </div>
                      <h3 className="text-[#130f40] text-3xl font-black mb-6">{feat.title}</h3>
                      <p className="text-gray-500 text-lg font-medium leading-relaxed">{feat.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Products Section */}
            <section id="products" className="py-24 bg-gray-50">
              <div className="container mx-auto px-4 text-center">
                <h2 className="section-heading">Premium <span className="orange-ribbon">Selection</span></h2>
                <div className="flex gap-4 justify-center mb-16 flex-wrap">
                  {(['All', 'Rice', 'Masala Powder', 'Milk', 'Tea Powder', 'Coffee Powder', 'Palm Oil', 'Chilli Powder', 'Biscuits'] as Category[]).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-10 py-4 rounded-2xl font-black transition-all shadow-sm transform hover:scale-105 active:scale-95 ${
                        selectedCategory === cat 
                        ? 'bg-[#ff7800] text-white shadow-xl shadow-orange-100' 
                        : 'bg-white text-[#130f40] hover:bg-[#130f40] hover:text-white border border-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                
                {filteredProducts.length > 0 ? (
                  <ProductGrid 
                    products={filteredProducts} 
                    onAddToCart={addToCart} 
                    onViewDetails={(p) => setDetailProduct(p)}
                    cartItems={cart}
                  />
                ) : (
                  <div className="py-24 flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                       <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-2xl font-black">Nothing found for "{searchQuery}"</p>
                    <button onClick={() => setSearchQuery('')} className="text-[#ff7800] font-black mt-4 hover:underline">Reset filters</button>
                  </div>
                )}
              </div>
            </section>

            {/* Review Section */}
            <section id="review" className="py-24 bg-white">
              <div className="container mx-auto px-4 text-center">
                <h2 className="section-heading">Voice Of <span className="orange-ribbon">Customers</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
                  {REVIEWS.map(rev => (
                    <div key={rev.id} className="p-12 border border-gray-50 rounded-[3rem] shadow-sm flex flex-col items-center bg-white hover:shadow-xl transition-all">
                      <img src={rev.avatar} alt={rev.name} className="w-28 h-28 rounded-full border-8 border-gray-50 mb-8" />
                      <p className="text-gray-500 italic text-xl mb-8 leading-relaxed font-medium">"{rev.text}"</p>
                      <h3 className="text-[#130f40] text-2xl font-black mb-4">{rev.name}</h3>
                      <div className="flex gap-2 text-[#ff7800]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3-.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : view === 'checkout' ? (
          <div className="container mx-auto px-4 py-24">
            <CheckoutForm total={cart.reduce((sum, item) => sum + item.price * item.quantity, 0)} onCancel={() => setView('home')} onConfirm={handleCheckout} />
          </div>
        ) : (
          <div className="container mx-auto px-4 py-24">
            {lastOrder && <OrderSuccess order={lastOrder} onHomeClick={() => setView('home')} />}
          </div>
        )}
      </main>

      <footer className="bg-[#130f40] text-white py-24 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                    <circle cx="50" cy="50" r="48" fill="#2db34b" />
                    <path d="M45 40C45 34.4772 40.5228 30 35 30C29.4772 30 25 34.4772 25 40V60C25 65.5228 29.4772 70 35 70H45V50H35V58H40V65H35C32.2386 65 30 62.7614 30 60V40C30 37.2386 32.2386 35 35 35C37.7614 35 40 37.2386 40 40V45H45V40Z" fill="white" />
                    <path d="M55 30V70H60V50L70 65L80 50V70H85V30H80L70 45L60 30H55Z" fill="white" />
                  </svg>
                </div>
                <span className="text-3xl font-black tracking-tighter">Grandmart</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed font-medium">
                The world's first AI-powered supermarket interface. Bringing the best of agriculture and technology to your kitchen.
              </p>
              <div className="flex gap-4">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map(social => (
                  <a key={social} href="#" className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-2xl hover:bg-[#ff7800] transition-all group">
                    <span className="text-xs font-black uppercase tracking-widest hidden group-hover:inline ml-2">{social}</span>
                    <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:hidden" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-black mb-10 uppercase tracking-widest text-[#ff7800]">Support Hub</h4>
              <ul className="space-y-6 text-gray-400 text-lg font-bold">
                <li className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer"><span className="text-[#ff7800]">✆</span> +1-800-GRAND-MART</li>
                <li className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer"><span className="text-[#ff7800]">✉</span> hello@grandmart.ai</li>
                <li className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer"><span className="text-[#ff7800]">⌖</span> Tech Park, Mumbai, IN</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-black mb-10 uppercase tracking-widest text-[#ff7800]">E-Shop Links</h4>
              <ul className="space-y-6 text-gray-400 text-lg font-bold">
                <li className="hover:text-[#ff7800] transition-all cursor-pointer">Organic Produce</li>
                <li className="hover:text-[#ff7800] transition-all cursor-pointer">Smart Recipes</li>
                <li className="hover:text-[#ff7800] transition-all cursor-pointer">Live Tracking</li>
                <li className="hover:text-[#ff7800] transition-all cursor-pointer">Twilio Automation</li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-xl font-black mb-10 uppercase tracking-widest text-[#ff7800]">Join Pulse</h4>
              <p className="text-gray-400 font-medium">Get exclusive AI-curated recipes.</p>
              <div className="relative">
                <input type="email" placeholder="Your Best Email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-[#ff7800] text-white" />
                <button className="bg-[#ff7800] text-white px-8 py-3 rounded-xl font-black mt-4 w-full hover:bg-white hover:text-[#130f40] transition-all transform active:scale-95">Subscribe</button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 mt-24 pt-10 text-center text-gray-500 font-black uppercase tracking-[0.4em] text-xs">
            © 2025 Grandmart Supermarket | Powered by Twilio & Gemini AI
          </div>
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        total={cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
        onCheckout={() => {
          setIsCartOpen(false);
          setView('checkout');
        }}
      />

      {detailProduct && (
        <ProductDetailModal 
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAddToCart={addToCart}
          onUpdateImage={updateProductImage}
        />
      )}

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={(name) => setUser({ name })} 
      />

      <AIAssistant />
    </div>
  );
};

export default App;
