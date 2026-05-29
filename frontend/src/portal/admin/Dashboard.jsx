import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, CreditCard, Bell, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ students: 0, teachers: 0, pendingFees: 0, announcements: 0 });
  const [loading, setLoading] = useState(true);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/users/students/all').catch(() => ({ data: [] })),
      api.get('/users/teachers/all').catch(() => ({ data: [] })),
      api.get('/fees/all').catch(() => ({ data: [] })),
      api.get('/announcements').catch(() => ({ data: [] }))
    ]).then(([studentsRes, teachersRes, feesRes, announcementsRes]) => {
      const feesData = Array.isArray(feesRes.data) ? feesRes.data : [];
      const pending = feesData.filter(f => f.status !== 'paid').reduce((s, f) => s + (f.amount || 0), 0);
      setStats({
        students: studentsRes.data.length,
        teachers: teachersRes.data.length,
        pendingFees: pending,
        announcements: announcementsRes.data.length
      });
      const sorted = [...announcementsRes.data].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
      setRecentAnnouncements(sorted.slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { icon: GraduationCap, label: 'Total Students', value: stats.students, color: 'text-blue-400', bg: 'bg-blue-500/15', to: '/portal/admin/students' },
    { icon: Users, label: 'Total Teachers', value: stats.teachers, color: 'text-green-400', bg: 'bg-green-500/15', to: '/portal/admin/teachers' },
    { icon: CreditCard, label: 'Pending Fees', value: `Nu. ${stats.pendingFees.toLocaleString()}`, color: stats.pendingFees > 0 ? 'text-red-400' : 'text-green-400', bg: stats.pendingFees > 0 ? 'bg-red-500/15' : 'bg-green-500/15', to: '/portal/admin/fees' },
    { icon: Bell, label: 'Announcements', value: stats.announcements, color: 'text-purple-400', bg: 'bg-purple-500/15', to: '/portal/admin/announcements' }
  ];

  const quickLinks = [
    { to: '/portal/admin/students', label: 'Manage Students', desc: 'View and manage all students' },
    { to: '/portal/admin/teachers', label: 'Manage Teachers', desc: 'View and manage staff' },
    { to: '/portal/admin/fees', label: 'Fee Management', desc: 'Track all fee payments' },
    { to: '/portal/admin/announcements', label: 'Announcements', desc: 'Post school announcements' },
    { to: '/portal/admin/attendance', label: 'Attendance Reports', desc: 'View attendance records' },
    { to: '/portal/admin/progress', label: 'Progress Reports', desc: 'Academic progress overview' }
  ];

  const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="text-white">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-white/40 text-sm">Welcome back, {user?.name || 'Administrator'} — Ugyen Academy</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {statCards.map(({ icon: Icon, label, value, color, bg, to }) => (
          <Link key={label} to={to} className="bg-dark-2 border border-white/8 rounded-xl p-4 md:p-5 hover:border-accent/30 hover:bg-accent/3 transition-all group">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className={`w-9 h-9 md:w-10 md:h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
              <ChevronRight size={14} className="text-white/10 group-hover:text-white/30 ml-auto transition-colors" />
            </div>
            <p className={`text-2xl md:text-3xl font-bold ${color} ${loading ? 'opacity-30' : ''}`}>{loading ? '—' : value}</p>
            <p className="text-white/40 text-xs mt-1">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-base font-semibold mb-3">Recent Announcements</h2>
          {loading ? (
            <p className="text-white/30 text-sm">Loading...</p>
          ) : recentAnnouncements.length === 0 ? (
            <div className="bg-dark-2 border border-white/8 rounded-2xl p-6 text-center text-white/30 text-sm">No announcements yet.</div>
          ) : (
            <div className="space-y-3">
              {recentAnnouncements.map((a, i) => (
                <div key={a._id || i} className="bg-dark-2 border border-white/8 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm font-medium text-white">{a.title}</span>
                    <span className="text-xs text-white/30 shrink-0">{a.createdAt ? fmt(a.createdAt) : ''}</span>
                  </div>
                  <p className="text-white/50 text-xs line-clamp-2">{a.body}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-white/5 text-white/40 px-2 py-0.5 rounded-full capitalize">{a.targetAudience || 'all'}</span>
                    {a.pinned && <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-full">Pinned</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-base font-semibold mb-3">Quick Links</h2>
          <div className="space-y-2">
            {quickLinks.map(l => (
              <Link key={l.to} to={l.to} className="flex items-center justify-between bg-dark-2 border border-white/8 rounded-xl p-3.5 hover:border-accent/40 hover:bg-accent/5 transition-all group">
                <div>
                  <p className="text-sm font-medium text-white">{l.label}</p>
                  <p className="text-xs text-white/35">{l.desc}</p>
                </div>
                <ChevronRight size={15} className="text-white/15 group-hover:text-accent transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
