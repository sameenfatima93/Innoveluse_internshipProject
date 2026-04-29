import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { API_BASE, AdminProvider } from './context/AdminContext';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Messages from './pages/Messages';
import Coupons from './pages/Coupons';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function AdminLoginGate({ children }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const currentUrl = new URL(window.location.href);
      const tokenFromQuery = currentUrl.searchParams.get('adminToken');

      if (tokenFromQuery) {
        localStorage.setItem('timex_admin_token', tokenFromQuery);
        currentUrl.searchParams.delete('adminToken');
        window.history.replaceState({}, '', `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
      }

      const token = tokenFromQuery || localStorage.getItem('timex_admin_token');
      if (!token) {
        setChecking(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/auth/admin-verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthenticated(res.ok);
        if (!res.ok) {
          localStorage.removeItem('timex_admin_token');
        }
      } catch {
        setAuthenticated(false);
        localStorage.removeItem('timex_admin_token');
      } finally {
        setChecking(false);
      }
    };

    verify();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.message || 'Invalid admin credentials.');
        return;
      }
      localStorage.setItem('timex_admin_token', payload.data.token);
      setAuthenticated(true);
      setError('');
    } catch {
      setError('Unable to login. Please try again.');
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 text-white grid place-items-center">
        <p className="text-slate-300">Checking admin session...</p>
      </div>
    );
  }

  if (authenticated) return children;

  return (
    <div className="min-h-screen bg-slate-950 text-white grid place-items-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
        <p className="text-slate-400 text-sm mb-6">Sign in with your admin credentials.</p>
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
          <Route path="/messages" element={<Messages />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AdminProvider>
    </AdminLoginGate>
  );
}
