import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/academics", label: "Academics" },
  { to: "/admissions", label: "Admissions" },
  { to: "/sports", label: "Sports" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isDark = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isDark
          ? "bg-transparent border-b border-transparent"
          : "bg-white/95 backdrop-blur-md border-b border-border"
      }`}
    >
      <div className="wrap flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className={`flex items-center justify-center w-7 h-7 rounded-md text-[11px] font-black tracking-tight select-none transition-colors duration-200 ${isDark ? "bg-white text-dark group-hover:bg-accent group-hover:text-white" : "bg-dark text-white group-hover:bg-accent"}`}>
            UA
          </span>
          <span className={`font-wordmark font-bold text-[15px] tracking-tight transition-colors duration-200 ${isDark ? "text-white" : "text-text"}`}>
            Ugyen Academy
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                isDark
                  ? pathname === to
                    ? "text-white bg-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/8"
                  : pathname === to
                  ? "text-text bg-surface"
                  : "text-muted hover:text-text hover:bg-surface"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/portal/login"
            className={`text-[13px] font-medium transition-colors duration-150 ${isDark ? "text-white/60 hover:text-white hover:bg-white/8" : "text-muted hover:text-text hover:bg-surface"} px-3 py-1.5 rounded-lg`}
          >
            Portal
          </Link>
          <Link
            to="/admissions"
            className="ml-1 bg-accent hover:bg-accent-h text-white rounded-lg px-4 py-2 text-[13px] font-medium transition-colors"
          >
            Apply Now
          </Link>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden p-2 rounded-md ${isDark ? "text-white" : "text-text"}`}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-border">
          <div className="wrap py-4 flex flex-col gap-1">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-3 py-2.5 rounded-md text-[14px] font-medium text-text hover:bg-surface transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link
              to="/admissions"
              className="mt-2 bg-accent hover:bg-accent-h text-white rounded-lg px-4 py-2.5 text-[13px] font-medium text-center transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
