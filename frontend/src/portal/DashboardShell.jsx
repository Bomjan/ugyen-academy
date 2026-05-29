import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, TrendingUp, CalendarCheck, Megaphone, CreditCard, Users, LogOut, Menu, X, BookMarked } from "lucide-react";
import { useState } from "react";

const navByRole = {
  admin: [
    { to: "/portal/admin",                icon: LayoutDashboard, label: "Dashboard" },
    { to: "/portal/admin/students",       icon: Users,           label: "Students" },
    { to: "/portal/admin/progress",       icon: TrendingUp,      label: "Progress" },
    { to: "/portal/admin/attendance",     icon: CalendarCheck,   label: "Attendance" },
    { to: "/portal/admin/announcements",  icon: Megaphone,       label: "Announcements" },
    { to: "/portal/admin/fees",           icon: CreditCard,      label: "Fees" },
  ],
  teacher: [
    { to: "/portal/teacher",              icon: LayoutDashboard, label: "Dashboard" },
    { to: "/portal/teacher/progress",     icon: TrendingUp,      label: "Student Progress" },
    { to: "/portal/teacher/attendance",   icon: CalendarCheck,   label: "Attendance" },
    { to: "/portal/teacher/announcements",icon: Megaphone,       label: "Announcements" },
    { to: "/portal/library/catalog",      icon: BookMarked,      label: "Library" },
    { to: "/portal/library/issues",       icon: BookMarked,      label: "Issue Books" },
  ],
  student: [
    { to: "/portal/student",             icon: LayoutDashboard, label: "Dashboard" },
    { to: "/portal/student/progress",    icon: TrendingUp,      label: "My Progress" },
    { to: "/portal/student/attendance",  icon: CalendarCheck,   label: "My Attendance" },
    { to: "/portal/student/announcements",icon: Megaphone,      label: "Notices" },
    { to: "/portal/student/fees",        icon: CreditCard,      label: "Fees" },
    { to: "/portal/library/catalog",     icon: BookMarked,      label: "Library" },
    { to: "/portal/library/my-books",    icon: BookMarked,      label: "My Books" },
  ],
  parent: [
    { to: "/portal/parent",              icon: LayoutDashboard, label: "Dashboard" },
    { to: "/portal/parent/progress",     icon: TrendingUp,      label: "Progress" },
    { to: "/portal/parent/attendance",   icon: CalendarCheck,   label: "Attendance" },
    { to: "/portal/parent/announcements",icon: Megaphone,       label: "Notices" },
    { to: "/portal/parent/fees",         icon: CreditCard,      label: "Fees" },
  ],
};

const roleColor = { admin: "bg-purple-500", teacher: "bg-blue-500", student: "bg-green-500", parent: "bg-orange-500" };

export default function DashboardShell({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const nav = navByRole[user?.role] || [];

  const handleLogout = () => { logout(); navigate("/portal/login"); };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? "w-full" : "w-60 shrink-0"} bg-dark-2 border-r border-white/5 flex flex-col`}>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white text-[10px] font-black">UA</span>
          </div>
          <span className="font-wordmark font-bold text-[15px] text-white group-hover:text-accent transition-colors tracking-tight">Ugyen Academy</span>
        </Link>
      </div>

      {/* User */}
      <div className="px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${roleColor[user?.role]} flex items-center justify-center shrink-0`}>
            <span className="text-white text-[11px] font-bold">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-[13px] font-medium truncate">{user?.name}</p>
            <p className="text-white/35 text-[11px] capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
                active ? "bg-accent/15 text-accent" : "text-white/45 hover:text-white hover:bg-white/5"
              }`}>
              <item.icon size={15} className="shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/35 hover:text-red-400 hover:bg-red-500/8 transition-colors">
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="flex flex-col w-72"><Sidebar mobile /></div>
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-dark-2 border-b border-white/5">
          <button onClick={() => setOpen(true)} className="text-white/60 hover:text-white"><Menu size={20} /></button>
          <span className="font-semibold text-[14px] text-white">Ugyen Academy</span>
          <div className={`w-7 h-7 rounded-full ${roleColor[user?.role]} flex items-center justify-center`}>
            <span className="text-white text-[10px] font-bold">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
        </div>

        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
