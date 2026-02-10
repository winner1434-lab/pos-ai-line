
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';

interface BindingFormProps {
  onSuccess: (updatedUser: UserProfile) => void;
  currentUser: UserProfile;
}

export const BindingForm: React.FC<BindingFormProps> = ({ onSuccess, currentUser }) => {
  const [formData, setFormData] = useState({
    customerId: currentUser.customerId,
    phone: currentUser.phone
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  const handleBind = () => {
    if (!formData.customerId || !formData.phone) return;
    
    setStatus('loading');
    
    // Simulate API Verification
    setTimeout(() => {
      if (formData.customerId === 'ERR-123') {
        setStatus('error');
      } else {
        const role = formData.customerId.startsWith('ADMIN') ? UserRole.ADMIN : UserRole.CUSTOMER;
        onSuccess({
          ...currentUser,
          customerId: formData.customerId,
          phone: formData.phone,
          name: '王小明老闆',
          role: role
        });
        setStatus('success');
      }
    }, 1500);
  };

  if (currentUser.role !== UserRole.GUEST) {
    return (
      <div className="p-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">您已成功綁定</h2>
        <p className="text-gray-500 mt-2">帳號：{currentUser.customerId}</p>
        <p className="text-gray-500">權限：{currentUser.role}</p>
        <button 
          onClick={() => onSuccess({ ...currentUser, role: UserRole.GUEST, customerId: '', phone: '' })}
          className="mt-6 text-red-500 text-sm font-medium underline"
        >
          解除綁定
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">農易訂 會員綁定</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">客戶代號 (ERP)</label>
            <input 
              type="text" 
              placeholder="請輸入您的客戶代號 (如: CUST001)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              value={formData.customerId}
              onChange={e => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
            />
            <p className="text-[10px] text-gray-400 mt-1">※ 提示：輸入「ADMIN-VIP」可獲得管理員權限</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">手機號碼</label>
            <input 
              type="tel" 
              placeholder="0912345678"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          {status === 'error' && (
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 animate-pulse">
              查無此客戶，請檢查客戶代碼或聯繫客服中心。
            </div>
          )}

          <button 
            disabled={status === 'loading'}
            onClick={handleBind}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${status === 'loading' ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 active:scale-[0.98]'}`}
          >
            {status === 'loading' ? '驗證中...' : '立即綁定身份'}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            綁定身份後，AI 將能自動辨識您的採購品項並根據歷史紀錄提供預警防呆機制。
          </p>
        </div>
      </div>
    </div>
  );
};
