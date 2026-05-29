import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Users } from 'lucide-react';

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/users/teachers/all')
      .then(r => setTeachers(r.data.data ?? r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Teachers</h1>
        <p className="text-white/40 text-sm">{teachers.length} faculty members</p>
      </div>

      <div className="bg-dark-2 border border-white/[0.05] rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-white/25 text-center py-12 text-sm">Loading…</p>
        ) : teachers.length === 0 ? (
          <div className="text-center py-16">
            <Users size={28} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/25 text-sm">No teachers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {['Name', 'Email', 'Role'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-white/30 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teachers.map(t => (
                  <tr key={t._id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-medium text-white">{t.name}</td>
                    <td className="px-5 py-3 text-white/40">{t.email}</td>
                    <td className="px-5 py-3">
                      <span className="bg-accent/10 text-accent text-[11px] font-semibold px-2 py-0.5 rounded-md capitalize">{t.role}</span>
                    </td>
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
