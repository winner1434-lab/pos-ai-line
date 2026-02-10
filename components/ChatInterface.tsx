
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, UserRole, OrderItem } from '../types';
import { processUserMessage } from '../services/geminiService';
import { MOCK_PRODUCTS, VARIANCE_THRESHOLD } from '../constants';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  isOrder?: boolean;
  orderTotal?: number;
}

interface ChatInterfaceProps {
  user: UserProfile;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'ai', text: `老闆您好！我是您的智慧採購助手。${user.role === UserRole.GUEST ? '偵測到您尚未綁定身份，綁定後可進行叫貨與查價喔！' : '今天想叫些什麼貨呢？'}` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await processUserMessage(input, user.role);
      
      let aiText = response.reply;
      let orderTotal = 0;
      let isAnomaly = false;

      // Handle ordering logic
      if (response.intent === '叫貨' && response.extractedOrder && response.extractedOrder.length > 0) {
        // Calculate total for anomaly detection
        response.extractedOrder.forEach((item: any) => {
          const product = MOCK_PRODUCTS.find(p => p.name.includes(item.name) || item.name.includes(p.name));
          if (product) {
            orderTotal += product.price * item.quantity;
          }
        });

        if (orderTotal > 0 && user.role !== UserRole.GUEST) {
          const variance = Math.abs(orderTotal - user.lastOrderTotal) / user.lastOrderTotal;
          if (variance > VARIANCE_THRESHOLD) {
            isAnomaly = true;
            const diffPercent = Math.round(variance * 100);
            const trend = orderTotal > user.lastOrderTotal ? '多了' : '少了';
            aiText = `🚨 異常偵測提醒：\n老闆，這次叫貨金額 (${orderTotal.toLocaleString()} 元) 跟上次 (${user.lastOrderTotal.toLocaleString()} 元) 差蠻多的喔 (${trend} ${diffPercent}%)，確定沒按錯嗎？\n\n${aiText}`;
          }
        }
      }

      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        type: 'ai', 
        text: aiText,
        isOrder: response.intent === '叫貨',
        orderTotal: orderTotal
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), type: 'ai', text: '抱歉，系統目前有點忙碌，請稍後再試。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm text-sm ${
              msg.type === 'user' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
              {msg.isOrder && msg.orderTotal && msg.orderTotal > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[10px] text-gray-400">預估金額: ${msg.orderTotal.toLocaleString()}</span>
                  <button className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold">確認下單</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="請輸入叫貨品項，如：鮭魚 5 公斤..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className={`p-1.5 rounded-full ${input.trim() ? 'bg-green-600 text-white' : 'text-gray-300'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
