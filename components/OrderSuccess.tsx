
import React, { useEffect, useState } from 'react';
import { OrderDetails, PaymentMethod } from '../types';
import { sendWhatsAppInvoice } from '../services/twilioService';

interface OrderSuccessProps {
  order: OrderDetails;
  onHomeClick: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ order, onHomeClick }) => {
  const [twilioStatus, setTwilioStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [messageSid, setMessageSid] = useState<string | null>(null);

  useEffect(() => {
    // Automatically trigger Twilio automation for online payments
    if (order.paymentMethod === PaymentMethod.ONLINE && order.whatsapp) {
      const handleTwilio = async () => {
        setTwilioStatus('sending');
        try {
          const result = await sendWhatsAppInvoice(order.whatsapp!, order.id, order.total);
          setMessageSid(result.messageSid);
          setTwilioStatus('sent');
        } catch (err) {
          setTwilioStatus('failed');
        }
      };
      // Short delay for better UX flow
      const timer = setTimeout(handleTwilio, 1000);
      return () => clearTimeout(timer);
    }
  }, [order]);

  return (
    <div className="max-w-2xl mx-auto text-center py-12 px-4 animate-fade-in">
      {/* Dynamic Status Toast */}
      <div className={`fixed top-24 right-4 z-[150] max-w-sm w-full transition-all duration-500 transform ${twilioStatus !== 'idle' ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            twilioStatus === 'sent' ? 'bg-green-100 text-green-600' : 
            twilioStatus === 'failed' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
          }`}>
            {twilioStatus === 'sending' ? (
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : twilioStatus === 'sent' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="text-left">
            <h4 className="font-bold text-[#130f40] text-sm">
              {twilioStatus === 'sending' ? 'Generating Invoice...' : 
               twilioStatus === 'sent' ? 'Bill Sent Successfully' : 'Automation Failed'}
            </h4>
            <p className="text-xs text-gray-400">
              {twilioStatus === 'sending' ? 'Connecting to Twilio WhatsApp API' : 
               twilioStatus === 'sent' ? `SID: ${messageSid}` : 'Retrying connection...'}
            </p>
          </div>
        </div>
      </div>

      <div className="w-24 h-24 bg-[#2db34b] text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100 rotate-12">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-5xl font-black text-[#130f40] mb-4 tracking-tighter">SUCCESSFUL!</h1>
      <p className="text-gray-500 text-xl mb-12 font-medium">
        Order <span className="text-[#130f40] font-black">{order.id}</span> is confirmed for <span className="text-[#130f40]">{order.customerName}</span>.
      </p>
      
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl p-12 text-left space-y-8 mb-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8">
           <div className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-colors ${
             twilioStatus === 'sent' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-400'
           }`}>
             <span className={`w-2 h-2 rounded-full ${twilioStatus === 'sent' ? 'bg-green-500' : 'bg-orange-400 animate-pulse'}`} />
             <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp Receipt</span>
           </div>
        </div>

        <div className="pb-8 border-b border-gray-50">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Purchase Receipt</h3>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center group/item">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl p-2 group-hover/item:scale-110 transition-transform">
                    <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
                  </div>
                  <div>
                    <span className="block font-bold text-[#130f40]">{item.name}</span>
                    <span className="text-xs text-gray-400 font-bold uppercase">{item.quantity} x {item.unit}</span>
                  </div>
                </div>
                <span className="font-black text-[#130f40]">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-50/50 p-8 rounded-3xl">
          <div>
            <span className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</span>
            <span className="text-4xl font-black text-[#ff7800]">${order.total.toFixed(2)}</span>
          </div>
          <div className="text-right">
            <span className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Payment</span>
            <span className="text-lg font-bold text-[#130f40]">{order.paymentMethod}</span>
          </div>
        </div>

        {order.paymentMethod === PaymentMethod.ONLINE && (
          <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${
            twilioStatus === 'sent' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                twilioStatus === 'sent' ? 'bg-green-600 text-white' : 'bg-orange-500 text-white animate-pulse'
              }`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="flex-grow">
                <h4 className={`font-black text-sm uppercase tracking-widest ${twilioStatus === 'sent' ? 'text-green-800' : 'text-orange-800'}`}>
                  {twilioStatus === 'sent' ? 'Twilio Dispatch Verified' : 'Twilio Automation Pending'}
                </h4>
                <p className={`text-xs font-medium ${twilioStatus === 'sent' ? 'text-green-600' : 'text-orange-600'}`}>
                  {twilioStatus === 'sent' ? 
                    `A high-resolution bill has been sent to ${order.whatsapp} via Twilio.` : 
                    `Attempting to establish connection with WhatsApp Gateway...`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={onHomeClick}
          className="bg-[#130f40] text-white px-12 py-6 rounded-2xl font-black text-lg hover:bg-[#ff7800] transition-all shadow-2xl shadow-indigo-100 transform active:scale-95 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back To Store
        </button>
        <button 
          className="bg-white border-2 border-gray-100 text-[#130f40] px-12 py-6 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all transform active:scale-95 flex items-center justify-center gap-3"
          onClick={() => window.print()}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
