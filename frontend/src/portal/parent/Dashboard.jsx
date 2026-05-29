import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Calendar, CreditCard, ChevronRight, Pin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

function getGrade(m) {
  if (m >= 90) return 'A+'; if (m >= 80) return 'A'; if (m >= 70) return 'B+';
  if (m >= 60) return 'B'; if (m >= 50) return 'C'; if (m >= 40) return 'D'; return 'F';
}

export default function ParentDashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const childId = user?.childId || user?.children?.[0];
  const childName = user?.childName || 'Your Child';

  useEffect(() => {
    if (!childId) { setLoading(false); return; }
    Promise.all([
      api.get(`/progress/student/${childId}`).then(r => setProgress(r.data)).catch(() => {}),
      api.get(`/attendance/student/${childId}`).then(r => setAttendance(r.data)).catch(() => {}),
      api.get('/fees/parent').then(r => setFees(r.data)).catch(() => {}),
      api.get('/announcements').then(r => setAnnouncements(r.data)).catch(() => {})
    ]).finally(() => setLoading(false));
  }, [childId]);

  const avg = progress.length ? Math.round(progress.reduce((s, r) => s + r.marks, 0) / progress.length) : 0;
  const attendPct = attendance.length ? Math.round((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100) : 0;
  const pendingFees = Array.isArray(fees) ? fees.filter(f => f.status !== 'paid').reduce((s, f) => s + (f.amount || 0), 0) : 0;
  const recentAnnouncements = [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).slice(0, 3);

  return (
    <div className="text-white">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome, {user?.name?.split(' ')[0] || 'Parent'}</h1>
        <p className="text-white/40 text-sm">Monitoring {childName}'s progress at Ugyen Academy</p>
      </div>

      {!childId && (
        <div className="bg-dark-2 border border-yellow-500/20 rounded-2xl p-6 mb-6 text-center">
          <p className="text-yellow-400 text-sm">No child linked to this account. Please contact the school administration.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-dark-2 border border-white/8 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-green-500/15 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-green-400" />
            </div>
            <span className="text-white/50 text-xs">Avg Marks</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{loading ? '—' : `${avg}%`}</p>
          {!loading && progress.length > 0 && <p className="text-xs text-white/30 mt-0.5">Grade: {getGrade(avg)}</p>}
        </div>
        <div className="bg-dark-2 border border-white/8 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-500/15 rounded-lg flex items-center justify-center">
              <Calendar size={16} className="text-blue-400" />
            </div>
            <span className="text-white/50 text-xs">Attendance</span>
          </div>
          <p className={`text-2xl font-bold ${attendPct >= 75 ? 'text-blue-400' : 'text-yellow-400'}`}>{loading ? '—' : `${attendPct}%`}</p>
        </div>
        <div className="bg-dark-2 border border-white/8 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 ${pendingFees > 0 ? 'bg-red-500/15' : 'bg-green-500/15'} rounded-lg flex items-center justify-center`}>
              <CreditCard size={16} className={pendingFees > 0 ? 'text-red-400' : 'text-green-400'} />
            </div>
            <span className="text-white/50 text-xs">Pending Fees</span>
          </div>
          <p className={`text-2xl font-bold ${pendingFees > 0 ? 'text-red-400' : 'text-green-400'}`}>{loading ? '—' : `Nu. ${pendingFees.toLocaleString()}`}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Recent Announcements</h2>
            <Link to="/portal/parent/announcements" className="text-accent text-xs hover:text-accent-h">View all</Link>
          </div>
          {loading ? <p className="text-white/30 text-sm">Loading...</p> : recentAnnouncements.length === 0 ? (
            <div className="bg-dark-2 border border-white/8 rounded-2xl p-6 text-center text-white/30 text-sm">No announcements.</div>
          ) : (
            <div className="space-y-2">
              {recentAnnouncements.map((a, i) => (
                <div key={a._id || i} className="bg-dark-2 border border-white/8 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    {a.pinned && <Pin size={11} className="text-accent" />}
                    <span className="text-sm font-medium">{a.title}</span>
                  </div>
                  <p className="text-white/50 text-xs line-clamp-2">{a.body}</p>
                  <p className="text-white/25 text-xs mt-1">{a.createdAt ? fmt(a.createdAt) : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-base font-semibold mb-3">Quick Links</h2>
          <div className="space-y-2">
            {[
              { to: '/portal/parent/progress', label: 'Progress', desc: "View child's marks" },
              { to: '/portal/parent/attendance', label: 'Attendance', desc: 'Track attendance' },
              { to: '/portal/parent/fees', label: 'Fees', desc: 'Fee status' },
              { to: '/portal/parent/announcements', label: 'Announcements', desc: 'School news' }
            ].map(l => (
              <Link key={l.to} to={l.to} className="flex items-center justify-between bg-dark-2 border border-white/8 rounded-xl p-4 hover:border-accent/40 hover:bg-accent/5 transition-all group">
                <div>
                  <p className="text-sm font-medium text-white">{l.label}</p>
                  <p className="text-xs text-white/40">{l.desc}</p>
                </div>
                <ChevronRight size={16} className="text-white/20 group-hover:text-accent transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
