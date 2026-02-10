
export enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export interface UserProfile {
  uid: string;
  customerId: string;
  phone: string;
  name: string;
  role: UserRole;
  lastOrderTotal: number;
}

export interface Product {
  id: string;
  name: string;
  spec: string[];
  price: number;
  category: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  spec: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  timestamp: Date;
}

export enum AppTab {
  CHAT = 'chat',
  BINDING = 'binding',
  REPORT = 'report',
  PRICE = 'price'
}
