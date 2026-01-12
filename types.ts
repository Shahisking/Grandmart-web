
export type Category = 'All' | 'Rice' | 'Masala Powder' | 'Milk' | 'Tea Powder' | 'Coffee Powder' | 'Palm Oil' | 'Chilli Powder' | 'Biscuits';

export type UserRole = 'ADMIN' | 'CUSTOMER';
export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string; // Added for better customer understanding
  role: UserRole;
  password?: string; // Simulated
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  unit: string;
  stock: number;
  image: string;
  description: string;
  details?: {
    origin: string;
    shelfLife: string;
    nutrition: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export enum PaymentMethod {
  COD = 'Cash on Delivery',
  ONLINE = 'Online Payment'
}

export interface OrderDetails {
  id: string;
  customer_id: string;
  customerName: string;
  customerPhone?: string;
  whatsapp?: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  address: string;
  date: string;
  status: OrderStatus;
  twilioStatus?: 'pending' | 'sent' | 'failed';
}

export interface AdminAnalytics {
  total_orders: number;
  total_revenue: number;
  orders_today: number;
  top_customer: string;
}
