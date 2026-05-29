import { useState, useEffect } from 'react';
import { Pin } from 'lucide-react';
import api from '../../lib/api';

const AUDIENCES = ['all', 'students', 'parents', 'teachers', 'class'];
const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export default function TeacherAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', targetAudience: 'all', targetClass: '' });

  const fetchAnnouncements = () => {
    api.get('/announcements')
      .then(r => setAnnouncements(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/announcements', form);
      fetchAnnouncements();
      setShowForm(false);
      setForm({ title: '', body: '', targetAudience: 'all', targetClass: '' });
    } catch {}
    setSaving(false);
  };

  const sorted = [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="text-white max-w-3xl">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <button onClick={() => setShowForm(v => !v)} className="bg-accent hover:bg-accent-h text-white text-sm px-4 py-2 rounded-xl transition-colors shrink-0">
          {showForm ? 'Cancel' : '+ New'}
        </button>
      </div>
      <p className="text-white/40 text-sm mb-6">Post and manage school announcements</p>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-dark-2 border border-white/8 rounded-2xl p-5 mb-6 space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1">Title</label>
            <input required className="w-full bg-dark-3 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-accent" placeholder="Announcement title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1">Body</label>
            <textarea required rows={4} className="w-full bg-dark-3 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-accent resize-none" placeholder="Write your announcement..." value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">Target Audience</label>
              <select className="w-full bg-dark-3 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent capitalize" value={form.targetAudience} onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value }))}>
                {AUDIENCES.map(a => <option key={a} className="capitalize">{a}</option>)}
              </select>
            </div>
            {form.targetAudience === 'class' && (
              <div>
                <label className="block text-xs text-white/50 mb-1">Target Class</label>
                <input className="w-full bg-dark-3 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-accent" placeholder="e.g. Class 8A" value={form.targetClass} onChange={e => setForm(f => ({ ...f, targetClass: e.target.value }))} />
              </div>
            )}
          </div>
          <button type="submit" disabled={saving} className="bg-accent hover:bg-accent-h disabled:opacity-50 text-white text-sm px-5 py-2 rounded-xl transition-colors">
            {saving ? 'Posting...' : 'Post Announcement'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-white/30 text-sm">Loading announcements...</p>
      ) : sorted.length === 0 ? (
        <div className="bg-dark-2 border border-white/8 rounded-2xl p-8 text-center text-white/30 text-sm">No announcements yet.</div>
      ) : (
        <div className="space-y-3">
          {sorted.map((a, i) => (
            <div key={a._id || i} className={`bg-dark-2 border rounded-2xl p-5 ${a.pinned ? 'border-accent/30' : 'border-white/8'}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  {a.pinned && <Pin size={14} className="text-accent flex-shrink-0 mt-0.5" />}
                  <h3 className="text-white font-semibold text-sm truncate">{a.title}</h3>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs bg-white/8 text-white/50 px-2 py-0.5 rounded-full capitalize hidden sm:inline">{a.targetAudience || 'all'}</span>
                  <span className="text-xs text-white/30">{a.createdAt ? fmt(a.createdAt) : ''}</span>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
