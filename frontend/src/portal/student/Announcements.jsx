import { useState, useEffect } from 'react';
import { Pin } from 'lucide-react';
import api from '../../lib/api';

const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

function audienceBadge(a) {
  const map = { all: 'bg-white/8 text-white/50', students: 'bg-blue-500/15 text-blue-400', parents: 'bg-purple-500/15 text-purple-400', teachers: 'bg-green-500/15 text-green-400', class: 'bg-orange-500/15 text-orange-400' };
  return map[a] || map.all;
}

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/announcements')
      .then(r => setAnnouncements(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="text-white max-w-3xl">
      <h1 className="text-2xl font-bold mb-1">Announcements</h1>
        <p className="text-white/40 text-sm mb-6">School news and updates</p>

        {loading ? (
          <p className="text-white/30 text-sm">Loading...</p>
        ) : sorted.length === 0 ? (
          <div className="bg-dark-2 border border-white/8 rounded-2xl p-8 text-center text-white/30 text-sm">No announcements at this time.</div>
        ) : (
          <div className="space-y-3">
            {sorted.map((a, i) => (
              <div key={a._id || i} className={`bg-dark-2 border rounded-2xl p-5 ${a.pinned ? 'border-[#0066CC]/30' : 'border-white/8'}`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {a.pinned && <Pin size={13} className="text-accent flex-shrink-0 mt-0.5" />}
                    <h3 className="text-white font-semibold text-sm truncate">{a.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize hidden sm:inline ${audienceBadge(a.targetAudience)}`}>{a.targetAudience || 'all'}</span>
                    <span className="text-xs text-white/30">{a.createdAt ? fmt(a.createdAt) : ''}</span>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{a.body}</p>
                {a.targetClass && <p className="text-xs text-white/30 mt-2">Class: {a.targetClass}</p>}
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
