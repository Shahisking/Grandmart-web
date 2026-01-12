
import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../services/database';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      // PERFORM DATABASE AUTHENTICATION
      const result = db.authenticate(formData.email, formData.password);
      
      if (result.success && result.user) {
        handleAuthSuccess(result.user);
      } else {
        setError(result.error || "Authentication failed");
      }
    } else {
      // PERFORM DATABASE REGISTRATION
      const newUser: User & { password?: string } = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        role: 'CUSTOMER',
        password: formData.password
      };

      const result = db.register(newUser);
      
      if (result.success) {
        // Automatically log in after registration
        const authResult = db.authenticate(formData.email, formData.password);
        if (authResult.user) handleAuthSuccess(authResult.user);
      } else {
        setError(result.error || "Registration failed");
      }
    }
  };

  const handleAuthSuccess = (user: User) => {
    setIsSuccess(true);
    
    // REQUIREMENT: Once login, erase the gmail id and password fields
    // We clear the state immediately before notifying the parent
    setFormData({ name: '', email: '', password: '', phone: '', address: '' });
    
    // Brief delay to show success animation before closing
    setTimeout(() => {
      onLogin(user);
      setIsSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#130f40]/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[460px] rounded-[3rem] shadow-2xl p-10 animate-scale-up border border-gray-100 overflow-hidden">
        
        {/* Success Overlay */}
        {isSuccess && (
          <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fade-in">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 shadow-xl shadow-green-100 animate-bounce">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-[#130f40] font-black uppercase tracking-widest text-sm">Access Granted</p>
          </div>
        )}

        <div className="text-center mb-10">
          <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl rotate-6 group transition-all ${isLogin ? 'bg-[#130f40]' : 'bg-[#ff7800]'}`}>
            <svg className="w-10 h-10 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-[#130f40] mb-3 tracking-tighter">
            {isLogin ? 'Grandmart Auth' : 'Register Account'}
          </h2>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">
            {isLogin ? 'Secure access to your pantry' : 'Join our premium essentials network'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase text-center border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input 
              required
              type="text" 
              placeholder="FULL NAME" 
              className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 outline-none focus:border-[#ff7800] font-black text-[#130f40] text-sm"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          )}
          
          <input 
            required
            type="email" 
            placeholder="EMAIL ADDRESS" 
            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 outline-none focus:border-[#ff7800] font-black text-[#130f40] text-sm"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          {!isLogin && (
            <>
              <input 
                required
                type="tel" 
                placeholder="PHONE NUMBER" 
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 outline-none focus:border-[#ff7800] font-black text-[#130f40] text-sm"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <textarea 
                required
                placeholder="SHIPPING ADDRESS" 
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 outline-none focus:border-[#ff7800] font-black text-[#130f40] text-sm min-h-[80px]"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </>
          )}

          <input 
            required
            type="password" 
            placeholder="PASSWORD" 
            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 outline-none focus:border-[#ff7800] font-black text-[#130f40] text-sm"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />

          <button 
            type="submit"
            className={`w-full text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 ${isLogin ? 'bg-[#130f40] hover:bg-[#ff7800]' : 'bg-[#ff7800] hover:bg-[#130f40]'}`}
          >
            {isLogin ? 'Sign In' : 'Register Now'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-[#ff7800] transition-colors"
          >
            {isLogin ? 'Need an account? Register' : 'Already registered? Login'}
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-50 bg-gray-50/50 p-6 rounded-[2rem]">
           <p className="text-[9px] font-black text-gray-400 uppercase text-center tracking-[0.2em] leading-relaxed">
             <span className="text-[#130f40]/20">Persistence Layer Active</span><br/>
             {isLogin ? "Verified Users Only" : "Data stored in encrypted local storage"}
           </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
