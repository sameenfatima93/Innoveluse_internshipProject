import { createContext, useContext, useEffect, useState } from 'react';

const AdminContext = createContext();
const API_BASE = 'http://localhost:5000/api';

export function AdminProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const loadData = async () => {
    try {
      const [productsRes, ordersRes, usersRes, couponsRes, notificationsRes] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/orders`),
        fetch(`${API_BASE}/users`),
        fetch(`${API_BASE}/coupons`),
        fetch(`${API_BASE}/notifications`),
      ]);

      const [productsPayload, ordersPayload, usersPayload, couponsPayload, notificationsPayload] = await Promise.all([
        productsRes.json(),
        ordersRes.json(),
        usersRes.json(),
        couponsRes.json(),
        notificationsRes.json(),
      ]);

      setProducts(productsPayload.data || []);
      setOrders(ordersPayload.data || []);
      setUsers(usersPayload.data || []);
      setCoupons(couponsPayload.data || []);
      setNotifications(notificationsPayload.data || []);
    } catch {
      // Keep previous state if backend is temporarily unavailable.
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 8000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    await fetch(`${API_BASE}/notifications/mark-all-read`, { method: 'POST' });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateOrderStatus = async (id, status) => {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    }
  };

  const deleteProduct = async (id) => {
    const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    if (res.ok) setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateProduct = async (id, product) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const payload = await res.json();
    if (res.ok) {
      setProducts(prev => prev.map(p => p.id === id ? payload.data : p));
    }
  };

  const updateUserStatus = async (id, status) => {
    const res = await fetch(`${API_BASE}/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
  };

  const deleteCoupon = async (id) => {
    const res = await fetch(`${API_BASE}/coupons/${id}`, { method: 'DELETE' });
    if (res.ok) setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const addProduct = async (product) => {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const payload = await res.json();
    if (res.ok) setProducts(prev => [payload.data, ...prev]);
  };

  const addCoupon = async (coupon) => {
    const res = await fetch(`${API_BASE}/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coupon),
    });
    const payload = await res.json();
    if (res.ok) setCoupons(prev => [payload.data, ...prev]);
  };

  return (
    <AdminContext.Provider value={{
      products, setProducts, orders, users, coupons, notifications,
      sidebarOpen, setSidebarOpen, unreadCount, markAllRead,
      updateOrderStatus, deleteProduct, updateUserStatus, deleteCoupon,
      addProduct, addCoupon, updateProduct,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
