
import React from 'react';
import { AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, title }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-full overflow-hidden">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-lg font-bold">{title}</h1>
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-xs">AI</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation (Rich Menu simulation) */}
      <nav className="fixed bottom-0 w-full max-w-[480px] bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20">
        <button 
          onClick={() => onTabChange(AppTab.CHAT)}
          className={`flex flex-col items-center flex-1 transition-colors ${activeTab === AppTab.CHAT ? 'text-green-600' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          <span className="text-[10px] mt-1">AI 叫貨</span>
        </button>
        <button 
          onClick={() => onTabChange(AppTab.BINDING)}
          className={`flex flex-col items-center flex-1 transition-colors ${activeTab === AppTab.BINDING ? 'text-green-600' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-[10px] mt-1">會員綁定</span>
        </button>
        <button 
          onClick={() => onTabChange(AppTab.PRICE)}
          className={`flex flex-col items-center flex-1 transition-colors ${activeTab === AppTab.PRICE ? 'text-green-600' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <span className="text-[10px] mt-1">查價報價</span>
        </button>
        <button 
          onClick={() => onTabChange(AppTab.REPORT)}
          className={`flex flex-col items-center flex-1 transition-colors ${activeTab === AppTab.REPORT ? 'text-green-600' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
          <span className="text-[10px] mt-1">每月報表</span>
        </button>
      </nav>
    </div>
  );
};
