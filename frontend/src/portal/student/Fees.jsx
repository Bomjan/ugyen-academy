import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

function statusBadge(s) {
  if (s === 'paid') return 'bg-green-500/15 text-green-400 border border-green-500/20';
  if (s === 'pending') return 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20';
  return 'bg-red-500/15 text-red-400 border border-red-500/20';
}

export default function StudentFees() {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sid = user?._id || user?.id;
    Promise.all([
      api.get('/fees/my').then(r => setFees(r.data)).catch(() => {}),
      sid ? api.get(`/fees/summary/${sid}`).then(r => setSummary(r.data)).catch(() => {}) : Promise.resolve()
    ]).finally(() => setLoading(false));
  }, [user]);

  const totalOwed = summary?.totalOwed ?? fees.filter(f => f.status !== 'paid').reduce((s, f) => s + (f.amount || 0), 0);
  const totalPaid = summary?.totalPaid ?? fees.filter(f => f.status === 'paid').reduce((s, f) => s + (f.amount || 0), 0);
  const overdue = summary?.overdue ?? fees.filter(f => f.status === 'overdue').reduce((s, f) => s + (f.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">My Fees</h1>
        <p className="text-white/40 text-sm mb-6">Fee payment status and history</p>

        {loading ? (
          <p className="text-white/30 text-sm">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-[#141416] border border-white/8 rounded-xl p-4">
                <p className="text-xs text-white/40 mb-2">Total Owed</p>
                <p className="text-2xl font-bold text-red-400">Nu. {totalOwed.toLocaleString()}</p>
              </div>
              <div className="bg-[#141416] border border-white/8 rounded-xl p-4">
                <p className="text-xs text-white/40 mb-2">Total Paid</p>
                <p className="text-2xl font-bold text-green-400">Nu. {totalPaid.toLocaleString()}</p>
              </div>
              <div className="bg-[#141416] border border-white/8 rounded-xl p-4">
                <p className="text-xs text-white/40 mb-2">Overdue</p>
                <p className={`text-2xl font-bold ${overdue > 0 ? 'text-red-400' : 'text-white/40'}`}>Nu. {overdue.toLocaleString()}</p>
              </div>
            </div>

            <h2 className="text-base font-semibold mb-3">Fee Records</h2>
            {fees.length === 0 ? (
              <div className="bg-[#141416] border border-white/8 rounded-2xl p-8 text-center text-white/30 text-sm">No fee records found.</div>
            ) : (
              <div className="bg-[#141416] border border-white/8 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      <th className="text-left px-5 py-3 text-white/40 font-normal">Description</th>
                      <th className="text-left px-5 py-3 text-white/40 font-normal">Amount</th>
                      <th className="text-left px-5 py-3 text-white/40 font-normal">Due Date</th>
                      <th className="text-left px-5 py-3 text-white/40 font-normal">Paid Date</th>
                      <th className="text-left px-5 py-3 text-white/40 font-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((f, i) => (
                      <tr key={f._id || i} className="border-b border-white/5 hover:bg-white/2">
                        <td className="px-5 py-3 text-white">{f.description || f.feeType || 'Fee'}</td>
                        <td className="px-5 py-3 text-white font-medium">Nu. {(f.amount || 0).toLocaleString()}</td>
                        <td className="px-5 py-3 text-white/50">{f.dueDate ? fmt(f.dueDate) : '—'}</td>
                        <td className="px-5 py-3 text-white/50">{f.paidDate ? fmt(f.paidDate) : '—'}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusBadge(f.status)}`}>{f.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
