
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

const QUICK_ACTIONS = [
  "What's healthy here?",
  "Authentic Biryani recipe",
  "Compare Rice types",
  "Low oil cooking tips"
];

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: textToSend,
        config: {
          thinkingConfig: { thinkingBudget: 4096 },
          systemInstruction: `You are the Grandmart Pro Assistant, an expert in premium groceries and culinary arts. 
          Grandmart sells high-quality pantry staples: Rice, Masala Powders, Fresh Milk, Tea/Coffee, Palm Oil, and Biscuits.
          
          Your goals:
          1. Provide expert culinary advice using store ingredients.
          2. Suggest healthy alternatives (e.g., using less oil).
          3. Maintain a premium, helpful, and sophisticated tone.
          4. Keep responses well-formatted with markdown for readability.
          5. Use emojis strategically to enhance the user experience.
          6. If asked about prices or stock, remind them to check the product grid for real-time updates.`
        }
      });
      
      const botResponse = response.text || "I apologize, I'm having trouble connecting to the Grandmart knowledge base right now.";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "The Grandmart AI service is experiencing high traffic. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      {isOpen ? (
        <div className="bg-white w-80 md:w-[450px] h-[650px] rounded-[3rem] shadow-2xl flex flex-col border border-gray-100 animate-slide-up overflow-hidden shadow-orange-900/10">
          {/* Header */}
          <div className="bg-[#130f40] p-8 flex items-center justify-between text-white relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-500" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2db34b] rounded-[1rem] flex items-center justify-center shadow-lg shadow-green-900/30 rotate-3 group">
                <svg className="w-7 h-7 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.9-.4-2.593-1.003l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-black text-xl tracking-tighter">Grandmart Pro</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] opacity-60 uppercase tracking-[0.2em] font-black">Reasoning Engine v3.0</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-white/10 p-2.5 rounded-2xl transition-all active:scale-90"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-8 space-y-8 bg-gray-50/50 custom-scrollbar"
          >
            {messages.length === 0 && (
              <div className="space-y-8 py-4">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 rounded-bl-[2.5rem] -z-0 opacity-40" />
                  <p className="text-[#130f40] font-black text-2xl mb-3 tracking-tight">Bonjour! 🍳</p>
                  <p className="text-gray-500 text-base leading-relaxed font-bold">
                    I'm your Grandmart Pro Assistant. I have deep knowledge of our premium staples and global culinary techniques. How can I inspire your cooking today?
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2.5">
                  {QUICK_ACTIONS.map(action => (
                    <button
                      key={action}
                      onClick={() => handleSend(action)}
                      className="bg-white border-2 border-gray-100 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest text-[#130f40] hover:border-[#ff7800] hover:text-[#ff7800] transition-all shadow-sm active:scale-95"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-scale-up`}>
                <div className={`max-w-[90%] p-6 rounded-[2rem] text-[15px] leading-relaxed shadow-lg ${
                  msg.role === 'user' 
                  ? 'bg-[#ff7800] text-white rounded-br-none shadow-orange-100 font-bold' 
                  : 'bg-white text-[#130f40] border border-gray-100 rounded-bl-none font-bold'
                }`}>
                  {msg.text.split('\n').map((line, idx) => (
                    <p key={idx} className={idx > 0 ? 'mt-3' : ''}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 rounded-bl-none">
                  <div className="flex gap-2 items-center">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#2db34b] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-[#2db34b] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-[#2db34b] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-[10px] font-black text-[#2db34b] uppercase tracking-[0.2em] ml-2">Gemini is Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-8 border-t border-gray-100 bg-white">
            <div className="flex gap-3 items-center bg-gray-50 p-2.5 rounded-[2.5rem] border-2 border-gray-100 focus-within:border-[#ff7800] focus-within:bg-white transition-all shadow-inner">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Grandmart Pro..."
                className="flex-grow bg-transparent px-5 py-2 text-[15px] focus:outline-none font-bold text-[#130f40] placeholder:text-gray-300"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="bg-[#130f40] text-white p-4 rounded-full hover:bg-[#ff7800] transition-all disabled:opacity-20 shadow-xl active:scale-90"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#130f40] text-white w-20 h-20 rounded-[2rem] shadow-2xl flex items-center justify-center hover:scale-110 hover:-rotate-6 transition-all duration-500 relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#ff7800] to-[#ff9d47] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          <svg className="w-10 h-10 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <div className="absolute top-2 right-2 w-4 h-4 bg-[#2db34b] rounded-full border-[3px] border-[#130f40] group-hover:border-white transition-colors">
            <div className="absolute inset-0 bg-[#2db34b] rounded-full animate-ping opacity-75" />
          </div>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
