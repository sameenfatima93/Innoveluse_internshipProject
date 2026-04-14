import { useState } from 'react';
import { Bell, Search, X, Check } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const typeColors = {
  order: 'bg-brand-600/20 text-brand-400',
  stock: 'bg-amber-600/20 text-amber-400',
  user: 'bg-purple-600/20 text-purple-400',
};

export default function Topbar({ title }) {
  const { notifications, unreadCount, markAllRead, sidebarOpen } = useAdmin();
  const [showNotifs, setShowNotifs] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-16 flex items-center justify-between px-6 transition-all duration-300 ${
        sidebarOpen ? 'left-60' : 'left-16'
      }`}
      style={{ background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
    >
      <h1 className="text-lg font-semibold text-white">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-brand-600/50 w-52 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={12} className="text-slate-500" />
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-600/40 transition-all relative"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 rounded-2xl overflow-hidden shadow-2xl z-50"
              style={{ background: '#0d1426', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <span className="text-sm font-semibold text-white">Notifications</span>
                <button onClick={markAllRead} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                  <Check size={12} /> Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto scrollbar-thin">
                {notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 border-b border-white/5 flex items-start gap-3 hover:bg-white/3 transition-all ${!n.read ? 'bg-brand-600/5' : ''}`}>
                    <span className={`badge ${typeColors[n.type]} mt-0.5 flex-shrink-0`}>{n.type}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300">{n.message}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1.5" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white cursor-pointer">
          AD
        </div>
      </div>

      {showNotifs && (
        <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
      )}
    </header>
  );
}
