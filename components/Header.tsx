
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PRODUCTS, CATEGORIES } from '../constants';
import { Product } from '../types';
import Fuse from 'fuse.js';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onHomeClick: () => void;
  onSearch: (query: string) => void;
  onLoginClick: () => void;
  // Added onSelectProduct to allow opening the detail modal from search results
  onSelectProduct?: (p: Product) => void;
  user?: { name: string } | null;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onHomeClick, onSearch, onLoginClick, onSelectProduct, user }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gm_search_history');
    if (saved) setRecentSearches(JSON.parse(saved));

    // Setup Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        onSearch(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onSearch]);

  const startVoiceSearch = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        recognitionRef.current.start();
        setIsListening(true);
      }
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const saveSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem('gm_search_history', JSON.stringify(updated));
  };

  const removeHistoryItem = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    localStorage.setItem('gm_search_history', JSON.stringify(updated));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  const handleSearchSubmit = (term: string) => {
    setQuery(term);
    onSearch(term);
    saveSearch(term);
    setIsSearchVisible(false);
  };

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'Products', href: '#products' },
    { name: 'Reviews', href: '#review' },
  ];

  // Dynamic recommendations for the dropdown
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const fuse = new Fuse(PRODUCTS, { keys: ['name'], threshold: 0.3 });
    return fuse.search(query).map(r => r.item).slice(0, 4);
  }, [query]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] glass-header border-b border-gray-100 transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div 
          onClick={() => { onHomeClick(); setIsSearchVisible(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="relative w-11 h-11 flex items-center justify-center transition-transform group-hover:scale-105">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
              <circle cx="50" cy="50" r="48" fill="#2db34b" />
              <path d="M45 40C45 34.4772 40.5228 30 35 30C29.4772 30 25 34.4772 25 40V60C25 65.5228 29.4772 70 35 70H45V50H35V58H40V65H35C32.2386 65 30 62.7614 30 60V40C30 37.2386 32.2386 35 35 35C37.7614 35 40 37.2386 40 40V45H45V40Z" fill="white" />
              <path d="M55 30V70H60V50L70 65L80 50V70H85V30H80L70 45L60 30H55Z" fill="white" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold text-[#130f40] tracking-tighter">Grandmart</span>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[#130f40] font-bold text-sm uppercase tracking-widest">
          {navItems.map((item) => (
            <a 
              key={item.name}
              href={item.href} 
              onClick={() => { onHomeClick(); setIsSearchVisible(false); }}
              className="hover:text-[#ff7800] transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff7800] transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${isSearchVisible ? 'bg-[#130f40] text-white' : 'bg-gray-100/50 text-[#130f40] hover:bg-gray-100'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <button 
            onClick={onCartClick}
            className="relative w-11 h-11 flex items-center justify-center bg-gray-100/50 rounded-xl hover:bg-gray-100 transition-all text-[#130f40] group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ff7800] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          <button 
            onClick={onLoginClick}
            className="flex items-center gap-2 bg-gray-100/50 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all text-[#130f40] font-bold text-sm"
          >
            <svg className="w-5 h-5 text-[#ff7800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden sm:inline">{user ? user.name : 'Account'}</span>
          </button>
        </div>
      </div>

      {isSearchVisible && (
        <div className="absolute top-0 left-0 right-0 min-h-screen bg-white z-[200] animate-slide-up overflow-y-auto pb-20">
          <div className="sticky top-0 bg-white border-b border-gray-100 p-4 z-10">
            <div className="container mx-auto flex items-center gap-4">
              <button 
                onClick={() => setIsSearchVisible(false)}
                className="p-2 text-gray-500 hover:text-[#130f40]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="flex-grow relative">
                <input 
                  autoFocus
                  type="text"
                  value={query}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(query)}
                  placeholder={isListening ? "Listening..." : "Search Grandmart Pantry..."}
                  className={`w-full bg-gray-50 border-2 rounded-xl py-4 px-12 outline-none transition-all font-bold text-lg ${isListening ? 'border-[#ff7800] ring-4 ring-orange-50' : 'border-transparent focus:border-[#ff7800]'}`}
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3">
                  <button 
                    onClick={startVoiceSearch}
                    className={`p-2 rounded-full transition-all ${isListening ? 'bg-[#ff7800] text-white shadow-lg' : 'text-gray-400 hover:text-[#ff7800]'}`}
                    title="Voice Search"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 mt-8 space-y-10 animate-fade-in">
            {/* Listening Feedback */}
            {isListening && (
              <div className="flex flex-col items-center justify-center py-10 gap-6">
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-[#ff7800] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <p className="text-[#130f40] font-black text-xl uppercase tracking-widest">Speak your pantry needs...</p>
              </div>
            )}

            {/* Search History */}
            {recentSearches.length > 0 && !query && !isListening && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Recent History</h3>
                  <button 
                    onClick={() => { setRecentSearches([]); localStorage.removeItem('gm_search_history'); }}
                    className="text-[10px] font-black text-[#ff7800] uppercase tracking-widest hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((term, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleSearchSubmit(term)}
                      className="flex items-center justify-between py-4 px-2 hover:bg-gray-50 rounded-2xl group cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-lg font-bold text-gray-600 group-hover:text-[#130f40]">{term}</span>
                      </div>
                      <button 
                        onClick={(e) => removeHistoryItem(e, term)}
                        className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Simple Category Inspiration */}
            {!query && !isListening && (
              <div className="pt-4 border-t border-gray-50">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Need Inspiration? Explore Categories</h3>
                <div className="flex flex-wrap gap-3">
                  {CATEGORIES.filter(c => c !== 'All').map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleSearchSubmit(cat)}
                      className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-full text-xs font-black text-[#130f40] hover:bg-[#ff7800] hover:text-white hover:border-[#ff7800] hover:shadow-lg transition-all transform active:scale-95"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Suggestions / Recommended */}
            {query && !isListening && (
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Instant Recommendations</h3>
                <div className="grid grid-cols-1 gap-4">
                  {suggestions.length > 0 ? suggestions.map(product => (
                    <div 
                      key={product.id}
                      onClick={() => {
                        // Use onSelectProduct if provided by parent (App.tsx)
                        if (onSelectProduct) {
                          onSelectProduct(product);
                          setIsSearchVisible(false);
                        } else {
                          handleSearchSubmit(product.name);
                        }
                      }}
                      className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl hover:bg-white hover:ring-2 hover:ring-[#ff7800] transition-all cursor-pointer group shadow-sm hover:shadow-xl"
                    >
                      <div className="w-20 h-20 bg-white rounded-xl p-2 flex items-center justify-center shadow-sm">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-black text-[#130f40] group-hover:text-[#ff7800]">{product.name}</h4>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{product.category}</p>
                        <p className="text-[#ff7800] font-black">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:bg-[#ff7800] group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )) : (
                    <div className="p-12 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                      <p className="text-gray-400 font-bold">No instant matches. Press enter for a deep scan.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
