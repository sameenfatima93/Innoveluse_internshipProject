import { useState } from 'react';
import Layout from '../components/Layout';
import { useAdmin } from '../context/AdminContext';
import { Search, Filter, Eye, X, ChevronDown } from 'lucide-react';

const statusColor = {
  delivered: 'bg-emerald-600/20 text-emerald-400',
  out_for_delivery: 'bg-brand-600/20 text-brand-400',
  packed: 'bg-amber-600/20 text-amber-400',
  pending: 'bg-slate-600/20 text-slate-400',
  cancelled: 'bg-red-600/20 text-red-400',
};

const allStatuses = ['pending', 'packed', 'out_for_delivery', 'delivered'];

const statusLabel = (status) => status.replaceAll('_', ' ');

function OrderModal({ order, onClose, onUpdateStatus }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">Order Details</h2>
          <button onClick={onClose}><X size={18} className="text-slate-500 hover:text-white" /></button>
        </div>
        <div className="space-y-3">
          <div className="glass rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-brand-400 font-mono font-bold">{order.id}</p>
                <p className="text-slate-500 text-xs mt-0.5">{order.date}</p>
              </div>
              <span className={`badge ${statusColor[order.status] || 'bg-slate-600/20 text-slate-400'} capitalize`}>{statusLabel(order.status)}</span>
            </div>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-slate-500 text-xs mb-2 uppercase tracking-wider">Customer</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600/40 to-purple-600/40 flex items-center justify-center text-sm font-bold text-white">
                {order.avatar}
              </div>
              <div>
                <p className="text-white font-medium">{order.customer}</p>
                <p className="text-slate-500 text-xs">{order.email}</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-slate-500 text-xs mb-2 uppercase tracking-wider">Product</p>
            <p className="text-white">{order.product}</p>
            <div className="flex justify-between mt-2">
              <span className="text-slate-500 text-xs">Items: {order.items}</span>
              <span className="text-white font-bold">${order.amount}</span>
            </div>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-2 uppercase tracking-wider">Update Status</p>
            <div className="grid grid-cols-3 gap-2">
              {allStatuses.map(s => (
                <button key={s} onClick={() => { onUpdateStatus(order.id, s); onClose(); }}
                  className={`py-2 rounded-xl text-xs font-medium transition-all border ${
                    order.status === s
                      ? `${statusColor[s]} border-current`
                      : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:border-white/20'
                  }`}>
                  <span className="capitalize">{statusLabel(s)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const { orders, updateOrderStatus } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = allStatuses.reduce((acc, s) => ({ ...acc, [s]: orders.filter(o => o.status === s).length }), {});

  return (
    <Layout title="Orders">
      {/* Status Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
            statusFilter === 'all' ? 'bg-brand-600/20 text-brand-400 border-brand-600/30' : 'glass text-slate-400 hover:text-white border-transparent'
          }`}>
          All <span className="ml-1 text-xs opacity-70">{orders.length}</span>
        </button>
        {allStatuses.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border capitalize ${
              statusFilter === s ? `${statusColor[s]} border-current` : 'glass text-slate-400 hover:text-white border-transparent'
            }`}>
            <span className="capitalize">{statusLabel(s)}</span> <span className="ml-1 text-xs opacity-70">{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-brand-600/50" />
        </div>
        <p className="text-slate-500 text-sm ml-auto">{filtered.length} orders</p>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5">
              <tr>
                {['Order ID', 'Customer', 'Product', 'Items', 'Amount', 'Date', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left text-slate-500 text-xs font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/3 transition-all">
                  <td className="px-4 py-3 text-brand-400 font-mono text-xs font-bold">{order.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-600/40 to-purple-600/40 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                        {order.avatar}
                      </div>
                      <div>
                        <p className="text-slate-200 text-xs font-medium">{order.customer}</p>
                        <p className="text-slate-600 text-[10px]">{order.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs max-w-[120px] truncate">{order.product}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{order.items}</td>
                  <td className="px-4 py-3 text-white font-semibold">${order.amount}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{order.date}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${statusColor[order.status] || 'bg-slate-600/20 text-slate-400'} capitalize`}>{statusLabel(order.status)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedOrder(order)}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-brand-600/20 hover:text-brand-400 flex items-center justify-center text-slate-400 transition-all">
                      <Eye size={12} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-600">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdateStatus={updateOrderStatus} />
      )}
    </Layout>
  );
}
