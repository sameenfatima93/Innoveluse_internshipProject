import { useState } from 'react';
import Layout from '../components/Layout';
import { useAdmin } from '../context/AdminContext';
import { Plus, Search, Edit2, Trash2, X, Star } from 'lucide-react';

const statusColor = {
  active: 'bg-emerald-600/20 text-emerald-400',
  out_of_stock: 'bg-red-600/20 text-red-400',
};

const statusLabel = {
  active: 'Active',
  out_of_stock: 'Out of Stock',
};

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product || {
    name: '', category: 'Smartwatch', brand: '', price: '', stock: '', status: 'active', description: '', image: '', tags: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Product Name *</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-600/50"
                placeholder="ChronoX Pro 5" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Brand *</label>
              <input required value={form.brand} onChange={e => setForm({...form, brand: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-600/50"
                placeholder="ChronoX" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full bg-slate-700/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-600/50">
                <option value="Man">Man</option>
                <option value="Woman">Woman</option>
                <option value="Wrist">Wrist</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                className="w-full bg-slate-700/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-600/50">
                <option value="active">Active</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Price ($) *</label>
              <input required type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-600/50"
                placeholder="299.99" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Stock *</label>
              <input required type="number" min="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-600/50"
                placeholder="100" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Image URL</label>
            <input value={form.image} onChange={e => setForm({...form, image: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-600/50"
              placeholder="https://example.com/product-image.jpg" />
            {form.image && (
              <img src={form.image} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" onError={e => e.target.style.display='none'} />
            )}
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-600/50 resize-none"
              placeholder="Product description..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 text-sm font-medium transition-all">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-all">
              {product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Products() {
  const { products, deleteProduct, addProduct, updateProduct } = useAdmin();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null); // null | 'add' | product object
  const [deleteId, setDeleteId] = useState(null);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter || p.category.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  return (
    <Layout title="Products">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-brand-600/50 w-56" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-400 focus:outline-none focus:border-brand-600/50">
            <option value="all">All Categories</option>
            <option value="man">Man</option>
            <option value="woman">Woman</option>
            <option value="wrist">Wrist</option>
            
          </select>
        </div>
        <button onClick={() => setModal('add')}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold transition-all glow-blue">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Summary */}
      <div className="flex gap-3 mb-5 flex-wrap text-sm">
        <span className="text-slate-500">Total: <span className="text-white font-medium">{products.length}</span></span>
        <span className="text-slate-500">Active: <span className="text-emerald-400 font-medium">{products.filter(p=>p.status==='active').length}</span></span>
        <span className="text-slate-500">Out of Stock: <span className="text-red-400 font-medium">{products.filter(p=>p.status==='out_of_stock').length}</span></span>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Sold', 'Rating', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-slate-500 text-xs font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/3 transition-all">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-xl object-cover" onError={e => e.target.style.display='none'} />
                      <div>
                        <p className="text-white font-medium text-xs">{product.name}</p>
                        <p className="text-slate-600 text-[10px] font-mono">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{product.category}</td>
                  <td className="px-4 py-3 text-white font-medium">${product.price}</td>
                  <td className="px-4 py-3">
                    <span className={product.stock === 0 ? 'text-red-400' : product.stock <= 10 ? 'text-amber-400' : 'text-slate-300'}>{product.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{product.sold}</td>
                  <td className="px-4 py-3">
                    {product.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-slate-300 text-xs">{product.rating}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${statusColor[product.status]}`}>{statusLabel[product.status]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal(product)}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-brand-600/20 hover:text-brand-400 flex items-center justify-center text-slate-400 transition-all">
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => setDeleteId(product.id)}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-600/20 hover:text-red-400 flex items-center justify-center text-slate-400 transition-all">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-600">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {modal && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={modal === 'add' ? addProduct : (data) => updateProduct(modal.id, data)}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteId(null)} />
          <div className="relative glass rounded-2xl p-6 max-w-sm w-full z-10 text-center">
            <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-3">
              <Trash2 size={20} className="text-red-400" />
            </div>
            <h3 className="text-white font-semibold mb-1">Delete Product?</h3>
            <p className="text-slate-500 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm transition-all">Cancel</button>
              <button onClick={() => { deleteProduct(deleteId); setDeleteId(null); }}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
