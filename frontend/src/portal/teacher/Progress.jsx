import { useState, useEffect } from 'react';
import api from '../../lib/api';

const SUBJECTS = ['Mathematics','English','Dzongkha','Science','Social Studies','ICT','Physical Education','Art','Music','Health'];
const TERMS = ['Term 1','Term 2','Term 3','Annual'];
const ASSESSMENT_TYPES = ['Test','Midterm','Final','Project','Classwork','Homework'];

function getGrade(marks) {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C';
  if (marks >= 40) return 'D';
  return 'F';
}

function gradeColor(grade) {
  if (grade === 'A+' || grade === 'A') return 'text-green-400';
  if (grade === 'B+' || grade === 'B') return 'text-blue-400';
  if (grade === 'C') return 'text-yellow-400';
  if (grade === 'D') return 'text-orange-400';
  return 'text-red-400';
}

const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export default function TeacherProgress() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recLoading, setRecLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ subject: SUBJECTS[0], marks: '', term: TERMS[0], assessmentType: ASSESSMENT_TYPES[0], remarks: '' });

  useEffect(() => {
    setLoading(true);
    api.get('/users/students/all')
      .then(r => setStudents(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedStudent) return;
    setRecLoading(true);
    api.get(`/progress/student/${selectedStudent}`)
      .then(r => setRecords(r.data))
      .catch(() => setRecords([]))
      .finally(() => setRecLoading(false));
  }, [selectedStudent]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/progress', { ...form, studentId: selectedStudent, marks: Number(form.marks) });
      const r = await api.get(`/progress/student/${selectedStudent}`);
      setRecords(r.data);
      setShowForm(false);
      setForm({ subject: SUBJECTS[0], marks: '', term: TERMS[0], assessmentType: ASSESSMENT_TYPES[0], remarks: '' });
    } catch {}
    setSaving(false);
  };

  const grade = form.marks !== '' ? getGrade(Number(form.marks)) : null;

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-1">Progress Management</h1>
      <p className="text-white/40 text-sm mb-6">Record and review student academic progress</p>

      <div className="bg-dark-2 border border-white/[0.05] rounded-2xl p-5 mb-5">
        <label className="block text-sm text-white/60 mb-2">Select Student</label>
        {loading ? (
          <p className="text-white/30 text-sm">Loading students...</p>
        ) : (
          <select
            className="w-full bg-dark-3 border border-white/[0.05] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent"
            value={selectedStudent}
            onChange={e => { setSelectedStudent(e.target.value); setShowForm(false); }}
          >
            <option value="">— Choose a student —</option>
            {students.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        )}
      </div>

      {selectedStudent && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Progress Records</h2>
            <button
              onClick={() => setShowForm(v => !v)}
              className="bg-accent hover:bg-accent-h text-white text-sm px-4 py-2 rounded-xl transition-colors"
            >
              {showForm ? 'Cancel' : '+ Add Record'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSave} className="bg-dark-2 border border-white/[0.05] rounded-2xl p-5 mb-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1">Subject</label>
                  <select className="w-full bg-dark-3 border border-white/[0.05] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Marks (0–100)</label>
                  <div className="flex items-center gap-2">
                    <input type="number" min="0" max="100" required className="w-full bg-dark-3 border border-white/[0.05] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" value={form.marks} onChange={e => setForm(f => ({ ...f, marks: e.target.value }))} />
                    {grade && <span className={`text-sm font-bold min-w-[28px] ${gradeColor(grade)}`}>{grade}</span>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Term</label>
                  <select className="w-full bg-dark-3 border border-white/[0.05] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" value={form.term} onChange={e => setForm(f => ({ ...f, term: e.target.value }))}>
                    {TERMS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Assessment Type</label>
                  <select className="w-full bg-dark-3 border border-white/[0.05] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" value={form.assessmentType} onChange={e => setForm(f => ({ ...f, assessmentType: e.target.value }))}>
                    {ASSESSMENT_TYPES.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Remarks (optional)</label>
                <textarea className="w-full bg-dark-3 border border-white/[0.05] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-accent resize-none" rows={2} value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} />
              </div>
              <button type="submit" disabled={saving} className="bg-accent hover:bg-accent-h disabled:opacity-50 text-white text-sm px-5 py-2 rounded-xl transition-colors">
                {saving ? 'Saving...' : 'Save Record'}
              </button>
            </form>
          )}

          {recLoading ? (
            <p className="text-white/30 text-sm">Loading records...</p>
          ) : records.length === 0 ? (
            <div className="bg-dark-2 border border-white/[0.05] rounded-2xl p-8 text-center text-white/30 text-sm">No progress records found for this student.</div>
          ) : (
            <div className="bg-dark-2 border border-white/[0.05] rounded-2xl overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="border-b border-white/[0.05] text-white/40">
                    <th className="text-left px-5 py-3">Subject</th>
                    <th className="text-left px-5 py-3">Term</th>
                    <th className="text-left px-5 py-3">Type</th>
                    <th className="text-left px-5 py-3">Marks</th>
                    <th className="text-left px-5 py-3">Grade</th>
                    <th className="text-left px-5 py-3">Remarks</th>
                    <th className="text-left px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => {
                    const g = getGrade(r.marks);
                    return (
                      <tr key={r._id || i} className="border-b border-white/[0.03] hover:bg-white/2 transition-colors">
                        <td className="px-5 py-3 text-white">{r.subject}</td>
                        <td className="px-5 py-3 text-white/70">{r.term}</td>
                        <td className="px-5 py-3 text-white/70">{r.assessmentType}</td>
                        <td className="px-5 py-3 text-white font-medium">{r.marks}</td>
                        <td className={`px-5 py-3 font-bold ${gradeColor(g)}`}>{g}</td>
                        <td className="px-5 py-3 text-white/50">{r.remarks || '—'}</td>
                        <td className="px-5 py-3 text-white/40">{r.createdAt ? fmt(r.createdAt) : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
