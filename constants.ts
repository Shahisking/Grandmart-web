
import { Product } from './types';

export const CATEGORIES: string[] = ['All', 'Rice', 'Masala Powder', 'Milk', 'Tea Powder', 'Coffee Powder', 'Palm Oil', 'Chilli Powder', 'Biscuits'];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Basmati Rice',
    category: 'Rice',
    price: 12.50,
    unit: '5kg',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&h=300&auto=format&fit=crop',
    description: 'Aromatic long-grain basmati rice, perfect for biryani and daily meals.'
  },
  {
    id: '2',
    name: 'Garam Masala',
    category: 'Masala Powder',
    price: 3.99,
    unit: '200g',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=400&h=300&auto=format&fit=crop',
    description: 'Freshly ground authentic spice blend for rich Indian curries.'
  },
  {
    id: '3',
    name: 'Full Cream Milk',
    category: 'Milk',
    price: 1.20,
    unit: '1L',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1563636619-e910009355dc?q=80&w=400&h=300&auto=format&fit=crop',
    description: 'Fresh dairy milk, pasteurized and homogenized for health.'
  },
  {
    id: '4',
    name: 'Premium Tea Powder',
    category: 'Tea Powder',
    price: 5.45,
    unit: '500g',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1594631252845-29fc45865157?q=80&w=400&h=300&auto=format&fit=crop',
    description: 'Strong and refreshing CTC tea leaves for the perfect chai.'
  },
  {
    id: '5',
    name: 'Instant Coffee Powder',
    category: 'Coffee Powder',
    price: 7.99,
    unit: '200g',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400&h=300&auto=format&fit=crop',
    description: 'Rich and smooth instant coffee for a quick caffeine boost.'
  },
  {
    id: '6',
    name: 'Refined Palm Oil',
    category: 'Palm Oil',
    price: 15.00,
    unit: '5L',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacabc88c5?q=80&w=400&h=300&auto=format&fit=crop',
    description: 'Fortified cooking oil for healthy frying and sautéing.'
  },
  {
    id: '7',
    name: 'Red Chilli Powder',
    category: 'Chilli Powder',
    price: 2.50,
    unit: '250g',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1591189863430-ab87e120f312?q=80&w=400&h=300&auto=format&fit=crop',
    description: 'Pure and spicy red chilli powder for vibrant heat in your food.'
  },
  {
    id: '8',
    name: 'Marie Biscuits',
    category: 'Biscuits',
    price: 1.50,
    unit: 'packet',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&h=300&auto=format&fit=crop',
    description: 'Classic crunchy tea-time biscuits for the whole family.'
  }
];

export const REVIEWS = [
  {
    id: 1,
    name: 'John Doe',
    text: 'The Basmati rice quality is exceptional. Best store in Mumbai!',
    avatar: 'https://i.pravatar.cc/150?u=john',
    rating: 5
  },
  {
    id: 2,
    name: 'Jane Smith',
    text: 'Free delivery is super fast. The chilli powder is very authentic.',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    rating: 4
  },
  {
    id: 3,
    name: 'Mike Ross',
    text: 'Love the variety of masala powders. Great prices too.',
    avatar: 'https://i.pravatar.cc/150?u=mike',
    rating: 5
  }
];

export const FEATURES = [
  {
    id: 1,
    title: 'Fresh Daily Stock',
    text: 'Our pantry and dairy items are restocked daily to ensure peak freshness.',
    image: 'https://cdn-icons-png.flaticon.com/512/2329/2329903.png'
  },
  {
    id: 2,
    title: 'Free Fast Delivery',
    text: 'Get your groceries delivered within 60 minutes for free on orders over $50.',
    image: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png'
  },
  {
    id: 3,
    title: 'Secure Payments',
    text: 'Choose between Cash on Delivery or Secure UPI payments via WhatsApp.',
    image: 'https://cdn-icons-png.flaticon.com/512/1019/1019607.png'
  }
];
