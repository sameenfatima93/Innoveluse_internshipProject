import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag,
  BarChart2, Settings, ChevronLeft, ChevronRight, Watch
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Products', path: '/products' },
  { icon: ShoppingCart, label: 'Orders', path: '/orders' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: Tag, label: 'Coupons', path: '/coupons' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAdmin();

  const handleAdminLogout = async () => {
    const token = localStorage.getItem('timex_admin_token');
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ role: 'admin' }),
      });
    } catch {
      // Always allow local logout fallback.
    } finally {
      localStorage.removeItem('timex_admin_token');
      window.location.href = '/';
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-30 flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'w-60' : 'w-16'
      }`}
      style={{ background: 'rgba(10,15,30,0.98)', borderRight: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0">
          <Watch size={16} className="text-white" />
        </div>
        {sidebarOpen && (
          <div>
            <span className="font-bold text-white text-sm tracking-tight">ChronoAdmin</span>
            <p className="text-[10px] text-slate-500 font-mono">v1.0 Dashboard</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto scrollbar-thin">
        {sidebarOpen && (
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold px-3 mb-2">Main Menu</p>
        )}
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              } ${!sidebarOpen ? 'justify-center' : ''}`
            }
            title={!sidebarOpen ? label : ''}
          >
            <Icon size={18} className="flex-shrink-0" />
            {sidebarOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Toggle Button */}
      <div className="p-2 border-t border-white/5">
        <button
          onClick={handleAdminLogout}
          className={`mb-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm ${!sidebarOpen ? 'justify-center' : ''}`}
          title={!sidebarOpen ? 'Logout' : ''}
        >
          {sidebarOpen ? <span>Logout</span> : <span>⎋</span>}
        </button>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all text-sm ${!sidebarOpen ? 'justify-center' : ''}`}
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          {sidebarOpen && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
