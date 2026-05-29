import { useState, useEffect } from "react";
import api from "../../lib/api";
import { Search, BookOpen, Plus, X, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = ["All","Science","Mathematics","Literature","History","Geography","Arts","Commerce","Sports","General","Reference","Fiction","Non-Fiction"];
const statusBadge = { issued:"bg-yellow-500/15 text-yellow-400", returned:"bg-green-500/15 text-green-400", overdue:"bg-red-500/15 text-red-400" };

function AddBookModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ title:"", author:"", isbn:"", category:"General", publisher:"", publishYear:"", totalCopies:1, shelf:"", description:"", language:"English" });
  const [saving, setSaving] = useState(false);
  const F = ({ label, name, type="text", ...rest }) => (
    <div>
      <label className="block text-[11px] font-medium text-white/40 mb-1">{label}</label>
      <input type={type} value={form[name]} onChange={e => setForm(f=>({...f,[name]:e.target.value}))} {...rest}
        className="w-full bg-dark border border-white/[0.05] rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-accent" />
    </div>
  );
  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post("/library", { ...form, totalCopies: Number(form.totalCopies), availableCopies: Number(form.totalCopies), publishYear: form.publishYear ? Number(form.publishYear) : undefined });
      onSaved();
    } catch(err){ alert(err.response?.data?.message||"Error"); }
    finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-dark-2 border border-white/[0.05] rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white text-[16px]">Add New Book</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={18}/></button>
        </div>
        <form onSubmit={save} className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><F label="Title *" name="title" required /></div>
          <F label="Author *" name="author" required />
          <F label="ISBN" name="isbn" />
          <div>
            <label className="block text-[11px] font-medium text-white/40 mb-1">Category</label>
            <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
              className="w-full bg-dark border border-white/[0.05] rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-accent">
              {CATEGORIES.slice(1).map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <F label="Copies" name="totalCopies" type="number" min="1" />
          <F label="Publisher" name="publisher" />
          <F label="Publish Year" name="publishYear" type="number" />
          <F label="Shelf Location" name="shelf" />
          <F label="Language" name="language" />
          <div className="col-span-2">
            <label className="block text-[11px] font-medium text-white/40 mb-1">Description</label>
            <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2}
              className="w-full bg-dark border border-white/[0.05] rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-accent resize-none"/>
          </div>
          <div className="col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="bg-accent hover:bg-accent-h text-white text-[13px] font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors">
              <Check size={14}/>{saving?"Saving…":"Add Book"}
            </button>
            <button type="button" onClick={onClose} className="border border-white/[0.05] text-white/50 hover:text-white text-[13px] px-5 py-2.5 rounded-lg transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LibraryCatalog() {
  const { user } = useAuth();
  const isStaff  = ["admin","teacher"].includes(user?.role);
  const [books, setBooks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");
  const [showAdd, setShowAdd]   = useState(false);

  const load = () => {
    setLoading(true);
    const params = {};
    if (search)             params.search   = search;
    if (category !== "All") params.category = category;
    api.get("/library", { params }).then(r => setBooks(r.data.data)).catch(()=>setBooks([])).finally(()=>setLoading(false));
  };

  useEffect(() => { load(); }, [category]);
  useEffect(() => { const t = setTimeout(load, 400); return ()=>clearTimeout(t); }, [search]);

  return (
    <div className="space-y-6">
      {showAdd && <AddBookModal onClose={()=>setShowAdd(false)} onSaved={()=>{ setShowAdd(false); load(); }} />}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-black text-xl text-white tracking-tight">Library Catalog</h1>
          <p className="text-white/35 text-[13px] mt-0.5">{books.length} books found</p>
        </div>
        {isStaff && (
          <button onClick={()=>setShowAdd(true)} className="bg-accent hover:bg-accent-h text-white text-[13px] font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={15}/>Add Book
          </button>
        )}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by title, author or ISBN…"
            className="w-full bg-dark-2 border border-white/[0.05] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-accent"/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={()=>setCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${category===c?"bg-accent text-white":"bg-dark-2 border border-white/[0.05] text-white/40 hover:text-white"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-white/25 text-center py-16">Loading catalog…</p>
      ) : books.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen size={32} className="text-white/10 mx-auto mb-3"/>
          <p className="text-white/25 text-[14px]">No books found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {books.map(b => (
            <div key={b._id} className="bg-dark-2 border border-white/[0.05] rounded-2xl p-5 hover:border-white/15 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-accent/70 bg-accent/10 px-2 py-0.5 rounded-md">{b.category}</span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${b.availableCopies>0?"bg-green-500/10 text-green-400":"bg-red-500/10 text-red-400"}`}>
                  {b.availableCopies>0?`${b.availableCopies} avail.`:"Unavailable"}
                </span>
              </div>
              <h3 className="font-semibold text-[14px] text-white leading-snug mb-1 line-clamp-2">{b.title}</h3>
              <p className="text-[12px] text-white/40 mb-2">{b.author}</p>
              {b.shelf && <p className="text-[11px] text-white/25">Shelf: {b.shelf}</p>}
              <p className="text-[11px] text-white/20 mt-1">{b.totalCopies} total cop{b.totalCopies===1?"y":"ies"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
