// ─── Dashboard Stats ───────────────────────────────
export const dashboardStats = {
  totalRevenue: 284750,
  totalOrders: 1843,
  totalProducts: 64,
  activeUsers: 392,
  revenueGrowth: 18.4,
  ordersGrowth: 12.1,
  productsGrowth: 6.3,
  usersGrowth: 9.7,
};

// ─── Revenue Chart Data ────────────────────────────
export const revenueData = [
  { month: 'Jan', revenue: 18200, orders: 142 },
  { month: 'Feb', revenue: 21500, orders: 168 },
  { month: 'Mar', revenue: 19800, orders: 155 },
  { month: 'Apr', revenue: 24600, orders: 192 },
  { month: 'May', revenue: 22100, orders: 175 },
  { month: 'Jun', revenue: 28400, orders: 221 },
  { month: 'Jul', revenue: 31200, orders: 244 },
  { month: 'Aug', revenue: 29800, orders: 232 },
  { month: 'Sep', revenue: 34500, orders: 268 },
  { month: 'Oct', revenue: 38900, orders: 304 },
  { month: 'Nov', revenue: 42100, orders: 328 },
  { month: 'Dec', revenue: 33650, orders: 274 },
];

// ─── Category Sales ────────────────────────────────
export const categoryData = [
  { name: 'Smartwatches', value: 45, color: '#0ea5e9' },
  { name: 'Straps & Bands', value: 22, color: '#8b5cf6' },
  { name: 'Chargers', value: 15, color: '#f59e0b' },
  { name: 'Screen Guards', value: 10, color: '#10b981' },
  { name: 'Cases', value: 8, color: '#f43f5e' },
];

// ─── Products ──────────────────────────────────────
export const products = [
  {
    id: 'P001',
    name: 'ChronoX Pro 5',
    category: 'Smartwatch',
    brand: 'ChronoX',
    price: 349.99,
    stock: 84,
    sold: 312,
    rating: 4.8,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop',
    tags: ['bestseller', 'gps', 'health'],
    description: 'Premium smartwatch with advanced health monitoring.',
  },
  {
    id: 'P002',
    name: 'AeroWatch Lite',
    category: 'Smartwatch',
    brand: 'AeroWatch',
    price: 199.99,
    stock: 120,
    sold: 245,
    rating: 4.5,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=80&h=80&fit=crop',
    tags: ['budget', 'fitness'],
    description: 'Lightweight fitness-focused smartwatch.',
  },
  {
    id: 'P003',
    name: 'Luxe Series 2',
    category: 'Smartwatch',
    brand: 'Luxe',
    price: 599.99,
    stock: 32,
    sold: 189,
    rating: 4.9,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=80&h=80&fit=crop',
    tags: ['premium', 'luxury', 'ecg'],
    description: 'Luxury smartwatch with premium materials.',
  },
  {
    id: 'P004',
    name: 'SportPro Band 3',
    category: 'Strap',
    brand: 'ChronoX',
    price: 34.99,
    stock: 0,
    sold: 428,
    rating: 4.3,
    status: 'out_of_stock',
    image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=80&h=80&fit=crop',
    tags: ['strap', 'sport'],
    description: 'Durable sport band compatible with multiple models.',
  },
  {
    id: 'P005',
    name: 'TurboCharge Dock',
    category: 'Charger',
    brand: 'ChronoX',
    price: 49.99,
    stock: 215,
    sold: 391,
    rating: 4.6,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1585689499330-2f3dc7e3f0e6?w=80&h=80&fit=crop',
    tags: ['charger', 'wireless'],
    description: 'Fast wireless charging dock.',
  },
  {
    id: 'P006',
    name: 'NexGen Watch 4',
    category: 'Smartwatch',
    brand: 'NexGen',
    price: 279.99,
    stock: 67,
    sold: 156,
    rating: 4.4,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=80&h=80&fit=crop',
    tags: ['new', 'cellular'],
    description: 'Next generation watch with cellular connectivity.',
  },
  {
    id: 'P007',
    name: 'FitBand Ultra',
    category: 'Smartwatch',
    brand: 'FitBand',
    price: 129.99,
    stock: 8,
    sold: 203,
    rating: 4.2,
    status: 'low_stock',
    image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=80&h=80&fit=crop',
    tags: ['fitness', 'sleep'],
    description: 'Budget fitness tracker with sleep monitoring.',
  },
  {
    id: 'P008',
    name: 'Classic Leather Band',
    category: 'Strap',
    brand: 'Luxe',
    price: 59.99,
    stock: 145,
    sold: 267,
    rating: 4.7,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=80&h=80&fit=crop',
    tags: ['leather', 'premium'],
    description: 'Premium genuine leather watch strap.',
  },
];

// ─── Orders ────────────────────────────────────────
export const orders = [
  { id: 'ORD-4821', customer: 'Ahmed Hassan', email: 'ahmed@email.com', product: 'ChronoX Pro 5', amount: 349.99, status: 'delivered', date: '2024-12-10', items: 1, avatar: 'AH' },
  { id: 'ORD-4820', customer: 'Sara Khan', email: 'sara@email.com', product: 'Luxe Series 2', amount: 659.98, status: 'shipped', date: '2024-12-10', items: 2, avatar: 'SK' },
  { id: 'ORD-4819', customer: 'Omar Ali', email: 'omar@email.com', product: 'AeroWatch Lite', amount: 199.99, status: 'processing', date: '2024-12-09', items: 1, avatar: 'OA' },
  { id: 'ORD-4818', customer: 'Fatima Noor', email: 'fatima@email.com', product: 'SportPro Band 3', amount: 34.99, status: 'pending', date: '2024-12-09', items: 1, avatar: 'FN' },
  { id: 'ORD-4817', customer: 'Bilal Sheikh', email: 'bilal@email.com', product: 'TurboCharge Dock', amount: 99.98, status: 'delivered', date: '2024-12-08', items: 2, avatar: 'BS' },
  { id: 'ORD-4816', customer: 'Zainab Malik', email: 'zainab@email.com', product: 'NexGen Watch 4', amount: 279.99, status: 'cancelled', date: '2024-12-08', items: 1, avatar: 'ZM' },
  { id: 'ORD-4815', customer: 'Hasan Raza', email: 'hasan@email.com', product: 'FitBand Ultra', amount: 129.99, status: 'shipped', date: '2024-12-07', items: 1, avatar: 'HR' },
  { id: 'ORD-4814', customer: 'Amna Tariq', email: 'amna@email.com', product: 'Classic Leather Band', amount: 59.99, status: 'delivered', date: '2024-12-07', items: 1, avatar: 'AT' },
  { id: 'ORD-4813', customer: 'Usman Ghani', email: 'usman@email.com', product: 'ChronoX Pro 5', amount: 699.98, status: 'processing', date: '2024-12-06', items: 2, avatar: 'UG' },
  { id: 'ORD-4812', customer: 'Rabia Javed', email: 'rabia@email.com', product: 'Luxe Series 2', amount: 599.99, status: 'delivered', date: '2024-12-06', items: 1, avatar: 'RJ' },
];

// ─── Users (Simplified) ────────────────────────────
export const users = [
  { id: 'U001', name: 'Ahmed Hassan', email: 'ahmed@email.com', phone: '+92-300-1234567', orders: 8, totalSpent: 2840, joinDate: '2024-01-15', status: 'active', avatar: 'AH' },
  { id: 'U002', name: 'Sara Khan', email: 'sara@email.com', phone: '+92-301-2345678', orders: 12, totalSpent: 4200, joinDate: '2024-02-20', status: 'active', avatar: 'SK' },
  { id: 'U003', name: 'Omar Ali', email: 'omar@email.com', phone: '+92-302-3456789', orders: 3, totalSpent: 650, joinDate: '2024-05-10', status: 'active', avatar: 'OA' },
  { id: 'U004', name: 'Fatima Noor', email: 'fatima@email.com', phone: '+92-303-4567890', orders: 0, totalSpent: 0, joinDate: '2024-11-01', status: 'inactive', avatar: 'FN' },
  { id: 'U005', name: 'Bilal Sheikh', email: 'bilal@email.com', phone: '+92-304-5678901', orders: 6, totalSpent: 1890, joinDate: '2024-03-18', status: 'active', avatar: 'BS' },
  { id: 'U006', name: 'Zainab Malik', email: 'zainab@email.com', phone: '+92-305-6789012', orders: 2, totalSpent: 430, joinDate: '2024-07-22', status: 'blocked', avatar: 'ZM' },
  { id: 'U007', name: 'Hasan Raza', email: 'hasan@email.com', phone: '+92-306-7890123', orders: 15, totalSpent: 5200, joinDate: '2023-12-05', status: 'active', avatar: 'HR' },
  { id: 'U008', name: 'Amna Tariq', email: 'amna@email.com', phone: '+92-307-8901234', orders: 4, totalSpent: 980, joinDate: '2024-04-14', status: 'active', avatar: 'AT' },
];

// ─── Coupons ───────────────────────────────────────
export const coupons = [
  { id: 'C001', code: 'CHRONO20', type: 'percentage', value: 20, minOrder: 200, usageLimit: 100, usedCount: 67, expiry: '2024-12-31', status: 'active' },
  { id: 'C002', code: 'NEWUSER50', type: 'flat', value: 50, minOrder: 150, usageLimit: 50, usedCount: 50, expiry: '2024-12-15', status: 'expired' },
  { id: 'C003', code: 'LUXE15', type: 'percentage', value: 15, minOrder: 500, usageLimit: 200, usedCount: 23, expiry: '2025-01-31', status: 'active' },
  { id: 'C004', code: 'FLASH30', type: 'percentage', value: 30, minOrder: 100, usageLimit: 30, usedCount: 30, expiry: '2024-11-30', status: 'expired' },
  { id: 'C005', code: 'SAVE100', type: 'flat', value: 100, minOrder: 600, usageLimit: 75, usedCount: 12, expiry: '2025-03-31', status: 'active' },
];

// ─── Notifications ─────────────────────────────────
export const notifications = [
  { id: 1, type: 'order', message: 'New order #ORD-4821 received', time: '2 min ago', read: false },
  { id: 2, type: 'stock', message: 'FitBand Ultra is low on stock (8 left)', time: '15 min ago', read: false },
  { id: 3, type: 'user', message: 'New user registered: Omar Ali', time: '1 hr ago', read: false },
  { id: 4, type: 'order', message: 'Order #ORD-4816 was cancelled', time: '2 hr ago', read: true },
  { id: 5, type: 'stock', message: 'SportPro Band 3 is out of stock', time: '3 hr ago', read: true },
];

// ─── Recent Activity ───────────────────────────────
export const recentActivity = [
  { action: 'New order placed', detail: '#ORD-4821 — Ahmed Hassan', time: '2 min ago', type: 'order' },
  { action: 'Product updated', detail: 'ChronoX Pro 5 price changed', time: '18 min ago', type: 'product' },
  { action: 'Coupon created', detail: 'SAVE100 — $100 off', time: '1 hr ago', type: 'coupon' },
  { action: 'Order shipped', detail: '#ORD-4815 — Hasan Raza', time: '2 hr ago', type: 'order' },
  { action: 'User blocked', detail: 'Zainab Malik account suspended', time: '4 hr ago', type: 'user' },
];
