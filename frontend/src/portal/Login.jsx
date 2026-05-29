import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

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

      {/* ── Left panel ── */}
      <div className="hidden lg:flex w-[52%] xl:w-1/2 flex-col relative overflow-hidden shrink-0"
        style={{ background: "linear-gradient(150deg, #0c1a2e 0%, #0A0A0C 55%, #080808 100%)" }}>

        {/* Accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent via-accent to-transparent" />

        {/* Soft glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 55% at 25% 35%, rgba(0,102,204,0.13) 0%, transparent 65%)" }} />

        {/* Logo */}
        <div className="relative z-10 p-10 xl:p-12">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img src="/ua-logo.jpg" alt="Ugyen Academy"
              className="h-10 w-10 object-cover rounded-full ring-2 ring-white/10 group-hover:ring-accent/50 transition-all shrink-0" />
            <span className="font-wordmark font-bold text-[17px] text-white tracking-tight">Ugyen Academy</span>
          </Link>
        </div>

        {/* Main copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 xl:px-12 pb-8">
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-accent mb-5">School Portal</p>
          <h2 className="text-[2.6rem] xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
            Your school,<br />at your<br />fingertips.
          </h2>
          <p className="text-white/35 text-[14px] leading-relaxed max-w-[300px] mb-8">
            Progress, attendance, fees and announcements — all in one place for students, parents and staff.
          </p>

          {/* Role chips */}
          <div className="flex flex-wrap gap-2">
            {["Students", "Parents", "Teachers", "Admin"].map(r => (
              <span key={r}
                className="text-[11px] font-medium text-white/40 border border-white/[0.08] rounded-full px-3.5 py-1">
                {r}
              </span>
            ))}
          </div>

          {/* Divider + school stats */}
          <div className="mt-10 pt-8 border-t border-white/[0.06] grid grid-cols-3 gap-6">
            {[
              { value: "47",        label: "Faculty" },
              { value: "VII–XII",   label: "Classes" },
              { value: "Est. 2002", label: "Punakha, Bhutan" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-[18px] font-black text-white">{s.value}</p>
                <p className="text-white/30 text-[11px] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Motto footer */}
        <div className="relative z-10 px-10 xl:px-12 pb-10">
          <p className="text-[11px] text-white/20 tracking-wide">
            "A School of <span className="text-white/35">W</span>inners,{" "}
            <span className="text-white/35">I</span>nnovators,{" "}
            <span className="text-white/35">L</span>earners,{" "}
            <span className="text-white/35">L</span>eaders"
          </p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12"
        style={{ background: "#0e0e11" }}>

        {/* Mobile logo */}
        <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-10">
          <img src="/ua-logo.jpg" alt="Ugyen Academy"
            className="h-9 w-9 object-cover rounded-full ring-2 ring-white/10 shrink-0" />
          <span className="font-wordmark font-bold text-[16px] text-white tracking-tight">Ugyen Academy</span>
        </Link>

        <div className="w-full max-w-[340px]">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[26px] font-black text-white tracking-tight mb-1.5">Sign in</h1>
            <p className="text-white/35 text-[13px]">Use your school-issued credentials.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {error && (
              <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-[13px] px-4 py-3 rounded-xl leading-snug">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/30">Email</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@ua.edu.bt"
                className="w-full bg-dark-2 border border-white/[0.07] rounded-xl px-4 py-3 text-[14px] text-white placeholder-white/20 focus:outline-none focus:border-accent/60 focus:bg-[#161618] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/30">Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"} required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-dark-2 border border-white/[0.07] rounded-xl px-4 py-3 text-[14px] text-white placeholder-white/20 focus:outline-none focus:border-accent/60 focus:bg-[#161618] transition-all pr-11"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors p-0.5">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-accent hover:bg-accent-h disabled:opacity-40 text-white font-semibold text-[14px] py-3 rounded-xl transition-colors mt-1 tracking-wide">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/[0.05]">
            <Link to="/" className="flex items-center gap-1.5 text-[12px] text-white/25 hover:text-white/50 transition-colors">
              <ArrowLeft size={13} />
              Back to Ugyen Academy
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
