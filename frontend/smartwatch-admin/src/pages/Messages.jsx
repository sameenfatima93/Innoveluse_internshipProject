import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { API_BASE } from '../context/AdminContext';
import { Search, Filter, Eye, X, Trash2, Mail, RefreshCw } from 'lucide-react';

const statusColor = {
  unread: 'bg-amber-400/15 text-amber-300',
  read: 'bg-slate-600/20 text-slate-400',
  replied: 'bg-emerald-600/20 text-emerald-400',
};

function MessageModal({ message, onClose, onStatusChange, onDelete }) {
  const [status, setStatus] = useState(message.status);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    onStatusChange(message._id, newStatus);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      onDelete(message._id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl w-full max-w-2xl p-6 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">Message Details</h2>
          <button onClick={onClose}><X size={18} className="text-slate-500 hover:text-white" /></button>
        </div>
        
        <div className="space-y-4">
          {/* From & Status */}
          <div className="glass rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">From</p>
                <p className="text-white font-medium">{message.name}</p>
                <p className="text-slate-400 text-sm">{message.email}</p>
                {message.phone && <p className="text-slate-400 text-sm">{message.phone}</p>}
              </div>
              <span className={`badge ${statusColor[status]} capitalize text-xs px-3 py-1 rounded-full`}>
                {status}
              </span>
            </div>
          </div>

          {/* Subject */}
          <div className="glass rounded-xl p-4">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Subject</p>
            <p className="text-white font-medium">{message.subject}</p>
          </div>

          {/* Message */}
          <div className="glass rounded-xl p-4">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Message</p>
            <p className="text-slate-300 whitespace-pre-wrap">{message.message}</p>
          </div>

          {/* Date */}
          <div className="glass rounded-xl p-4">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Received</p>
            <p className="text-slate-300">{new Date(message.createdAt).toLocaleString()}</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <p className="text-slate-500 text-xs uppercase tracking-wider">Status</p>
            <div className="grid grid-cols-3 gap-2">
              {['unread', 'read', 'replied'].map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`py-2 rounded-xl text-xs font-medium transition-all border capitalize ${
                    status === s
                      ? `${statusColor[s]} border-current`
                      : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:border-white/20'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="w-full py-2 rounded-xl text-sm font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={16} /> Delete Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();

    // Poll every 2 seconds without toggling loading UI
    const interval = setInterval(() => {
      fetchMessages({ silent: true });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async (options = {}) => {
    const { silent = false } = options;
    try {
      if (!silent) {
        setLoading(true);
      }
      const response = await fetch(`${API_BASE}/contact`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (messageId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/contact/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setMessages(messages.map(m => m._id === messageId ? data.data : m));
        setSelectedMessage(data.data);
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      const response = await fetch(`${API_BASE}/contact/${messageId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setMessages(messages.filter(m => m._id !== messageId));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                          m.email.toLowerCase().includes(search.toLowerCase()) ||
                          m.subject.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || m.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalCount = messages.length;
  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const readCount = messages.filter(m => m.status === 'read').length;
  const repliedCount = messages.filter(m => m.status === 'replied').length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 p-6 shadow-[0_25px_60px_rgba(3,7,18,0.6)]">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
                  <Mail size={22} className="text-amber-300" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Messages</h1>
                  <p className="text-slate-400">Customer contact submissions</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live updates every 2s
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-200">
                Total: {totalCount}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 border border-amber-400/30 text-amber-300">
                Unread: {unreadCount}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-400/10 border border-slate-400/20 text-slate-300">
                Read: {readCount}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-400/10 border border-emerald-400/20 text-emerald-300">
                Replied: {repliedCount}
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchMessages}
              disabled={loading}
              className="px-4 py-2 bg-amber-400/15 border border-amber-400/30 rounded-xl text-amber-300 hover:bg-amber-400/25 transition-all flex items-center gap-2 disabled:opacity-50"
              title="Refresh messages"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span className="text-sm font-medium hidden sm:inline">Refresh</span>
            </button>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-brand-400"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-slate-500">Loading messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-slate-500">No messages found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map(message => (
              <div
                key={message._id}
                onClick={() => setSelectedMessage(message)}
                className={`glass rounded-2xl p-4 cursor-pointer transition-all hover:border-amber-400/50 hover:shadow-[0_10px_30px_rgba(2,6,23,0.5)] border ${
                  message.status === 'unread' ? 'border-amber-400/30 bg-amber-400/5' : 'border-white/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-white">{message.name}</p>
                      <span className={`badge ${statusColor[message.status]} capitalize text-xs px-2 py-0.5 rounded-full`}>
                        {message.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-1">{message.subject}</p>
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span>{message.email}</span>
                      {message.phone && <span>{message.phone}</span>}
                      <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Eye size={18} className="text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </Layout>
  );
}
