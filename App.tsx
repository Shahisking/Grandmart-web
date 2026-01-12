
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import CheckoutForm from './components/CheckoutForm';
import OrderSuccess from './components/OrderSuccess';
import AIAssistant from './components/AIAssistant';
import AuthModal from './components/AuthModal';
import ProductDetailModal from './components/ProductDetailModal';
import CartView from './components/CartView';
import AdminDashboard from './components/AdminDashboard';
import { Product, CartItem, OrderDetails, Category, User, OrderStatus } from './types';
import { PRODUCTS, REVIEWS, FEATURES } from './constants';
import { db } from './services/database';
import Fuse from 'fuse.js';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gm_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gm_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [allOrders, setAllOrders] = useState<OrderDetails[]>(() => {
    const saved = localStorage.getItem('gm_all_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Driven by Database Service
  const [allUsers, setAllUsers] = useState<User[]>(db.getAllUsers());

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'home' | 'checkout' | 'success' | 'cart' | 'admin_dashboard'>('home');
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [localProducts, setLocalProducts] = useState<Product[]>(PRODUCTS);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');
  const [showToast, setShowToast] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('gm_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gm_user', JSON.stringify(user));
    if (user?.role === 'ADMIN') {
      setView('admin_dashboard');
    } else if (view === 'admin_dashboard') {
      setView('home');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('gm_all_orders', JSON.stringify(allOrders));
  }, [allOrders]);

  const filteredProducts = useMemo(() => {
    let baseList = localProducts;
    if (selectedCategory !== 'All') baseList = baseList.filter(p => p.category === selectedCategory);

    // Search logic
    if (searchQuery.trim()) {
      const fuse = new Fuse(baseList, {
        keys: [{ name: 'name', weight: 0.8 }, { name: 'description', weight: 0.15 }, { name: 'category', weight: 0.05 }],
        threshold: 0.4
      });
      const searchResults = fuse.search(searchQuery);
      baseList = searchResults.map(r => r.item);
    }

    // Sorting logic
    return [...baseList].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'featured':
        default:
          return 0; // Keep original order
      }
    });
  }, [selectedCategory, searchQuery, localProducts, sortBy]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (user?.role === 'ADMIN') {
      setShowToast("Admin Protection: Administrators cannot place orders.");
      setTimeout(() => setShowToast(null), 2500);
      return;
    }
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    setShowToast(`${product.name} Added to Basket`);
    setTimeout(() => setShowToast(null), 1500);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, Math.min(item.stock, newQty)) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = (orderDetails: Partial<OrderDetails>) => {
    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const newOrder: OrderDetails = {
      id: orderId,
      customer_id: user?.id || 'guest',
      customerName: orderDetails.customerName || user?.name || 'Valued Customer',
      customerPhone: orderDetails.whatsapp || user?.phone,
      whatsapp: orderDetails.whatsapp,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      date: new Date().toLocaleString(),
      paymentMethod: orderDetails.paymentMethod!,
      address: orderDetails.address || '',
      status: 'pending',
      twilioStatus: 'pending'
    };

    setAllOrders(prev => [...prev, newOrder]);
    setLastOrderId(orderId);
    setCart([]);
    setView('success');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setShowToast(`Status for ${orderId} updated to ${newStatus}`);
    setTimeout(() => setShowToast(null), 2000);
  };

  const lastOrder = useMemo(() => allOrders.find(o => o.id === lastOrderId), [allOrders, lastOrderId]);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Guard: Restrict admin endpoints
  if (user?.role === 'ADMIN' && (view === 'cart' || view === 'checkout')) {
    setView('admin_dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#ff7800] selection:text-white">
      {view !== 'admin_dashboard' && (
        <Header
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setView('cart')}
          onHomeClick={() => setView('home')}
          onSearch={setSearchQuery}
          onLoginClick={() => setIsAuthOpen(true)}
          onSelectProduct={(p) => setDetailProduct(p)}
          user={user}
        />
      )}

      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[500] animate-slide-up">
          <div className="bg-[#130f40] text-white px-8 py-4 rounded-2xl shadow-2xl font-black uppercase tracking-widest text-[10px] border-2 border-[#ff7800]">
            {showToast}
          </div>
        </div>
      )}

      <main className={`flex-grow ${view !== 'admin_dashboard' ? 'pt-20' : ''}`}>
        {view === 'admin_dashboard' && user?.role === 'ADMIN' ? (
          <AdminDashboard
            orders={allOrders}
            customers={allUsers}
            onUpdateStatus={handleUpdateOrderStatus}
            onLogout={() => { setUser(null); setView('home'); }}
          />
        ) : view === 'home' ? (
          <>
            <section id="home" className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-center bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop')" }}>
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
              <div className="relative z-10 px-4 max-w-5xl">
                <h1 className="text-6xl md:text-9xl font-black text-[#130f40] mb-8 leading-none tracking-tight">
                  PANTRY <br /> <span className="text-[#ff7800]">PERFECTION.</span>
                </h1>
                {!user ? (
                  <button onClick={() => setIsAuthOpen(true)} className="bg-[#130f40] text-white px-16 py-6 rounded-[2rem] text-xl font-black hover:bg-[#ff7800] transition-all transform hover:scale-105 shadow-2xl active:scale-95">
                    Enter the Supermarket
                  </button>
                ) : user.role === 'ADMIN' ? (
                  <button onClick={() => setView('admin_dashboard')} className="bg-[#ff7800] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#130f40] transition-all">
                    Access Command Center
                  </button>
                ) : (
                  <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#130f40] text-white px-16 py-6 rounded-[2rem] text-xl font-black hover:bg-[#ff7800] transition-all transform hover:scale-105 shadow-2xl active:scale-95">
                    Explore Our Selection
                  </button>
                )}
              </div>
            </section>

            <section id="products" className="py-32 bg-gray-50/50">
              <div className="container mx-auto px-4 text-center">
                <h2 className="section-heading">Elite <span className="orange-ribbon">Selection</span></h2>
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
                  <div className="flex gap-2 overflow-x-auto max-w-[80vw] pb-4 md:pb-0 scrollbar-hide">
                    {(['All', 'Rice', 'Masala Powder', 'Milk', 'Tea Powder', 'Coffee Powder', 'Palm Oil', 'Chilli Powder', 'Biscuits'] as Category[]).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-8 py-3 rounded-[1.2rem] text-sm font-black whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-[#ff7800] text-white shadow-xl scale-105' : 'bg-white text-[#130f40] border border-gray-100 hover:border-[#ff7800]/50'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="relative group">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="appearance-none bg-white text-[#130f40] pl-6 pr-12 py-3 rounded-[1.2rem] text-sm font-black border border-gray-100 cursor-pointer outline-none focus:border-[#ff7800] shadow-sm hover:shadow-md transition-all uppercase tracking-wider"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name-asc">Name: A to Z</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[#ff7800] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <ProductGrid
                  products={filteredProducts}
                  onAddToCart={(p) => addToCart(p, 1)}
                  onViewDetails={setDetailProduct}
                  cartItems={cart}
                  searchQuery={searchQuery}
                />
              </div>
            </section>
          </>
        ) : view === 'cart' ? (
          <CartView
            items={cart}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            total={cartTotal}
            onCheckout={() => setView('checkout')}
            onBackToStore={() => setView('home')}
          />
        ) : view === 'checkout' ? (
          <div className="container mx-auto px-4 py-24">
            <CheckoutForm total={cartTotal} onCancel={() => setView('cart')} onConfirm={handleCheckout} />
          </div>
        ) : (
          <div className="container mx-auto px-4 py-24">
            {lastOrder && <OrderSuccess order={lastOrder} onHomeClick={() => setView('home')} />}
          </div>
        )}
      </main>

      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAddToCart={(p, q) => addToCart(p, q)}
          onSelectProduct={setDetailProduct}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(newUser) => {
          setUser(newUser);
          setAllUsers(db.getAllUsers()); // Sync with DB
          if (newUser.role === 'ADMIN') setView('admin_dashboard');
        }}
      />
    </div>
  );
};

export default App;
