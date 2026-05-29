import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Users } from 'lucide-react';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    api.get('/users/students/all')
      .then(r => setStudents(r.data.data ?? r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
    s.class?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="text-white">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Students</h1>
          <p className="text-white/40 text-sm">{students.length} enrolled students</p>
        </div>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, ID or class…"
          className="bg-dark-2 border border-white/[0.05] rounded-xl px-4 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent w-64"
        />
      </div>

      <div className="bg-dark-2 border border-white/[0.05] rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-white/25 text-center py-12 text-sm">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users size={28} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/25 text-sm">No students found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {['Name', 'Email', 'Student ID', 'Class', 'Stream', 'Year'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-white/30 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s._id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-medium text-white">{s.name}</td>
                    <td className="px-5 py-3 text-white/40">{s.email}</td>
                    <td className="px-5 py-3 text-accent font-mono text-[12px]">{s.studentId || '—'}</td>
                    <td className="px-5 py-3 text-white/60">{s.class || '—'}</td>
                    <td className="px-5 py-3 text-white/60">{s.stream || '—'}</td>
                    <td className="px-5 py-3 text-white/40">{s.academicYear || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
