import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Plus, X, Check } from 'lucide-react';

const statusBadge = {
  paid:    'bg-green-500/15 text-green-400',
  pending: 'bg-yellow-500/15 text-yellow-400',
  overdue: 'bg-red-500/15 text-red-400',
};

function AddFeeModal({ students, onClose, onSaved }) {
  const [form, setForm] = useState({ studentId:'', feeType:'Tuition Fee', amount:'', dueDate:'', term:'Term 1', academicYear:'2026' });
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post('/fees', { ...form, amount: Number(form.amount) });
      onSaved();
    } catch(err) { alert(err.response?.data?.error || 'Error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-dark-2 border border-white/[0.05] rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white text-[16px]">Add Fee Record</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={18}/></button>
        </div>
        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-white/40 mb-1">Student</label>
            <select required value={form.studentId} onChange={e=>setForm(f=>({...f,studentId:e.target.value}))}
              className="w-full bg-dark border border-white/[0.05] rounded-lg px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-accent">
              <option value="">Select student…</option>
              {students.map(s=><option key={s._id} value={s._id}>{s.name} — {s.class}</option>)}
            </select>
          </div>
          {[
            { label:'Fee Type', name:'feeType' },
            { label:'Amount (Nu.)', name:'amount', type:'number' },
            { label:'Due Date', name:'dueDate', type:'date' },
            { label:'Term', name:'term' },
            { label:'Academic Year', name:'academicYear' },
          ].map(({ label, name, type='text' }) => (
            <div key={name}>
              <label className="block text-[11px] font-medium text-white/40 mb-1">{label}</label>
              <input type={type} required value={form[name]} onChange={e=>setForm(f=>({...f,[name]:e.target.value}))}
                className="w-full bg-dark border border-white/[0.05] rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-accent" />
            </div>
          ))}
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="bg-accent hover:bg-accent-h text-white text-[13px] font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors">
              <Check size={14}/>{saving ? 'Saving…' : 'Add Fee'}
            </button>
            <button type="button" onClick={onClose}
              className="border border-white/[0.05] text-white/50 hover:text-white text-[13px] px-5 py-2.5 rounded-lg">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminFees() {
  const [fees, setFees]         = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [showAdd, setShowAdd]   = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get('/fees/all'),
      api.get('/users/students/all'),
    ]).then(([feesRes, stuRes]) => {
      setFees(Array.isArray(feesRes.data) ? feesRes.data : []);
      setStudents(stuRes.data.data ?? stuRes.data);
    }).catch(()=>{}).finally(()=>setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const fmt = d => new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });

  const visible = filter === 'all' ? fees : fees.filter(f => f.status === filter);
  const total   = fees.reduce((s, f) => s + (f.amount || 0), 0);
  const paid    = fees.filter(f=>f.status==='paid').reduce((s,f)=>s+f.amount,0);
  const pending = fees.filter(f=>f.status!=='paid').reduce((s,f)=>s+f.amount,0);

  return (
    <div className="text-white">
      {showAdd && <AddFeeModal students={students} onClose={()=>setShowAdd(false)} onSaved={()=>{ setShowAdd(false); load(); }} />}

      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Fee Management</h1>
          <p className="text-white/40 text-sm">{fees.length} records</p>
        </div>
        <button onClick={()=>setShowAdd(true)}
          className="bg-accent hover:bg-accent-h text-white text-[13px] font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={15}/>Add Fee
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label:'Total', value:`Nu. ${total.toLocaleString()}`, color:'text-white' },
          { label:'Collected', value:`Nu. ${paid.toLocaleString()}`, color:'text-green-400' },
          { label:'Outstanding', value:`Nu. ${pending.toLocaleString()}`, color:'text-red-400' },
        ].map(s=>(
          <div key={s.label} className="bg-dark-2 border border-white/[0.05] rounded-xl p-4">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-white/35 text-[11px] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {['all','paid','pending','overdue'].map(s=>(
          <button key={s} onClick={()=>setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium capitalize transition-colors ${filter===s?'bg-accent text-white':'bg-dark-2 border border-white/[0.05] text-white/40 hover:text-white'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-dark-2 border border-white/[0.05] rounded-2xl overflow-hidden">
        {loading ? <p className="text-white/25 text-center py-10 text-sm">Loading…</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead><tr className="border-b border-white/[0.05]">
                {['Student','Fee Type','Amount','Due Date','Term','Status'].map(h=>(
                  <th key={h} className="text-left px-5 py-3 text-white/30 font-medium">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {visible.map(f=>(
                  <tr key={f._id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-white/70">{f.studentId?.slice(0,8) || '—'}</td>
                    <td className="px-5 py-3 text-white">{f.feeType}</td>
                    <td className="px-5 py-3 text-white font-medium">Nu. {f.amount?.toLocaleString()}</td>
                    <td className="px-5 py-3 text-white/50">{fmt(f.dueDate)}</td>
                    <td className="px-5 py-3 text-white/50">{f.term || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md capitalize ${statusBadge[f.status] || 'bg-white/5 text-white/40'}`}>
                        {f.status}
                      </span>
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
