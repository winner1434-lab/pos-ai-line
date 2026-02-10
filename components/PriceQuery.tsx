
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { MOCK_PRODUCTS } from '../constants';

interface PriceQueryProps {
  user: UserProfile;
}

export const PriceQuery: React.FC<PriceQueryProps> = ({ user }) => {
  const [search, setSearch] = useState('');

  if (user.role !== UserRole.ADMIN) {
    return (
      <div className="p-8 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 className="text-lg font-bold text-gray-800">權限受限</h2>
        <p className="text-sm text-gray-500 mt-2 px-6">
          抱歉，您目前的身份無法使用即時價格查詢功能。此功能僅限「管理員」或「VIP 業務」使用。
        </p>
        <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-md">
          聯繫管理員申請權限
        </button>
      </div>
    );
  }

  const filtered = MOCK_PRODUCTS.filter(p => p.name.includes(search) || p.category.includes(search));

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <input 
          type="text"
          placeholder="搜尋品項或類別 (如: 海鮮)..."
          className="w-full bg-white border border-gray-200 rounded-xl px-10 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filtered.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
            <div>
              <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold mb-1">{product.category}</span>
              <h4 className="text-sm font-bold text-gray-800">{product.name}</h4>
              <p className="text-[10px] text-gray-400">規格：{product.spec.join(' / ')}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 line-through">市價 520</p>
              <p className="text-lg font-black text-green-600">${product.price}</p>
              <p className="text-[8px] text-gray-400">更新於 09:30 AM</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
