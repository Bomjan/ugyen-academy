import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Calendar, CreditCard, BookOpen, ChevronRight, Pin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

function getGrade(m) {
  if (m >= 90) return 'A+'; if (m >= 80) return 'A'; if (m >= 70) return 'B+';
  if (m >= 60) return 'B'; if (m >= 50) return 'C'; if (m >= 40) return 'D'; return 'F';
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/progress/my').then(r => setProgress(r.data)).catch(() => {}),
      api.get('/attendance/my').then(r => setAttendance(r.data)).catch(() => {}),
      api.get('/fees/my').then(r => setFees(r.data)).catch(() => {}),
      api.get('/announcements').then(r => setAnnouncements(r.data)).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  const avg = progress.length ? Math.round(progress.reduce((s, r) => s + r.marks, 0) / progress.length) : 0;
  const attendPct = attendance.length ? Math.round((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100) : 0;
  const pending = fees.filter(f => f.status === 'pending' || f.status === 'overdue').reduce((s, f) => s + (f.amount || 0), 0);
  const subjects = [...new Set(progress.map(r => r.subject))].length;
  const recentProgress = progress.slice(0, 5);
  const recentAnnouncements = [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).slice(0, 3);

  const stats = [
    { icon: TrendingUp, label: 'Avg Marks', value: loading ? '—' : `${avg}%`, color: 'text-green-400', bg: 'bg-green-500/15' },
    { icon: Calendar, label: 'Attendance', value: loading ? '—' : `${attendPct}%`, color: 'text-blue-400', bg: 'bg-blue-500/15' },
    { icon: CreditCard, label: 'Pending Fees', value: loading ? '—' : `Nu. ${pending.toLocaleString()}`, color: pending > 0 ? 'text-red-400' : 'text-green-400', bg: pending > 0 ? 'bg-red-500/15' : 'bg-green-500/15' },
    { icon: BookOpen, label: 'Subjects', value: loading ? '—' : subjects, color: 'text-purple-400', bg: 'bg-purple-500/15' }
  ];

  return (
    <div className="text-white">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0] || 'Student'}</h1>
        <p className="text-white/40 text-sm">{user?.class ? `Class ${user.class}` : 'Ugyen Academy'}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-dark-2 border border-white/[0.05] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}>
                <Icon size={16} className={color} />
              </div>
              <span className="text-white/50 text-xs">{label}</span>
            </div>
            <p className={`text-xl md:text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">Recent Progress</h2>
              <Link to="/portal/student/progress" className="text-accent text-xs hover:text-accent-h">View all</Link>
            </div>
            {loading ? <p className="text-white/30 text-sm">Loading...</p> : recentProgress.length === 0 ? (
              <div className="bg-dark-2 border border-white/[0.05] rounded-2xl p-6 text-center text-white/30 text-sm">No progress records yet.</div>
            ) : (
              <div className="bg-dark-2 border border-white/[0.05] rounded-2xl overflow-hidden">
                {recentProgress.map((r, i) => (
                  <div key={r._id || i} className={`flex items-center justify-between px-4 md:px-5 py-3 ${i < recentProgress.length - 1 ? 'border-b border-white/[0.03]' : ''}`}>
                    <div>
                      <p className="text-sm text-white font-medium">{r.subject}</p>
                      <p className="text-xs text-white/40">{r.term} · {r.assessmentType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{r.marks}/100</p>
                      <p className="text-xs text-white/40">{getGrade(r.marks)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">Announcements</h2>
              <Link to="/portal/student/announcements" className="text-accent text-xs hover:text-accent-h">View all</Link>
            </div>
            {loading ? <p className="text-white/30 text-sm">Loading...</p> : recentAnnouncements.length === 0 ? (
              <div className="bg-dark-2 border border-white/[0.05] rounded-2xl p-6 text-center text-white/30 text-sm">No announcements.</div>
            ) : (
              <div className="space-y-2">
                {recentAnnouncements.map((a, i) => (
                  <div key={a._id || i} className="bg-dark-2 border border-white/[0.05] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      {a.pinned && <Pin size={11} className="text-accent" />}
                      <span className="text-sm font-medium">{a.title}</span>
                    </div>
                    <p className="text-white/50 text-xs line-clamp-2">{a.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold mb-3">Quick Links</h2>
          <div className="space-y-2">
            {[
              { to: '/portal/student/progress', label: 'Progress', desc: 'View your marks' },
              { to: '/portal/student/attendance', label: 'Attendance', desc: 'Check attendance' },
              { to: '/portal/student/fees', label: 'Fees', desc: 'Fee status' },
              { to: '/portal/student/announcements', label: 'Announcements', desc: 'School news' }
            ].map(l => (
              <Link key={l.to} to={l.to} className="flex items-center justify-between bg-dark-2 border border-white/[0.05] rounded-xl p-4 hover:border-accent/40 hover:bg-accent/5 transition-all group">
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
