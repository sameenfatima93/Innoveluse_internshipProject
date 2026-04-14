import { useState } from 'react';
import Layout from '../components/Layout';
import { Save, Store, Bell, Shield, Globe } from 'lucide-react';

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)}
    className={`relative w-10 h-5 rounded-full transition-all duration-300 ${value ? 'bg-brand-600' : 'bg-white/10'}`}>
    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${value ? 'left-5' : 'left-0.5'}`} />
  </button>
);

export default function Settings() {
  const [settings, setSettings] = useState({
    storeName: 'ChronoWatch Store',
    storeEmail: 'admin@chronowatch.com',
    currency: 'USD',
    timezone: 'Asia/Karachi',
    orderNotifs: true,
    stockNotifs: true,
    userNotifs: false,
    twoFactor: false,
    maintenanceMode: false,
    allowRegistration: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  return (
    <Layout title="Settings">
      <div className="max-w-2xl space-y-5">
        {/* Store Settings */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Store size={16} className="text-brand-400" />
            <h3 className="text-white font-semibold">Store Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Store Name</label>
              <input value={settings.storeName} onChange={e => set('storeName', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-600/50" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Admin Email</label>
              <input type="email" value={settings.storeEmail} onChange={e => set('storeEmail', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-600/50" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Currency</label>
                <select value={settings.currency} onChange={e => set('currency', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-600/50">
                  <option value="USD">USD ($)</option>
                  <option value="PKR">PKR (₨)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Timezone</label>
                <select value={settings.timezone} onChange={e => set('timezone', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-600/50">
                  <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={16} className="text-brand-400" />
            <h3 className="text-white font-semibold">Notifications</h3>
          </div>
          <div className="space-y-4">
            {[
              { key: 'orderNotifs', label: 'Order notifications', desc: 'Get notified when new orders come in' },
              { key: 'stockNotifs', label: 'Low stock alerts', desc: 'Alert when product stock falls below threshold' },
              { key: 'userNotifs', label: 'New user alerts', desc: 'Notify when new users register' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm font-medium">{label}</p>
                  <p className="text-slate-600 text-xs">{desc}</p>
                </div>
                <Toggle value={settings[key]} onChange={v => set(key, v)} />
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={16} className="text-brand-400" />
            <h3 className="text-white font-semibold">Security</h3>
          </div>
          <div className="space-y-4">
            {[
              { key: 'twoFactor', label: 'Two-factor authentication', desc: 'Add an extra layer of security' },
              { key: 'allowRegistration', label: 'Allow new registrations', desc: 'Let new customers create accounts' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm font-medium">{label}</p>
                  <p className="text-slate-600 text-xs">{desc}</p>
                </div>
                <Toggle value={settings[key]} onChange={v => set(key, v)} />
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance */}
        <div className="glass rounded-2xl p-5 border border-amber-600/20">
          <div className="flex items-center gap-2 mb-5">
            <Globe size={16} className="text-amber-400" />
            <h3 className="text-white font-semibold">Site Controls</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm font-medium">Maintenance Mode</p>
              <p className="text-slate-600 text-xs">Temporarily disable the storefront for customers</p>
            </div>
            <Toggle value={settings.maintenanceMode} onChange={v => set('maintenanceMode', v)} />
          </div>
          {settings.maintenanceMode && (
            <div className="mt-3 px-3 py-2.5 rounded-xl bg-amber-600/10 border border-amber-600/20">
              <p className="text-amber-400 text-xs">⚠️ Maintenance mode is ON — customers cannot access the store</p>
            </div>
          )}
        </div>

        <button onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
            saved ? 'bg-emerald-600 text-white' : 'bg-brand-600 hover:bg-brand-500 text-white glow-blue'
          }`}>
          <Save size={16} />
          {saved ? '✓ Changes Saved!' : 'Save Settings'}
        </button>
      </div>
    </Layout>
  );
}
