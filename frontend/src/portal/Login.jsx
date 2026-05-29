import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [show, setShow]       = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(`/portal/${user.role}`);
    } catch (err) {
      if (!err.response) {
        setError("Cannot reach server — make sure the app is running.");
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || "Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between p-12 relative overflow-hidden shrink-0"
        style={{ background: "linear-gradient(160deg, #0d0d10 0%, #0A0A0C 60%, #060608 100%)" }}>
        {/* Accent top line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent" />
        {/* Subtle glow */}
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 40% at 40% 30%, rgba(0,102,204,0.07) 0%, transparent 70%)" }} />

        <Link to="/" className="flex items-center gap-3 group relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center shadow-lg">
            <span className="text-white text-[13px] font-black tracking-tighter">UA</span>
          </div>
          <span className="font-wordmark font-bold text-[18px] text-white tracking-tight">Ugyen Academy</span>
        </Link>

        <div className="relative z-10 space-y-6">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-accent mb-4">School Portal</p>
            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
              Your school,<br />at your fingertips.
            </h2>
          </div>
          <p className="text-white/35 text-[14px] leading-relaxed max-w-xs">
            Manage progress, attendance, fees, and announcements — all in one place for students, parents, and staff.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {["Students", "Parents", "Teachers", "Admin"].map(r => (
              <span key={r} className="text-[11px] text-white/40 border border-white/[0.05] rounded-full px-3 py-1">{r}</span>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-[12px] relative z-10">
          Khuruthang, Punakha · Est. 2002
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-dark">
        {/* Mobile logo */}
        <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
            <span className="text-white text-[12px] font-black">UA</span>
          </div>
          <span className="font-wordmark font-bold text-[16px] text-white">Ugyen Academy</span>
        </Link>

        <div className="w-full max-w-[360px]">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-white tracking-tight mb-1.5">Sign in</h1>
            <p className="text-white/35 text-[14px]">Use your school-issued credentials.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {error && (
              <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-[13px] px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[12px] font-medium text-white/40 tracking-wide">Email</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@school.edu.bt"
                className="w-full bg-dark-2 border border-white/[0.05] rounded-xl px-4 py-3 text-[14px] text-white placeholder-white/20 focus:outline-none focus:border-accent focus:bg-dark-3 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[12px] font-medium text-white/40 tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"} required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-dark-2 border border-white/[0.05] rounded-xl px-4 py-3 text-[14px] text-white placeholder-white/20 focus:outline-none focus:border-accent focus:bg-dark-3 transition-all pr-11"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors p-0.5">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-accent hover:bg-accent-h disabled:opacity-40 text-white font-semibold text-[14px] py-3 rounded-xl transition-colors mt-2">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-[12px] text-white/20 mt-8">
            <Link to="/" className="hover:text-white/40 transition-colors">← Back to ugyen academy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
