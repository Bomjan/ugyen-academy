import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, School, ChevronRight, Pin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users/students/all').then(r => setStudents(r.data)).catch(() => {}),
      api.get('/announcements').then(r => setAnnouncements(r.data)).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const recent = [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).slice(0, 3);

  return (
    <div className="text-white">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0] || 'Teacher'}</h1>
        <p className="text-white/40 text-sm">{today}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-dark-2 border border-white/8 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-accent/15 rounded-xl flex items-center justify-center">
              <Users size={18} className="text-accent" />
            </div>
            <span className="text-white/50 text-xs">Total Students</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white">{loading ? '—' : students.length}</p>
        </div>
        <div className="bg-dark-2 border border-white/8 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-purple-500/15 rounded-xl flex items-center justify-center">
              <Calendar size={18} className="text-purple-400" />
            </div>
            <span className="text-white/50 text-xs">Today</span>
          </div>
          <p className="text-base md:text-lg font-bold text-white">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
        </div>
        <div className="col-span-2 md:col-span-1 bg-dark-2 border border-white/8 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-green-500/15 rounded-xl flex items-center justify-center">
              <School size={18} className="text-green-400" />
            </div>
            <span className="text-white/50 text-xs">School</span>
          </div>
          <p className="text-base md:text-lg font-bold text-white">Ugyen Academy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-base font-semibold mb-3">Recent Announcements</h2>
          {loading ? (
            <p className="text-white/30 text-sm">Loading...</p>
          ) : recent.length === 0 ? (
            <div className="bg-dark-2 border border-white/8 rounded-2xl p-6 text-center text-white/30 text-sm">No announcements yet.</div>
          ) : (
            <div className="space-y-3">
              {recent.map((a, i) => (
                <div key={a._id || i} className="bg-dark-2 border border-white/8 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    {a.pinned && <Pin size={12} className="text-accent" />}
                    <span className="text-sm font-medium text-white">{a.title}</span>
                  </div>
                  <p className="text-white/50 text-xs line-clamp-2">{a.body}</p>
                  <p className="text-white/25 text-xs mt-2">{a.createdAt ? fmt(a.createdAt) : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-base font-semibold mb-3">Quick Links</h2>
          <div className="space-y-2">
            {[
              { to: '/portal/teacher/progress', label: 'Progress', desc: 'Record student marks' },
              { to: '/portal/teacher/attendance', label: 'Attendance', desc: 'Mark daily attendance' },
              { to: '/portal/teacher/announcements', label: 'Announcements', desc: 'Post to school' }
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
