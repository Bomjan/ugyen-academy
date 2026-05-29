import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";

const links = [
  { to: "/",           label: "Home" },
  { to: "/academics",  label: "Academics" },
  { to: "/admissions", label: "Admissions" },
  { to: "/sports",     label: "Sports" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const { pathname } = useLocation();
  const isDark = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isDark ? "bg-transparent border-b border-transparent" : "bg-white/95 backdrop-blur-md border-b border-border"
      }`}>
        <div className="wrap flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/ua-logo.jpg" alt="Ugyen Academy" className="h-8 w-8 object-cover rounded-full shrink-0" />
            <span className={`font-wordmark font-bold text-[15px] tracking-tight transition-colors duration-200 ${isDark ? "text-white" : "text-text"}`}>Ugyen Academy</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {links.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                  isDark
                    ? pathname === to ? "text-white bg-white/10" : "text-white/60 hover:text-white hover:bg-white/8"
                    : pathname === to ? "text-text bg-surface"   : "text-muted hover:text-text hover:bg-surface"
                }`}>
                {label}
              </Link>
            ))}
            <Link to="/portal/login"
              className={`text-[13px] font-medium transition-colors px-3 py-1.5 rounded-lg ${
                isDark ? "text-white/60 hover:text-white hover:bg-white/8" : "text-muted hover:text-text hover:bg-surface"
              }`}>
              Portal
            </Link>
            <Link to="/admissions"
              className="ml-1 bg-accent hover:bg-accent-h text-white rounded-lg px-4 py-2 text-[13px] font-medium transition-colors">
              Apply Now
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button onClick={() => setOpen(true)}
            className={`md:hidden flex flex-col gap-[5px] p-2 rounded-md group ${isDark ? "text-white" : "text-text"}`}
            aria-label="Open menu">
            <span className={`block h-[1.5px] w-5 rounded-full transition-all ${isDark ? "bg-white/70 group-hover:bg-white" : "bg-text/60 group-hover:bg-text"}`} />
            <span className={`block h-[1.5px] w-3.5 rounded-full transition-all ${isDark ? "bg-white/70 group-hover:bg-white" : "bg-text/60 group-hover:bg-text"}`} />
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col backdrop-in"
          style={{ background: "rgba(10,10,12,0.98)", backdropFilter: "blur(16px)" }}>

          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-5 shrink-0">
            <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
              <img src="/ua-logo.jpg" alt="Ugyen Academy" className="h-8 w-8 object-cover rounded-full shrink-0" />
            <span className={`font-wordmark font-bold text-[15px] tracking-tight transition-colors duration-200 ${isDark ? "text-white" : "text-text"}`}>Ugyen Academy</span>
            </Link>
            <button onClick={() => setOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/8 text-white/50 hover:text-white hover:bg-white/12 transition-all">
              <X size={18} />
            </button>
          </div>

          {/* Eyebrow */}
          <div className="px-6 mb-4 shrink-0">
            <p className="menu-item text-[11px] font-semibold tracking-widest uppercase text-white/20"
              style={{ animationDelay: "40ms" }}>
              Navigation
            </p>
          </div>

          {/* Nav links — large */}
          <nav className="flex-1 px-5 flex flex-col justify-start gap-0.5 overflow-y-auto">
            {links.map(({ to, label }, i) => {
              const active = pathname === to;
              return (
                <Link key={to} to={to} onClick={() => setOpen(false)}
                  className="menu-item group flex items-center justify-between px-3 py-4 rounded-2xl transition-colors hover:bg-white/[0.05] active:bg-white/[0.08]"
                  style={{ animationDelay: `${80 + i * 45}ms` }}>
                  <span className={`font-black tracking-tight transition-colors ${
                    active ? "text-white" : "text-white/40 group-hover:text-white"
                  }`} style={{ fontSize: "clamp(1.6rem,7vw,2.2rem)" }}>
                    {label}
                  </span>
                  {active && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
                </Link>
              );
            })}
          </nav>

          {/* Bottom CTA area */}
          <div className="px-5 pb-10 pt-6 shrink-0 space-y-3">
            <div className="h-px bg-white/[0.07] mb-5" />
            <Link to="/admissions" onClick={() => setOpen(false)}
              className="menu-item block w-full bg-accent hover:bg-accent-h text-white text-[15px] font-semibold text-center px-6 py-4 rounded-2xl transition-colors"
              style={{ animationDelay: `${80 + links.length * 45}ms` }}>
              Apply for 2026
            </Link>
            <Link to="/portal/login" onClick={() => setOpen(false)}
              className="menu-item block w-full border border-white/[0.06] text-white/40 hover:text-white hover:border-white/[0.1] text-[14px] font-medium text-center px-6 py-3.5 rounded-2xl transition-all"
              style={{ animationDelay: `${80 + links.length * 45 + 40}ms` }}>
              Student Portal
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
