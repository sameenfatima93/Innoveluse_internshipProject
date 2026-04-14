import { useState } from 'react';
import Layout from '../components/Layout';
import { useAdmin } from '../context/AdminContext';
import { Search, UserCheck, UserX, ShoppingBag } from 'lucide-react';

const statusColor = {
  active: 'bg-emerald-600/20 text-emerald-400',
  inactive: 'bg-slate-600/20 text-slate-400',
  blocked: 'bg-red-600/20 text-red-400',
};

export default function Users() {
  const { users, updateUserStatus } = useAdmin();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <Layout title="Manage Users">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Users', value: users.length, color: 'text-white', bg: 'bg-white/5' },
          { label: 'Active', value: users.filter(u=>u.status==='active').length, color: 'text-emerald-400', bg: 'bg-emerald-600/10' },
          { label: 'Blocked', value: users.filter(u=>u.status==='blocked').length, color: 'text-red-400', bg: 'bg-red-600/10' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`glass rounded-2xl p-4 ${bg}`}>
            <p className="text-slate-500 text-xs">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-brand-600/50 w-56" />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive', 'blocked'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all border ${
                filter === s ? 'bg-brand-600/20 text-brand-400 border-brand-600/30' : 'glass text-slate-400 hover:text-white border-transparent'
              }`}>
              {s}
            </button>
          ))}
        </div>
        <p className="text-slate-600 text-xs ml-auto">{filtered.length} users</p>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(user => (
          <div key={user.id} className="glass rounded-2xl p-5 hover:border-white/15 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-600/60 to-purple-600/60 flex items-center justify-center text-sm font-bold text-white">
                  {user.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{user.name}</p>
                  <p className="text-slate-500 text-xs">{user.email}</p>
                </div>
              </div>
              <span className={`badge ${statusColor[user.status]} capitalize`}>{user.status}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-xl bg-white/3">
              <div className="text-center">
                <p className="text-white font-bold text-sm">{user.orders}</p>
                <p className="text-slate-600 text-[10px]">Orders</p>
              </div>
              <div className="text-center border-x border-white/5">
                <p className="text-white font-bold text-sm">${user.totalSpent.toLocaleString()}</p>
                <p className="text-slate-600 text-[10px]">Spent</p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-xs font-medium">{user.joinDate.split('-')[0]}</p>
                <p className="text-slate-600 text-[10px]">Joined</p>
              </div>
            </div>

            <div className="flex gap-2">
              {user.status !== 'blocked' ? (
                <button onClick={() => updateUserStatus(user.id, 'blocked')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-600/10 text-red-400 hover:bg-red-600/20 text-xs font-medium transition-all border border-red-600/20">
                  <UserX size={12} /> Block
                </button>
              ) : (
                <button onClick={() => updateUserStatus(user.id, 'active')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 text-xs font-medium transition-all border border-emerald-600/20">
                  <UserCheck size={12} /> Unblock
                </button>
              )}
              <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 text-slate-400 hover:text-brand-400 hover:bg-brand-600/10 text-xs font-medium transition-all border border-white/10">
                <ShoppingBag size={12} /> Orders
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-10 text-slate-600">No users found</div>
        )}
      </div>
    </Layout>
  );
}
