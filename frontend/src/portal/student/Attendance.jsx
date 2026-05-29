import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

function statusBadge(s) {
  if (s === 'Present') return 'bg-green-500/15 text-green-400 border border-green-500/20';
  if (s === 'Absent') return 'bg-red-500/15 text-red-400 border border-red-500/20';
  if (s === 'Late') return 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20';
  return 'bg-blue-500/15 text-blue-400 border border-blue-500/20';
}

export default function StudentAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sid = user?._id || user?.id;
    Promise.all([
      api.get('/attendance/my').then(r => setRecords(r.data)).catch(() => {}),
      sid ? api.get(`/attendance/stats/${sid}`).then(r => setStats(r.data)).catch(() => {}) : Promise.resolve()
    ]).finally(() => setLoading(false));
  }, [user]);

  const pct = stats?.percentage ?? (records.length ? Math.round((records.filter(r => r.status === 'Present').length / records.length) * 100) : 0);
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-1">My Attendance</h1>
      <p className="text-white/40 text-sm mb-6">Track your daily attendance record</p>

      {loading ? (
        <p className="text-white/30 text-sm">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="md:col-span-2 bg-dark-2 border border-white/[0.05] rounded-2xl p-6 flex flex-col items-center justify-center">
              <svg width="100" height="100" className="mb-3">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#ffffff10" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={pct >= 75 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444'} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" transform="rotate(-90 50 50)" />
              </svg>
              <p className={`text-4xl font-bold ${pct >= 75 ? 'text-green-400' : pct >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{pct}%</p>
              <p className="text-white/40 text-xs mt-1">Attendance Rate</p>
            </div>
            <div className="md:col-span-3 grid grid-cols-2 gap-3">
              {[
                { label: 'Total Days', value: stats?.total ?? records.length, color: 'text-white' },
                { label: 'Present', value: stats?.present ?? records.filter(r => r.status === 'Present').length, color: 'text-green-400' },
                { label: 'Absent', value: stats?.absent ?? records.filter(r => r.status === 'Absent').length, color: 'text-red-400' },
                { label: 'Late', value: stats?.late ?? records.filter(r => r.status === 'Late').length, color: 'text-yellow-400' }
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-dark-2 border border-white/[0.05] rounded-xl p-4">
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-white/40 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-base font-semibold mb-3">Recent Records</h2>
          {records.length === 0 ? (
            <div className="bg-dark-2 border border-white/[0.05] rounded-2xl p-8 text-center text-white/30 text-sm">No attendance records found.</div>
          ) : (
            <div className="bg-dark-2 border border-white/[0.05] rounded-2xl overflow-hidden">
              {records.slice(0, 20).map((r, i) => (
                <div key={r._id || i} className={`flex items-center justify-between px-4 md:px-5 py-3 ${i < Math.min(records.length, 20) - 1 ? 'border-b border-white/[0.03]' : ''} hover:bg-white/2 transition-colors`}>
                  <div>
                    <p className="text-sm text-white">{r.date ? fmt(r.date) : '—'}</p>
                    {r.subject && <p className="text-xs text-white/40">{r.subject}</p>}
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusBadge(r.status)}`}>{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
