
import React, { useState } from 'react';
import { PaymentMethod, OrderDetails } from '../types';

interface CheckoutFormProps {
  total: number;
  onCancel: () => void;
  onConfirm: (details: Partial<OrderDetails>) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ total, onCancel, onConfirm }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    paymentMethod: PaymentMethod.COD,
    whatsapp: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.paymentMethod === PaymentMethod.ONLINE) {
      if (!formData.whatsapp) {
        alert("Please provide a WhatsApp number for automated billing.");
        return;
      }
      setShowQR(true);
    } else {
      processOrder();
    }
  };

  const processOrder = () => {
    setIsProcessing(true);
    // Simulate API call for order placement
    setTimeout(() => {
      onConfirm(formData);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-6 mb-12">
        <button onClick={onCancel} className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-[#130f40] hover:bg-[#ff7800] hover:text-white transition-all shadow-sm">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-4xl font-black text-[#130f40] tracking-tighter">CHECKOUT</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {!showQR ? (
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-50 space-y-10">
              <div>
                <h2 className="text-xl font-black text-[#130f40] uppercase tracking-widest mb-8 flex items-center gap-3">
                  <span className="w-8 h-8 bg-orange-50 text-[#ff7800] rounded-lg flex items-center justify-center text-sm">01</span>
                  Shipping Info
                </h2>
                
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-[10px] font-black text-[#130f40] uppercase tracking-widest mb-2 px-1">Full Name</label>
                    <input
                      required
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#ff7800] focus:bg-white outline-none transition-all font-bold text-[#130f40]"
                      placeholder="e.g. Alexander Pierce"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-[10px] font-black text-[#130f40] uppercase tracking-widest mb-2 px-1">Delivery Address</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#ff7800] focus:bg-white outline-none transition-all font-bold text-[#130f40]"
                      placeholder="Street, Building, Apartment, Landmark..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#130f40] uppercase tracking-widest mb-8 flex items-center gap-3">
                  <span className="w-8 h-8 bg-orange-50 text-[#ff7800] rounded-lg flex items-center justify-center text-sm">02</span>
                  Payment Preference
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    onClick={() => setFormData({...formData, paymentMethod: PaymentMethod.COD})}
                    className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === PaymentMethod.COD 
                      ? 'border-[#ff7800] bg-orange-50' 
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${formData.paymentMethod === PaymentMethod.COD ? 'bg-[#ff7800] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === PaymentMethod.COD ? 'border-[#ff7800]' : 'border-gray-200'}`}>
                        {formData.paymentMethod === PaymentMethod.COD && <div className="w-2.5 h-2.5 bg-[#ff7800] rounded-full" />}
                      </div>
                    </div>
                    <h3 className="font-black text-[#130f40] text-lg">Cash Delivery</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">Manual Receipt</p>
                  </div>

                  <div 
                    onClick={() => setFormData({...formData, paymentMethod: PaymentMethod.ONLINE})}
                    className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === PaymentMethod.ONLINE 
                      ? 'border-[#2db34b] bg-green-50' 
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${formData.paymentMethod === PaymentMethod.ONLINE ? 'bg-[#2db34b] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === PaymentMethod.ONLINE ? 'border-[#2db34b]' : 'border-gray-200'}`}>
                        {formData.paymentMethod === PaymentMethod.ONLINE && <div className="w-2.5 h-2.5 bg-[#2db34b] rounded-full" />}
                      </div>
                    </div>
                    <h3 className="font-black text-[#130f40] text-lg">Online Pay</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">Twilio Automated Bill</p>
                  </div>
                </div>
              </div>

              {formData.paymentMethod === PaymentMethod.ONLINE && (
                <div className="bg-green-50/50 p-8 rounded-3xl border-2 border-green-100 space-y-4 animate-scale-up">
                  <div className="flex items-center gap-4 text-[#2db34b]">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <span className="font-black text-sm uppercase tracking-widest">WhatsApp Required for Automation</span>
                  </div>
                  <input
                    required
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    className="w-full px-6 py-4 bg-white border border-green-200 rounded-2xl focus:ring-2 focus:ring-[#2db34b] outline-none transition-all font-bold text-[#130f40]"
                    placeholder="Enter WhatsApp Number (e.g. +91...)"
                  />
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-tight">Your digital bill will be dispatched via Twilio to this number immediately.</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#130f40] text-white py-6 rounded-3xl font-black text-xl hover:bg-[#ff7800] transition-all shadow-2xl shadow-indigo-100 transform active:scale-95"
              >
                Confirm Purchase • ${total.toFixed(2)}
              </button>
            </form>
          ) : (
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col items-center animate-scale-up">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#130f40] font-black shadow-inner">
                  GM
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#130f40] tracking-tighter">Scan to Pay</h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grandmart Supermarket</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 relative group">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] z-10 pointer-events-none" />
                <div className="bg-white p-6 rounded-3xl shadow-lg relative z-20">
                   <svg className="w-64 h-64 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="1.5" d="M2 2h6v6H2zM16 2h6v6h-6zM2 16h6v6H2z" />
                      <rect x="10" y="10" width="4" height="4" fill="currentColor" opacity="0.1" />
                      <rect x="5" y="11" width="1" height="1" fill="currentColor" />
                      <rect x="18" y="11" width="1" height="3" fill="currentColor" />
                   </svg>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#130f40] rounded-2xl p-2 w-12 h-12 flex items-center justify-center border-4 border-white shadow-xl">
                      <span className="text-white text-[10px] font-black">GPAY</span>
                   </div>
                </div>
              </div>

              <div className="mt-10 text-center">
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Recipient UPI</p>
                <div className="bg-gray-100 px-6 py-2 rounded-full font-black text-[#130f40] text-sm">
                  grandmart-pay@okhdfc
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full mt-12">
                <button
                  onClick={processOrder}
                  disabled={isProcessing}
                  className="w-full bg-[#2db34b] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#130f40] transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-100"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Authenticating Payment...
                    </>
                  ) : (
                    'Payment Completed'
                  )}
                </button>
                <button 
                  onClick={() => setShowQR(false)}
                  className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] hover:text-[#ff7800] transition-colors"
                >
                  Modify Order details
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#130f40] p-8 rounded-[2.5rem] shadow-2xl text-white sticky top-24">
            <h2 className="text-xl font-black mb-8 border-b border-white/10 pb-6 uppercase tracking-widest">Order Summary</h2>
            <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto custom-scrollbar pr-4">
               {/* Cart items summary could be here */}
               <div className="flex justify-between items-center opacity-60">
                 <span className="text-xs font-bold">Processing Fee</span>
                 <span className="font-bold">FREE</span>
               </div>
               <div className="flex justify-between items-center opacity-60">
                 <span className="text-xs font-bold">Twilio Dispatch</span>
                 <span className="font-bold">INCLUDED</span>
               </div>
            </div>
            <div className="pt-8 border-t border-white/10 flex justify-between items-end">
              <div>
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payable Amount</span>
                <span className="text-4xl font-black text-[#ff7800]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
