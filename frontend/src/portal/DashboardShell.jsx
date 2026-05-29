import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, TrendingUp, CalendarCheck, Megaphone,
  CreditCard, Users, LogOut, BookMarked, BookOpen, X, MoreHorizontal
} from "lucide-react";
import { useState } from "react";

const navByRole = {
  admin: [
    { to: "/portal/admin",                icon: LayoutDashboard, label: "Dashboard" },
    { to: "/portal/admin/students",       icon: Users,           label: "Students" },
    { to: "/portal/admin/progress",       icon: TrendingUp,      label: "Progress" },
    { to: "/portal/admin/attendance",     icon: CalendarCheck,   label: "Attendance" },
    { to: "/portal/admin/announcements",  icon: Megaphone,       label: "Notices" },
    { to: "/portal/admin/fees",           icon: CreditCard,      label: "Fees" },
  ],
  teacher: [
    { to: "/portal/teacher",              icon: LayoutDashboard, label: "Dashboard" },
    { to: "/portal/teacher/progress",     icon: TrendingUp,      label: "Progress" },
    { to: "/portal/teacher/attendance",   icon: CalendarCheck,   label: "Attendance" },
    { to: "/portal/teacher/announcements",icon: Megaphone,       label: "Notices" },
    { to: "/portal/library/catalog",      icon: BookMarked,      label: "Library" },
    { to: "/portal/library/issues",       icon: BookOpen,        label: "Issue Books" },
  ],
  student: [
    { to: "/portal/student",              icon: LayoutDashboard, label: "Dashboard" },
    { to: "/portal/student/progress",     icon: TrendingUp,      label: "Progress" },
    { to: "/portal/student/attendance",   icon: CalendarCheck,   label: "Attendance" },
    { to: "/portal/student/fees",         icon: CreditCard,      label: "Fees" },
    { to: "/portal/student/announcements",icon: Megaphone,       label: "Notices" },
    { to: "/portal/library/catalog",      icon: BookMarked,      label: "Library" },
    { to: "/portal/library/my-books",     icon: BookOpen,        label: "My Books" },
  ],
  parent: [
    { to: "/portal/parent",              icon: LayoutDashboard, label: "Dashboard" },
    { to: "/portal/parent/progress",     icon: TrendingUp,      label: "Progress" },
    { to: "/portal/parent/attendance",   icon: CalendarCheck,   label: "Attendance" },
    { to: "/portal/parent/fees",         icon: CreditCard,      label: "Fees" },
    { to: "/portal/parent/announcements",icon: Megaphone,       label: "Notices" },
  ],
};

const roleLabel = { admin: "Administrator", teacher: "Teacher", student: "Student", parent: "Parent" };

// First 4 items go in the dock; rest go in the overflow sheet
const DOCK_LIMIT = 4;

function SidebarContent({ user, nav, location, onNav, onLogout }) {
  return (
    <div className="flex flex-col h-full">
      <div className="h-[2px] bg-accent shrink-0" />
      <div className="px-5 py-4 shrink-0">
        <Link to="/" className="flex items-center gap-2.5 group" onClick={onNav}>
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-sm">
            <span className="text-white text-[11px] font-black tracking-tighter">UA</span>
          </div>
          <span className="font-wordmark font-bold text-[15px] text-white group-hover:text-accent transition-colors tracking-tight">
            Ugyen Academy
          </span>
        </Link>
      </div>
      <div className="mx-3 mb-2 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3.5 py-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
            <span className="text-accent text-[12px] font-bold">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-[13px] font-semibold truncate leading-tight">{user?.name}</p>
            <p className="text-white/35 text-[11px] leading-tight mt-0.5">{roleLabel[user?.role] || user?.role}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {nav.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to} onClick={onNav}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                active ? "bg-accent text-white shadow-sm" : "text-white/55 hover:text-white hover:bg-white/[0.06]"
              }`}>
              <item.icon size={15} className="shrink-0" strokeWidth={active ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 shrink-0">
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-white/30 hover:text-white/70 hover:bg-white/[0.04] transition-all">
          <LogOut size={14} className="shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function DashboardShell({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);

  const nav = navByRole[user?.role] || [];
  const dockItems = nav.slice(0, DOCK_LIMIT);
  const overflowItems = nav.slice(DOCK_LIMIT);
  const hasOverflow = overflowItems.length > 0;

  const handleLogout = () => { logout(); navigate("/portal/login"); };
  const close = () => setSheetOpen(false);

  // Is any overflow item currently active?
  const overflowActive = overflowItems.some(item => location.pathname === item.to);

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[220px] shrink-0 bg-dark-2 border-r border-white/[0.06]">
        <SidebarContent user={user} nav={nav} location={location} onNav={() => {}} onLogout={handleLogout} />
      </aside>

      {/* Mobile overflow sheet */}
      {sheetOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end backdrop-in">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />

          {/* Sheet */}
          <div className="relative sheet-in rounded-t-3xl overflow-hidden"
            style={{ background: "rgba(20,20,22,0.98)" }}>
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full bg-white/15" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3">
              <p className="text-white/40 text-[12px] font-semibold uppercase tracking-widest">More</p>
              <button onClick={close}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/8 text-white/50 hover:text-white transition-all">
                <X size={15} />
              </button>
            </div>

            {/* Overflow nav items */}
            <div className="px-4 pb-2 space-y-1">
              {overflowItems.map((item, i) => {
                const active = location.pathname === item.to;
                return (
                  <Link key={item.to} to={item.to} onClick={close}
                    className={`menu-item flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-semibold transition-colors ${
                      active ? "bg-accent text-white" : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                    }`}
                    style={{ animationDelay: `${i * 40}ms` }}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      active ? "bg-white/20" : "bg-white/[0.07]"
                    }`}>
                      <item.icon size={17} strokeWidth={active ? 2.5 : 2} />
                    </div>
                    {item.label}
                    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
                  </Link>
                );
              })}
            </div>

            {/* Sign out */}
            <div className="px-4 pt-1 pb-8">
              <div className="h-px bg-white/[0.06] mb-3" />
              <button onClick={() => { close(); handleLogout(); }}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[14px] font-medium text-white/30 hover:text-red-400 hover:bg-red-500/8 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                  <LogOut size={16} />
                </div>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar — minimal: just the school name + avatar */}
        <div className="md:hidden flex items-center justify-between px-5 py-3.5 bg-dark-2 border-b border-white/[0.06]">
          <span className="font-wordmark font-bold text-[15px] text-white tracking-tight">Ugyen Academy</span>
          <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
            <span className="text-accent text-[11px] font-bold">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
        </div>

        {/* Page content — padded so it clears the bottom dock */}
        <main className="flex-1 overflow-auto p-6 md:p-8 pb-[88px] md:pb-8">
          {children}
        </main>

        {/* Bottom dock — mobile only */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch"
          style={{
            background: "rgba(14,14,16,0.92)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}>

          {dockItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 relative transition-all"
                style={{ WebkitTapHighlightColor: "transparent" }}>
                {/* Active pill */}
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full bg-accent" />
                )}
                <item.icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={`transition-colors ${active ? "text-accent" : "text-white/35"}`}
                />
                <span className={`text-[10px] font-semibold tracking-wide transition-colors ${
                  active ? "text-accent" : "text-white/30"
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More button */}
          {hasOverflow && (
            <button onClick={() => setSheetOpen(true)}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 relative"
              style={{ WebkitTapHighlightColor: "transparent" }}>
              {overflowActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full bg-accent" />
              )}
              <MoreHorizontal
                size={22}
                strokeWidth={1.8}
                className={`transition-colors ${overflowActive ? "text-accent" : "text-white/35"}`}
              />
              <span className={`text-[10px] font-semibold tracking-wide ${
                overflowActive ? "text-accent" : "text-white/30"
              }`}>
                More
              </span>
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
