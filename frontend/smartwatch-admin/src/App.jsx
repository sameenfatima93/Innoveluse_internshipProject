import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Coupons from './pages/Coupons';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function AdminLoginGate({ children }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem('timex_admin_auth') === 'true');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oneTimeAuth = params.get('adminAuth');
    if (oneTimeAuth === 'admin123') {
      localStorage.setItem('timex_admin_auth', 'true');
      setAuthenticated(true);
      params.delete('adminAuth');
      const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}${window.location.hash}`;
      window.history.replaceState({}, '', next);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id === 'admin123' && password === 'admin123') {
      localStorage.setItem('timex_admin_auth', 'true');
      setAuthenticated(true);
      setError('');
      return;
    }
    setError('Invalid admin credentials.');
  };

  if (authenticated) return children;

  return (
    <div className="min-h-screen bg-slate-950 text-white grid place-items-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
        <p className="text-slate-400 text-sm mb-6">Use the admin credentials to access dashboard.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Admin ID"
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-sky-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-sky-500"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full rounded-lg bg-sky-600 hover:bg-sky-500 py-2 font-semibold">
            Sign In
          </button>
          <p className="text-xs text-slate-500 text-center">ID: admin123 | Password: admin123</p>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AdminLoginGate>
      <AdminProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Users />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AdminProvider>
    </AdminLoginGate>
  );
}
