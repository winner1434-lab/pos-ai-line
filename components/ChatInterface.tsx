
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, UserRole } from '../types.ts';
import { processUserMessage } from '../services/geminiService.ts';
import { MOCK_PRODUCTS, VARIANCE_THRESHOLD } from '../constants.tsx';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  text: string;
  isOrder?: boolean;
  orderTotal?: number;
  confirmed?: boolean;
}

interface ChatInterfaceProps {
  user: UserProfile;
  onOrderConfirm: (total: number) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, onOrderConfirm }) => {
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
        isOrder: response.intent === '叫貨' && orderTotal > 0,
        orderTotal: orderTotal
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), type: 'ai', text: '抱歉，系統目前有點忙碌，請稍後再試。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmOrder = (msgId: string, total: number) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, confirmed: true } : m));
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      type: 'system', 
      text: `✅ 訂單已成功推播至 ERP 系統！\n總金額：$${total.toLocaleString()}\n預計配送：明日上午` 
    }]);
    onOrderConfirm(total);
  };

  return (
    <div className="flex flex-col h-full bg-[#F0F2F5]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : (msg.type === 'system' ? 'justify-center' : 'justify-start')}`}>
            {msg.type === 'system' ? (
              <div className="bg-gray-200/80 text-gray-600 text-[11px] px-4 py-1 rounded-full border border-gray-300">
                {msg.text}
              </div>
            ) : (
              <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm text-sm relative ${
                msg.type === 'user' ? 'bg-[#00B900] text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                {msg.isOrder && msg.orderTotal && msg.orderTotal > 0 && !msg.confirmed && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 font-medium">預估金額: ${msg.orderTotal.toLocaleString()}</span>
                      <button 
                        onClick={() => confirmOrder(msg.id, msg.orderTotal!)}
                        className="bg-[#00B900] hover:bg-[#009e00] text-white px-4 py-1.5 rounded-full text-xs font-bold transition-colors shadow-md active:scale-95"
                      >
                        確認下單
                      </button>
                    </div>
                  </div>
                )}
                {msg.confirmed && (
                  <div className="mt-2 text-[10px] text-green-600 font-bold flex items-center justify-end italic">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                    訂單已處理
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#00B900] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#00B900] rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 bg-[#00B900] rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center space-x-2 bg-[#F8F9FA] rounded-2xl px-4 py-2.5 border border-gray-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={user.role === UserRole.GUEST ? "請先完成身份綁定" : "我想訂鮭魚 3 公斤..."}
            className="flex-1 bg-transparent border-none focus:outline-none text-[15px] placeholder-gray-400"
            disabled={user.role === UserRole.GUEST}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim() || user.role === UserRole.GUEST}
            className={`p-2 rounded-xl transition-all ${input.trim() && user.role !== UserRole.GUEST ? 'bg-[#00B900] text-white shadow-sm' : 'text-gray-300'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
