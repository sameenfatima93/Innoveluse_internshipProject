import Layout from '../components/Layout';
import { revenueData, categoryData, products } from '../data/mockData';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { TrendingUp, Package, ShoppingCart, DollarSign } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-xl px-4 py-3 text-xs">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {p.name}: {p.name === 'revenue' || p.name === 'Revenue' ? '$' : ''}{p.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);

export default function Analytics() {
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = revenueData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  return (
    <Layout title="Analytics">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Annual Revenue', value: `$${(totalRevenue/1000).toFixed(1)}k`, icon: DollarSign, color: 'text-brand-400 bg-brand-600/20' },
          { label: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: 'text-purple-400 bg-purple-600/20' },
          { label: 'Avg Order Value', value: `$${avgOrderValue}`, icon: TrendingUp, color: 'text-emerald-400 bg-emerald-600/20' },
          { label: 'Active Products', value: products.filter(p=>p.status==='active').length, icon: Package, color: 'text-amber-400 bg-amber-600/20' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={16} />
            </div>
            <div>
              <p className="text-slate-500 text-xs">{label}</p>
              <p className="text-xl font-bold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue vs Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="glass rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1">Monthly Revenue</h3>
          <p className="text-slate-500 text-xs mb-4">Revenue trend over 12 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0ea5e9" strokeWidth={2} fill="url(#aGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1">Monthly Orders</h3>
          <p className="text-slate-500 text-xs mb-4">Order volume over 12 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" name="Orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1">Category Distribution</h3>
          <p className="text-slate-500 text-xs mb-4">Sales breakdown by category</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {categoryData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {categoryData.map(c => (
                <div key={c.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                    <span className="text-slate-400 text-xs">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.value}%`, background: c.color }} />
                    </div>
                    <span className="text-white text-xs font-medium w-8 text-right">{c.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1">Top Selling Products</h3>
          <p className="text-slate-500 text-xs mb-4">By units sold</p>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-slate-600 text-xs font-mono w-4">#{i + 1}</span>
                <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" onError={e => e.target.style.display='none'} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-xs font-medium truncate">{p.name}</p>
                  <div className="h-1 rounded-full bg-white/5 mt-1 overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(p.sold / topProducts[0].sold) * 100}%` }} />
                  </div>
                </div>
                <span className="text-white text-xs font-bold">{p.sold}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
