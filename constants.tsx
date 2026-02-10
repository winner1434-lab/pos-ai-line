
import React from 'react';
import { Product, UserRole } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { id: 'P001', name: '大西洋鮭魚', spec: ['整尾', '切片', '清肉'], price: 450, category: '海鮮' },
  { id: 'P002', name: '波士頓龍蝦', spec: ['500g+', '800g+'], price: 1200, category: '海鮮' },
  { id: 'P003', name: '高山高麗菜', spec: ['箱', '公斤'], price: 45, category: '蔬菜' },
  { id: 'P004', name: '特級美生菜', spec: ['箱', '公斤'], price: 60, category: '蔬菜' },
  { id: 'P005', name: '日本和牛 A5', spec: ['200g', '500g'], price: 2500, category: '肉類' }
];

export const INITIAL_USER = {
  uid: 'line_user_123',
  customerId: '',
  phone: '',
  name: '',
  role: UserRole.GUEST,
  lastOrderTotal: 5000 // Mock last order total for variance calculation
};

export const VARIANCE_THRESHOLD = 0.3; // 30%
