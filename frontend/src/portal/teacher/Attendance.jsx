import { useState, useEffect } from 'react';
import api from '../../lib/api';

const STATUSES = ['Present', 'Absent', 'Late', 'Excused'];

function statusColor(s) {
  if (s === 'Present') return 'text-green-400';
  if (s === 'Absent') return 'text-red-400';
  if (s === 'Late') return 'text-yellow-400';
  return 'text-blue-400';
}

const today = new Date().toISOString().split('T')[0];

export default function TeacherAttendance() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(today);
  const [subject, setSubject] = useState('');
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/users/students/all')
      .then(r => {
        setStudents(r.data);
        const init = {};
        r.data.forEach(s => { init[s._id] = 'Present'; });
        setAttendance(init);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setStatus = (id, status) => setAttendance(a => ({ ...a, [id]: status }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = students.map(s => ({ studentId: s._id, date, subject, status: attendance[s._id] || 'Present' }));
      await api.post('/attendance', { records });
      const counts = { Present: 0, Absent: 0, Late: 0, Excused: 0 };
      records.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });
      setSummary(counts);
    } catch {}
    setSaving(false);
  };

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-1">Mark Attendance</h1>
      <p className="text-white/40 text-sm mb-6">Record daily student attendance</p>

      <div className="bg-dark-2 border border-white/[0.05] rounded-2xl p-5 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/50 mb-1">Date</label>
            <input type="date" className="w-full bg-dark-3 border border-white/[0.05] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1">Subject / Class</label>
            <input type="text" placeholder="e.g. Mathematics, Class 8A" className="w-full bg-dark-3 border border-white/[0.05] rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-accent" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {Object.entries(summary).map(([s, c]) => (
            <div key={s} className="bg-dark-2 border border-white/[0.05] rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${statusColor(s)}`}>{c}</p>
              <p className="text-white/50 text-xs mt-1">{s}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-white/30 text-sm">Loading students...</p>
      ) : students.length === 0 ? (
        <div className="bg-dark-2 border border-white/[0.05] rounded-2xl p-8 text-center text-white/30 text-sm">No students found.</div>
      ) : (
        <div className="bg-dark-2 border border-white/[0.05] rounded-2xl overflow-hidden mb-5">
          <div className="px-4 md:px-5 py-3 border-b border-white/[0.05] flex items-center justify-between">
            <span className="text-sm text-white/60">{students.length} students</span>
            <div className="hidden sm:flex gap-4 text-xs text-white/40">
              {STATUSES.map(s => <span key={s} className={statusColor(s)}>{s}</span>)}
            </div>
          </div>
          {students.map((s, i) => (
            <div key={s._id} className={`flex items-center justify-between gap-3 px-4 md:px-5 py-3 ${i < students.length - 1 ? 'border-b border-white/[0.03]' : ''} hover:bg-white/2 transition-colors`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold shrink-0">
                  {s.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-sm text-white truncate">{s.name}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 shrink-0">
                {STATUSES.map(st => (
                  <button
                    key={st}
                    onClick={() => setStatus(s._id, st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${attendance[s._id] === st
                      ? (st === 'Present' ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : st === 'Absent' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : st === 'Late' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30')
                      : 'bg-white/5 text-white/40 border border-transparent hover:bg-white/8'}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && students.length > 0 && (
        <button onClick={handleSave} disabled={saving} className="bg-accent hover:bg-accent-h disabled:opacity-50 text-white text-sm px-6 py-2.5 rounded-xl transition-colors font-medium">
          {saving ? 'Saving...' : 'Save Attendance'}
        </button>
      )}
    </div>
  );
}
