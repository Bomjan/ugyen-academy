import { useState, useEffect } from "react";
import api from "../../lib/api";
import { BookOpen, Clock, AlertCircle } from "lucide-react";

const statusBadge = {
  issued:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  returned: "bg-green-500/15  text-green-400  border-green-500/20",
  overdue:  "bg-red-500/15    text-red-400    border-red-500/20",
};
const statusIcon = { issued: Clock, returned: BookOpen, overdue: AlertCircle };

export default function MyBooks() {
  const [issues, setIssues]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/library/my-issues").then(r=>setIssues(r.data.data)).catch(()=>setIssues([])).finally(()=>setLoading(false));
  }, []);

  const fmt = d => new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });

  const active   = issues.filter(i=>i.status!=="returned");
  const history  = issues.filter(i=>i.status==="returned");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-black text-xl text-white tracking-tight">My Books</h1>
        <p className="text-white/35 text-[13px] mt-0.5">Books currently borrowed and past history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:"Currently Borrowed", value: active.length,   color:"text-yellow-400" },
          { label:"Overdue",            value: issues.filter(i=>i.status==="overdue").length, color:"text-red-400" },
          { label:"Total Borrowed",     value: issues.length,   color:"text-white" },
        ].map(s=>(
          <div key={s.label} className="bg-dark-2 border border-white/8 rounded-xl p-4 text-center">
            <p className={`font-black text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-white/35 text-[11px] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? <p className="text-white/25 text-center py-10">Loading…</p> : (
        <>
          {active.length > 0 && (
            <div>
              <h2 className="font-semibold text-white text-[14px] mb-3">Currently Borrowed</h2>
              <div className="space-y-3">
                {active.map(issue=>{
                  const Icon = statusIcon[issue.status];
                  return (
                    <div key={issue._id} className={`bg-dark-2 border rounded-2xl p-5 flex items-start justify-between gap-4 ${issue.status==="overdue"?"border-red-500/20":"border-white/8"}`}>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[15px] text-white">{issue.book?.title}</h3>
                        <p className="text-white/40 text-[13px]">{issue.book?.author}</p>
                        <p className="text-white/25 text-[11px] mt-1">{issue.book?.category}</p>
                        <div className="flex items-center gap-4 mt-3 text-[12px]">
                          <span className="text-white/35">Issued: {fmt(issue.issuedAt)}</span>
                          <span className={issue.status==="overdue"?"text-red-400":"text-white/35"}>Due: {fmt(issue.dueDate)}</span>
                        </div>
                        {issue.fine>0 && <p className="text-red-400 text-[12px] mt-1">Fine: Nu. {issue.fine}</p>}
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border capitalize flex items-center gap-1.5 ${statusBadge[issue.status]}`}>
                        <Icon size={11}/>{issue.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div>
              <h2 className="font-semibold text-white text-[14px] mb-3">Borrowing History</h2>
              <div className="bg-dark-2 border border-white/8 rounded-2xl overflow-hidden">
                <table className="w-full text-[13px]">
                  <thead><tr className="border-b border-white/5">
                    {["Book","Author","Issued","Returned"].map(h=>(
                      <th key={h} className="text-left px-5 py-3 text-white/30 font-medium">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {history.map(issue=>(
                      <tr key={issue._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-5 py-3 text-white">{issue.book?.title}</td>
                        <td className="px-5 py-3 text-white/40">{issue.book?.author}</td>
                        <td className="px-5 py-3 text-white/40">{fmt(issue.issuedAt)}</td>
                        <td className="px-5 py-3 text-green-400">{issue.returnedAt?fmt(issue.returnedAt):"—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {issues.length === 0 && (
            <div className="text-center py-16">
              <BookOpen size={32} className="text-white/10 mx-auto mb-3"/>
              <p className="text-white/25 text-[14px]">No borrowing history yet</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
