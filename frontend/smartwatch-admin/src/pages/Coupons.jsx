import { useState } from 'react';
import Layout from '../components/Layout';
import { useAdmin } from '../context/AdminContext';
import { Plus, Trash2, X, Tag, Copy, Check } from 'lucide-react';

const statusColor = {
  active: 'bg-emerald-600/20 text-emerald-400',
  expired: 'bg-red-600/20 text-red-400',
};

function CouponModal({ onClose, onSave }) {
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', minOrder: '', usageLimit: '', expiry: '', status: 'active' });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, value: parseFloat(form.value), minOrder: parseFloat(form.minOrder), usageLimit: parseInt(form.usageLimit) });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg">Create Coupon</h2>
          <button onClick={onClose}><X size={18} className="text-slate-500 hover:text-white" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Coupon Code *</label>
            <input required value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-brand-600/50 uppercase"
              placeholder="SAVE20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Discount Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-600/50">
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Discount Value *</label>
              <input required type="number" min="1" value={form.value} onChange={e => setForm({...form, value: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-600/50"
                placeholder={form.type === 'percentage' ? '20' : '50'} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Min Order ($) *</label>
              <input required type="number" min="0" value={form.minOrder} onChange={e => setForm({...form, minOrder: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-600/50"
                placeholder="100" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Usage Limit *</label>
              <input required type="number" min="1" value={form.usageLimit} onChange={e => setForm({...form, usageLimit: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-600/50"
                placeholder="100" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Expiry Date *</label>
            <input required type="date" value={form.expiry} onChange={e => setForm({...form, expiry: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-600/50" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm font-medium transition-all">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-all">Create Coupon</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Coupons() {
  const { coupons, deleteCoupon, addCoupon } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Layout title="Coupons">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3 text-sm">
          <span className="text-slate-500">Total: <span className="text-white font-medium">{coupons.length}</span></span>
          <span className="text-slate-500">Active: <span className="text-emerald-400 font-medium">{coupons.filter(c=>c.status==='active').length}</span></span>
          <span className="text-slate-500">Expired: <span className="text-red-400 font-medium">{coupons.filter(c=>c.status==='expired').length}</span></span>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold transition-all glow-blue">
          <Plus size={16} /> New Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {coupons.map(coupon => {
          const usagePercent = Math.round((coupon.usedCount / coupon.usageLimit) * 100);
          return (
            <div key={coupon.id} className="glass rounded-2xl p-5 hover:border-white/15 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-600/20 flex items-center justify-center">
                    <Tag size={16} className="text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold font-mono text-sm">{coupon.code}</p>
                      <button onClick={() => handleCopy(coupon.code)} className="text-slate-600 hover:text-brand-400 transition-colors">
                        {copied === coupon.code ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                    <p className="text-slate-500 text-xs">{coupon.type === 'percentage' ? `${coupon.value}% off` : `$${coupon.value} off`}</p>
                  </div>
                </div>
                <span className={`badge ${statusColor[coupon.status]}`}>{coupon.status}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Min Order</span>
                  <span className="text-slate-300">${coupon.minOrder}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Expires</span>
                  <span className="text-slate-300">{coupon.expiry}</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Usage</span>
                    <span className="text-slate-300">{coupon.usedCount} / {coupon.usageLimit}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${usagePercent >= 100 ? 'bg-red-500' : usagePercent >= 75 ? 'bg-amber-500' : 'bg-brand-500'}`}
                      style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <button onClick={() => deleteCoupon(coupon.id)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-600/10 text-red-400 hover:bg-red-600/20 text-xs font-medium transition-all border border-red-600/20">
                <Trash2 size={12} /> Delete Coupon
              </button>
            </div>
          );
        })}
      </div>

      {showModal && <CouponModal onClose={() => setShowModal(false)} onSave={addCoupon} />}
    </Layout>
  );
}
