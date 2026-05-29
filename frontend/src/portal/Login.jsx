import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

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
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <span className="text-white text-[12px] font-black">UA</span>
            </div>
            <span className="font-semibold text-[16px] text-white">Ugyen Academy</span>
          </Link>
          <h1 className="font-black text-2xl text-white tracking-tight">Student Portal</h1>
          <p className="text-white/40 text-[14px] mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={submit} className="bg-dark-2 border border-white/8 rounded-2xl p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[12px] font-medium text-white/50 mb-1.5">Email address</label>
            <input
              type="email" required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@ugyenacademy.edu.bt"
              className="w-full bg-dark-3 border border-white/8 rounded-xl px-4 py-2.5 text-[14px] text-white placeholder-white/20 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-white/50 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"} required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full bg-dark-3 border border-white/8 rounded-xl px-4 py-2.5 text-[14px] text-white placeholder-white/20 focus:outline-none focus:border-accent transition-colors pr-10"
              />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-accent hover:bg-accent-h disabled:opacity-50 text-white font-semibold text-[14px] py-3 rounded-xl transition-colors inline-flex items-center justify-center gap-2">
            {loading ? "Signing in…" : <><span>Sign In</span><ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="text-center text-[12px] text-white/25 mt-6">
          <Link to="/" className="hover:text-white/50 transition-colors">← Back to ugyen academy</Link>
        </p>
      </div>
    </div>
  );
}
