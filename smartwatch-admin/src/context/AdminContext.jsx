import { createContext, useContext, useState } from 'react';
import { products as initialProducts, orders as initialOrders, users as initialUsers, coupons as initialCoupons, notifications as initialNotifications } from '../data/mockData';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [users, setUsers] = useState(initialUsers);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));

  const updateUserStatus = (id, status) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
  };

  const deleteCoupon = (id) => setCoupons(prev => prev.filter(c => c.id !== id));

  const addProduct = (product) => {
    const id = 'P' + String(products.length + 1).padStart(3, '0');
    setProducts(prev => [{ ...product, id, sold: 0, rating: 0 }, ...prev]);
  };

  const addCoupon = (coupon) => {
    const id = 'C' + String(coupons.length + 1).padStart(3, '0');
    setCoupons(prev => [{ ...coupon, id, usedCount: 0 }, ...prev]);
  };

  return (
    <AdminContext.Provider value={{
      products, setProducts, orders, users, coupons, notifications,
      sidebarOpen, setSidebarOpen, unreadCount, markAllRead,
      updateOrderStatus, deleteProduct, updateUserStatus, deleteCoupon,
      addProduct, addCoupon,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
