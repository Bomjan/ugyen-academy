import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const TERMS = ['All', 'Term 1', 'Term 2', 'Term 3', 'Annual'];

function getGrade(m) {
  if (m >= 90) return 'A+'; if (m >= 80) return 'A'; if (m >= 70) return 'B+';
  if (m >= 60) return 'B'; if (m >= 50) return 'C'; if (m >= 40) return 'D'; return 'F';
}

function gradeColor(g) {
  if (g === 'A+' || g === 'A') return 'text-green-400';
  if (g === 'B+' || g === 'B') return 'text-blue-400';
  if (g === 'C') return 'text-yellow-400';
  if (g === 'D') return 'text-orange-400';
  return 'text-red-400';
}

const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export default function ParentProgress() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState('All');

  const childId = user?.childId || user?.children?.[0];
  const childName = user?.childName || 'Child';

  useEffect(() => {
    if (!childId) { setLoading(false); return; }
    api.get(`/progress/student/${childId}`)
      .then(r => setRecords(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [childId]);

  const filtered = term === 'All' ? records : records.filter(r => r.term === term);

  const bySubject = filtered.reduce((acc, r) => {
    if (!acc[r.subject]) acc[r.subject] = [];
    acc[r.subject].push(r);
    return acc;
  }, {});

  const subjectAvgs = Object.entries(bySubject).map(([subject, recs]) => ({
    subject,
    avg: Math.round(recs.reduce((s, r) => s + r.marks, 0) / recs.length),
    count: recs.length
  }));

  const overall = filtered.length ? Math.round(filtered.reduce((s, r) => s + r.marks, 0) / filtered.length) : 0;

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-1">Progress</h1>
      <p className="text-white/40 text-sm mb-6">Viewing progress for: <span className="text-white/70">{childName}</span></p>

        {!childId ? (
          <div className="bg-dark-2 border border-yellow-500/20 rounded-2xl p-8 text-center text-yellow-400 text-sm">No child linked to this account.</div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {TERMS.map(t => (
                <button key={t} onClick={() => setTerm(t)} className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${term === t ? 'bg-accent text-white' : 'bg-dark-2 text-white/50 border border-white/[0.05] hover:border-white/20'}`}>
                  {t}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="text-white/30 text-sm">Loading...</p>
            ) : (
              <>
                {filtered.length > 0 && (
                  <div className="bg-dark-2 border border-white/[0.05] rounded-2xl p-5 mb-6">
                    <p className="text-white/50 text-xs mb-1">Overall Average</p>
                    <p className={`text-5xl font-bold ${gradeColor(getGrade(overall))}`}>{overall}<span className="text-2xl">%</span></p>
                    <p className="text-white/30 text-xs mt-1">{filtered.length} records · {Object.keys(bySubject).length} subjects</p>
                  </div>
                )}

                {subjectAvgs.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-base font-semibold mb-3">By Subject</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {subjectAvgs.map(({ subject, avg, count }) => {
                        const g = getGrade(avg);
                        return (
                          <div key={subject} className="bg-dark-2 border border-white/[0.05] rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-white">{subject}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-white/40 text-xs">{count} records</span>
                                <span className={`text-sm font-bold ${gradeColor(g)}`}>{g}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-white/5 rounded-full h-1.5">
                                <div className="h-1.5 rounded-full bg-accent/60" style={{ width: `${Math.max(4, avg)}%` }} />
                              </div>
                              <span className="text-white font-bold text-sm w-10 text-right">{avg}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-base font-semibold mb-3">All Records</h2>
                  {filtered.length === 0 ? (
                    <div className="bg-dark-2 border border-white/[0.05] rounded-2xl p-8 text-center text-white/30 text-sm">No records for {term === 'All' ? 'any term' : term}.</div>
                  ) : (
                    <div className="bg-dark-2 border border-white/[0.05] rounded-2xl overflow-x-auto">
                      <table className="w-full text-sm min-w-[480px]">
                        <thead>
                          <tr className="border-b border-white/[0.05]">
                            <th className="text-left px-5 py-3 text-white/40 font-normal">Subject</th>
                            <th className="text-left px-5 py-3 text-white/40 font-normal">Term</th>
                            <th className="text-left px-5 py-3 text-white/40 font-normal">Type</th>
                            <th className="text-left px-5 py-3 text-white/40 font-normal">Marks</th>
                            <th className="text-left px-5 py-3 text-white/40 font-normal">Grade</th>
                            <th className="text-left px-5 py-3 text-white/40 font-normal">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((r, i) => {
                            const g = getGrade(r.marks);
                            return (
                              <tr key={r._id || i} className="border-b border-white/[0.03] hover:bg-white/2">
                                <td className="px-5 py-3 text-white">{r.subject}</td>
                                <td className="px-5 py-3 text-white/60">{r.term}</td>
                                <td className="px-5 py-3 text-white/60">{r.assessmentType}</td>
                                <td className="px-5 py-3 text-white font-medium">{r.marks}/100</td>
                                <td className={`px-5 py-3 font-bold ${gradeColor(g)}`}>{g}</td>
                                <td className="px-5 py-3 text-white/40">{r.createdAt ? fmt(r.createdAt) : '—'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
    </div>
  );
}
