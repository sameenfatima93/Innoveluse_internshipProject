import Layout from '../components/Layout';
import { dashboardStats, revenueData, categoryData, recentActivity, orders } from '../data/mockData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, ShoppingCart, Package, Users, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, growth, color }) => (
  <div className="stat-card">
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} />
      </div>
      <span className={`badge ${growth >= 0 ? 'bg-emerald-600/20 text-emerald-400' : 'bg-red-600/20 text-red-400'}`}>
        {growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {Math.abs(growth)}%
      </span>
    </div>
    <div>
      <p className="text-slate-500 text-xs font-medium">{label}</p>
      <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-xl px-4 py-3 text-sm">
        <p className="text-slate-400 mb-1">{label}</p>
        <p className="text-brand-400 font-semibold">${payload[0]?.value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const typeIcon = { order: '🛒', product: '📦', coupon: '🏷️', user: '👤' };

export default function Dashboard() {
  const recentOrders = orders.slice(0, 5);

  const statusColor = {
    delivered: 'bg-emerald-600/20 text-emerald-400',
    shipped: 'bg-brand-600/20 text-brand-400',
    processing: 'bg-amber-600/20 text-amber-400',
    pending: 'bg-slate-600/20 text-slate-400',
    cancelled: 'bg-red-600/20 text-red-400',
  };

  return (
    <Layout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${dashboardStats.totalRevenue.toLocaleString()}`} growth={dashboardStats.revenueGrowth} color="bg-brand-600/20 text-brand-400" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={dashboardStats.totalOrders.toLocaleString()} growth={dashboardStats.ordersGrowth} color="bg-purple-600/20 text-purple-400" />
        <StatCard icon={Package} label="Products" value={dashboardStats.totalProducts} growth={dashboardStats.productsGrowth} color="bg-amber-600/20 text-amber-400" />
        <StatCard icon={Users} label="Active Users" value={dashboardStats.activeUsers} growth={dashboardStats.usersGrowth} color="bg-emerald-600/20 text-emerald-400" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue Chart */}
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-semibold">Revenue Overview</h3>
              <p className="text-slate-500 text-xs mt-0.5">Monthly revenue for 2024</p>
            </div>
            <span className="badge bg-emerald-600/20 text-emerald-400">
              <TrendingUp size={12} /> +18.4% YoY
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1">Sales by Category</h3>
          <p className="text-slate-500 text-xs mb-4">Product category breakdown</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-slate-400">{c.name}</span>
                </div>
                <span className="text-white font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Orders</h3>
            <Link to="/orders" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-slate-500 text-xs font-medium pb-2">Order</th>
                  <th className="text-left text-slate-500 text-xs font-medium pb-2">Customer</th>
                  <th className="text-left text-slate-500 text-xs font-medium pb-2">Amount</th>
                  <th className="text-left text-slate-500 text-xs font-medium pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/3 transition-all">
                    <td className="py-2.5 text-brand-400 font-mono text-xs">{order.id}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-600/40 to-purple-600/40 flex items-center justify-center text-[10px] font-bold text-white">
                          {order.avatar}
                        </div>
                        <span className="text-slate-300 text-xs">{order.customer}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-white font-medium">${order.amount}</td>
                    <td className="py-2.5">
                      <span className={`badge ${statusColor[order.status]}`}>{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((act, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-base flex-shrink-0">
                  {typeIcon[act.type]}
                </div>
                <div>
                  <p className="text-sm text-slate-300">{act.action}</p>
                  <p className="text-xs text-slate-600">{act.detail}</p>
                  <p className="text-[10px] text-slate-700 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
