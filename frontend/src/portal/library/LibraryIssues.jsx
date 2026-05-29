import { useState, useEffect } from "react";
import api from "../../lib/api";
import { RotateCcw, Plus, X, Check, AlertCircle } from "lucide-react";

function IssueModal({ onClose, onSaved }) {
  const [books, setBooks]       = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm]         = useState({ bookId:"", studentId:"", dueDate:"" });
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    api.get("/library", { params: { available: true } }).then(r=>setBooks(r.data.data)).catch(()=>{});
    api.get("/users/students/all").then(r=>setStudents(r.data.data)).catch(()=>{});
    const d = new Date(); d.setDate(d.getDate()+14);
    setForm(f=>({...f, dueDate: d.toISOString().split("T")[0]}));
  }, []);

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await api.post("/library/issues", form); onSaved(); }
    catch(err){ alert(err.response?.data?.message||"Error issuing book"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-dark-2 border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white text-[16px]">Issue Book</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={18}/></button>
        </div>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-white/40 mb-1">Select Book</label>
            <select value={form.bookId} onChange={e=>setForm(f=>({...f,bookId:e.target.value}))} required
              className="w-full bg-dark border border-white/8 rounded-lg px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-accent">
              <option value="">Choose available book…</option>
              {books.map(b=><option key={b._id} value={b._id}>{b.title} — {b.author} ({b.availableCopies} avail.)</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-white/40 mb-1">Select Student</label>
            <select value={form.studentId} onChange={e=>setForm(f=>({...f,studentId:e.target.value}))} required
              className="w-full bg-dark border border-white/8 rounded-lg px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-accent">
              <option value="">Choose student…</option>
              {students.map(s=><option key={s._id} value={s._id}>{s.user?.name} — {s.class} {s.stream}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-white/40 mb-1">Due Date</label>
            <input type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))} required
              className="w-full bg-dark border border-white/8 rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-accent"/>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="bg-accent hover:bg-accent-h text-white text-[13px] font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors">
              <Check size={14}/>{saving?"Issuing…":"Issue Book"}
            </button>
            <button type="button" onClick={onClose} className="border border-white/10 text-white/50 hover:text-white text-[13px] px-5 py-2.5 rounded-lg">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const statusBadge = {
  issued:   "bg-yellow-500/15 text-yellow-400",
  returned: "bg-green-500/15  text-green-400",
  overdue:  "bg-red-500/15    text-red-400",
};

export default function LibraryIssues() {
  const [issues, setIssues]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const [showIssue, setShowIssue] = useState(false);
  const [returning, setReturning] = useState(null);

  const load = () => {
    setLoading(true);
    const params = filter !== "all" ? { status: filter } : {};
    api.get("/library/issues", { params }).then(r=>setIssues(r.data.data)).catch(()=>setIssues([])).finally(()=>setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const returnBook = async (id) => {
    setReturning(id);
    try { await api.put(`/library/issues/${id}/return`, {}); load(); }
    catch(err){ alert(err.response?.data?.message||"Error"); }
    finally { setReturning(null); }
  };

  const fmt = d => new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });

  return (
    <div className="space-y-6">
      {showIssue && <IssueModal onClose={()=>setShowIssue(false)} onSaved={()=>{ setShowIssue(false); load(); }} />}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-black text-xl text-white tracking-tight">Book Issues</h1>
          <p className="text-white/35 text-[13px] mt-0.5">Track issued and returned books</p>
        </div>
        <button onClick={()=>setShowIssue(true)} className="bg-accent hover:bg-accent-h text-white text-[13px] font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={15}/>Issue Book
        </button>
      </div>

      <div className="flex gap-2">
        {["all","issued","overdue","returned"].map(s=>(
          <button key={s} onClick={()=>setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium capitalize transition-colors ${filter===s?"bg-accent text-white":"bg-dark-2 border border-white/8 text-white/40 hover:text-white"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-dark-2 border border-white/8 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-white/25 text-center py-10 text-[13px]">Loading…</p>
        ) : issues.length === 0 ? (
          <p className="text-white/25 text-center py-10 text-[13px]">No records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead><tr className="border-b border-white/5">
                {["Student","Book","Issued","Due","Status","Fine",""].map(h=>(
                  <th key={h} className="text-left px-5 py-3 text-white/30 font-medium">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {issues.map(issue=>(
                  <tr key={issue._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-white font-medium">{issue.student?.user?.name||"—"}</td>
                    <td className="px-5 py-3">
                      <p className="text-white">{issue.book?.title}</p>
                      <p className="text-white/35 text-[11px]">{issue.book?.author}</p>
                    </td>
                    <td className="px-5 py-3 text-white/50">{fmt(issue.issuedAt)}</td>
                    <td className="px-5 py-3 text-white/50">{fmt(issue.dueDate)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md capitalize ${statusBadge[issue.status]}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-white/50">{issue.fine>0?`Nu. ${issue.fine}`:"—"}</td>
                    <td className="px-5 py-3">
                      {issue.status !== "returned" && (
                        <button onClick={()=>returnBook(issue._id)} disabled={returning===issue._id}
                          className="flex items-center gap-1.5 text-[12px] text-white/40 hover:text-green-400 transition-colors disabled:opacity-50">
                          <RotateCcw size={13}/>{returning===issue._id?"…":"Return"}
                        </button>
                      )}
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
